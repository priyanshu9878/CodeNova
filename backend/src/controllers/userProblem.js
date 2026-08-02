import Problem from "../models/Problems.model.js";
import {getLanguageId,submitBatch,submitToken,decode} from "../utils/problemutility.js"
import User from '../models/User.model.js';
import Submission from "../models/submission.model.js";
import SolutionVideo from "../models/solutionVideo.js";

export const createProblem = async (req, res) => {
  try {
    const {
      referenceSolution,
      driverCode,
      visibleTestCases,
      helperCode = [],
    } = req.body;

    const getHeader = (language) => {
      switch (language.toLowerCase()) {
        case "cpp":
        case "c++":
          return "#include <bits/stdc++.h>\nusing namespace std;";

        case "java":
          return "import java.util.*;";

        case "javascript":
        case "js":
          return "";

        default:
          return "";
      }
    };

    const normalizeLanguage = (lang) => {
      switch (lang.toLowerCase()) {
        case "cpp":
        case "c++":
          return "cpp";

        case "java":
          return "java";

        case "javascript":
        case "js":
          return "javascript";

        default:
          return lang.toLowerCase();
      }
    };

    for (const ref of referenceSolution) {
      const language = ref.language;
      const completeCode = ref.completeCode;
      const languageId = getLanguageId(language);

      // Driver Code
      const driver = driverCode.find(
        (d) =>
          normalizeLanguage(d.language) ===
          normalizeLanguage(language)
      );

      if (!driver) {
        return res.status(400).json({
          message: `Driver code missing for ${language}`,
        });
      }

      // Helper Code (optional)
      const helper = helperCode.find(
        (h) =>
          normalizeLanguage(h.language) ===
          normalizeLanguage(language)
      );

      // Final executable program
      const executableCode = `
${getHeader(language)}

${helper?.code || ""}

${completeCode}

${driver.code}
`;

      console.log("========== CODE ==========");
      console.log(executableCode);
      console.log("==========================");

      const submissions = visibleTestCases.map((testCase) => ({
        source_code: executableCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      // Submit to Judge0
      const submitResult = await submitBatch(submissions);

      const resultTokens = submitResult.map((item) => item.token);

      const testResults = await submitToken(resultTokens);

      for (const result of testResults) {
        if (result.status.id !== 3) {
          const decodedStdout = decode(result.stdout);
          const decodedStderr = decode(result.stderr);
          const decodedCompileOutput = decode(result.compile_output);

          console.error("=== TEST CASE FAILED ===");
          console.error("Status:", result.status);
          console.error("Compile Output:\n", decodedCompileOutput);
          console.error("StdErr:\n", decodedStderr);
          console.error("StdOut:\n", decodedStdout);
          console.error("========================");

          return res.status(400).json({
            message: `Validation failed: ${result.status.description}`,
            status: result.status,
            compile_output: decodedCompileOutput,
            stderr: decodedStderr,
            stdout: decodedStdout,
          });
        }
      }
    }

    await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    return res.status(201).json({
      message: "Problem saved successfully",
    });

  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProblem = async(req,res)=>{
  try{

       const {id} = req.params;

       if(!id) return res.status(400).send("Missing ID");

       const idexist = await Problem.findById(id);
       if(!idexist)  return res.status(404).send("Problem doesn't exists");

        const{title, description,difficulty,tags,referenceSolution, driverCode,
         visibleTestCases,hiddenTestCases,startCode,problemCreator
       } = req.body;

  for(const {language,completeCode} of referenceSolution){

  const languageId = getLanguageId(language);

  // creating batch for submission array for each language
  const submissions = visibleTestCases.map((testCase) => ({
  source_code: completeCode,
  language_id: languageId,
  stdin: testCase.input,
  expected_output: testCase.output,
}));  

// function to submit code to judge0
 const submitResult = await submitBatch(submissions)
 //console.log("submitResult =", submitResult);
 
 const resultToken = submitResult.map((value)=> value.token);
 // O/P 'll be token of arrays which we'll send to judge0 to get ans
  const testResult = await submitToken(resultToken);

  // now O/P'll be(after sending array of tokens) array of  { language_id,o/p, token,status_id}
  for(const e of testResult){
    if(e.status_id!=3)  return res.status(400).send("Error occured");
  }

}

 const newProblem =  await Problem.findByIdAndUpdate(id, {...req.body},{runValidators:true, new:true, returnDocument: "after"});  // new:true always returns me updated 

   res.status(200).send(newProblem);

  }catch(error){
    res.status(500).send("Error: "+error);
  }
}

export const deleteProblem = async(req,res)=>{
  try{
     const id = req.params.id.trim();
    

     const findproblem = await Problem.findById(id);
     if(!findproblem) return res.send("problem do not exists");

     const deletedproblem = await Problem.findByIdAndDelete(id);
     res.status(200).send({
     message: "Problem deleted successfully",
     deletedProblem: deletedproblem,
  });

  }catch(error){
    res.status(500).send("Error is:"+ error);
  }
}

export const fetchProblembyId = async(req,res)=>{
  try{
    const id = req.params.id.trim();
     if(!id) return res.status(400).send("Problem ID doesn't exists");

    // const findproblem =await Problem.findById(id).select(' _id title startCode visibleTestCases tags  difficulty description')

    const findproblem = await Problem.findById(id).select(
  "title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution driverCode"
);

if (!findproblem) {
  return res.status(404).send("Problem doesn't exist");
}

const videos = await SolutionVideo.findOne({ problemId: id });

const problem = findproblem.toObject();

if (videos) {
  problem.secureUrl = videos.secureUrl;
  problem.cloudinaryPublicId = videos.cloudinaryPublicId;
  problem.thumbnailUrl = videos.thumbnailUrl;
  problem.duration = videos.duration;
}

return res.status(200).json(problem);
  }
  catch(error){
    res.status(500).send("Error: "+error);
  }
}


export const getAllProblem = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const { difficulty, tag } = req.query;

    const filter = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (tag) {
      filter.tags = tag; // if tags is an array
    }

    const totalProblems = await Problem.countDocuments(filter);

    const problems = await Problem.find(filter)
      .select("_id title difficulty tags")
      .skip(skip)
      .limit(limit);

   res.status(200).json({
  problems,
  currentPage: page,
  totalPages: Math.ceil(totalProblems / limit),
});

  } catch (error) {
    res.status(500).send("Error: " + error);
  }
};

export const AllSolvedProblems  = async(req,res) =>{
  try{

    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path:"problemsSolved",
      select: "_id title difficulty tags"
    });  //  populate ==> jisko refer kr rha hai uski info v lao (like JOIN)

    res.status(200).send(user.problemsSolved);

 }
  catch(error){
    res.status(500).send("Error: "+ error);
  }
}

export const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const ans = await Submission.find({ userId, problemId })
      .sort({ createdAt: -1 });

    return res.status(200).json(ans);

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAllProblemsAdmin = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("_id title difficulty tags")
      .sort({ createdAt: -1 });

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};