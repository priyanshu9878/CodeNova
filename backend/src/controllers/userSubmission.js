import Problem from "../models/Problems.model.js";
import Submission from "../models/submission.model.js";
import {submitBatch,submitToken,getLanguageId, normalizeLanguage} from "../utils/problemutility.js"
import User from "../models/User.model.js";

export const userSubmission = async (req,res)=>{
    try{

        const userId = req.result._id;
        const problemId = req.params.id.trim();
         const { code, language } = req.body;

        if(!userId || ! problemId || !code || !language) return res.status(400).send("Missing fields");

        // fetch the problem from db and get test cases
        const problem = await Problem.findById(problemId);

        // storing submission first in db
      const submittedResult =  await Submission.create({
                   userId, problemId, code, language,
                    status: "pending",
                     testCasesTotal: problem.hiddenTestCases.length
});

        // submit code to judge0
        const languageId = getLanguageId(language);
         
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

const driver = problem.driverCode.find(
    d => normalizeLanguage(d.language) === normalizeLanguage(language)
);

if (!driver) {
    return res.status(400).json({
        message: `Driver code not found for ${language}`,
        availableLanguages: problem.driverCode.map(d => d.language)
    });
}


const executableCode = `
${code}

${driver.code}
`;

const submissions = problem.hiddenTestCases.map(testCase => ({
    source_code: executableCode,
    language_id: languageId,
    stdin: testCase.input,
    expected_output: testCase.output
})); 

        // function to submit code to judge0
   const submitResult = await submitBatch(submissions);

   const resultToken = submitResult.map((value)=> value.token);
    // O/P 'll be token of arrays which we'll send to judge0 to get ans
     const testResult = await submitToken(resultToken);

     const decode = (str) =>
    str ? Buffer.from(str, "base64").toString("utf8") : "";

const formattedResults = testResult.map(tc => ({
    ...tc,
    stdin: decode(tc.stdin),
    stdout: decode(tc.stdout),
    stderr: decode(tc.stderr),
    compile_output: decode(tc.compile_output),
    expected_output: decode(tc.expected_output)
}));

//      console.log("Judge0 Submit Result:");
// console.log(JSON.stringify(testResult, null, 2));

     let testCasesPassed=0;
     let runtime=0;
     let memory=0;
     let status = 'accepted'
     let errorMessage = null;
     // It's output is language_id, stdin,O/P, status_id, created_at, finished_at,time,memory, stderr, token
     for(const e of formattedResults){
      if (e.status.id === 3) {
    testCasesPassed++;
    runtime += parseFloat(e.time || 0);
    memory = Math.max(memory, e.memory || 0);
} else if (e.status.id === 4) {
    status = "wrong";
} else {
    status = "error";
    errorMessage = e.stderr || e.compile_output || e.message;
}
     }

     // storing result in db
     submittedResult.status = status;
     submittedResult.testCasesPassed = testCasesPassed;
     submittedResult.errorMessage = errorMessage;
     submittedResult.runtime = runtime;
     submittedResult.memory = memory;

     await submittedResult.save();

     // saving that problem into user db(as it is solved by him)
       // insert problem id into user schema's problem solved if not present there

     if (status === "accepted" &&!req.result.problemsSolved.includes(problemId)){
    req.result.problemsSolved.push(problemId);
    await req.result.save();
}


//      console.log({
//     status,
//     testCasesPassed,
//     total: problem.hiddenTestCases.length,
//     runtime,
//     memory,
//     errorMessage
// });
    res.status(201).send(submittedResult);

    }catch(error){
        res.status(500).send("Error: "+ error);
    }
}

export const runCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id.trim();
        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Missing fields");
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const languageId = getLanguageId(language);

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

        const driver = problem.driverCode.find(
            d => normalizeLanguage(d.language) === normalizeLanguage(language)
        );

        if (!driver) {
            return res.status(400).json({
                message: `Driver code not found for ${language}`
            });
        }

        
        const executableCode = `
${code}

${driver.code}
`;

        const submissions = problem.visibleTestCases.map(testCase => ({
            source_code: executableCode,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output
        }));

        const submitResult = await submitBatch(submissions);
        const tokens = submitResult.map(x => x.token);

        const testResult = await submitToken(tokens);

        const decode = (str) =>
            str ? Buffer.from(str, "base64").toString("utf8") : "";

        const formattedResults = testResult.map(tc => ({
            ...tc,
            stdin: decode(tc.stdin),
            stdout: decode(tc.stdout),
            stderr: decode(tc.stderr),
            compile_output: decode(tc.compile_output),
            expected_output: decode(tc.expected_output)
        }));

        const success = formattedResults.every(tc => tc.status.id === 3);

        const runtime = formattedResults.reduce(
            (sum, tc) => sum + parseFloat(tc.time || 0),
            0
        );

        const memory = Math.max(
            ...formattedResults.map(tc => tc.memory || 0)
        );

        return res.status(200).json({
            success,
            runtime,
            memory,
            testCases: formattedResults
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
};
