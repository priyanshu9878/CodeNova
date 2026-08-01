import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getLanguageId = (lang) => {
  switch (lang.toLowerCase()) {
    case "cpp":
    case "c++":
      return 54;
    case "java":
      return 62;
    case "javascript":
    case "js":
      return 63;
    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
};

export const normalizeLanguage = (lang) => {
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

const encode = (str) => Buffer.from(str ?? "", "utf8").toString("base64");

// Helper to decode Base64 strings returned by Judge0
export const decode = (str) => {
  return str ? Buffer.from(str, "base64").toString("utf8") : "";
};

export const submitBatch = async (submissions) => {
  const response = await axios.post(
    "https://ce.judge0.com/submissions/batch",
    {
      submissions: submissions.map((s) => ({
        source_code: encode(s.source_code),
        language_id: s.language_id,
        stdin: encode(s.stdin),
        expected_output: encode(s.expected_output),
      })),
    },
    {
      params: {
        base64_encoded: true,
      },
    }
  );

  return response.data;
};

const waiting = (timer) =>
  new Promise((resolve) => setTimeout(resolve, timer));

export const submitToken = async (resultToken) => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://ce.judge0.com/submissions/batch",
        {
          params: {
            tokens: resultToken.join(","),
            base64_encoded: true,
            fields: "*",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.dir(error, { depth: null });
      console.log("name:", error.name);
      console.log("message:", error.message);
      console.log("code:", error.code);
      console.log("cause:", error.cause);
      console.log("response:", error.response?.data);
      throw error;
    }
  };

  while (true) {
    const result = await fetchData();

    const isObtained = result.submissions.every(
      (submission) => submission.status.id > 2
    );

    if (isObtained) {
      return result.submissions;
    }

    await waiting(1000);
  }
};


        // export const submitToken = async(resultToken)=>{
           
        
        // const options = {
        //   method: 'GET',
        //   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        //   params: {
        //     tokens: resultToken.join(","),
        //     base64_encoded: 'true',
        //     fields: '*'
        //   },
        //   headers: {
        //     'x-rapidapi-key': '2d7659de68mshb6447bfb360ee6ap17e1f5jsn435d2b1c527e',
        //     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        //     'Content-Type': 'application/json'
        //   }
        // };
        
        // async function fetchData() {
        // 	try {
        // 		const response = await axios.request(options);
        // 		 return response.data;
        // 	} catch (error) {
        // 		console.error(error);
        // 	}
        // }
        
        // while(true){
        //   const result = await fetchData();
         
        //    //now calling function till we get status id == 3
        //    const isObtained = result.submissions.every ((e)=>e.status_id>2);
        //     if(isObtained) return result.submissions;
         
        //     await waiting(1000);
        // }
        
// mine
// export const submitBatch = async(submissions)=>{

// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     base64_encoded: 'false'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.RAPID_API_KEY,
//     'x-rapidapi-host': 'https://ce.judge0.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
//     console.log("Full response:", response.data);
// 	} catch (error) {
// 		console.error("Judge0 Error:", error.message);
    
//     console.log(error.response?.status);
//     console.log(error.response?.data);

//     throw error;
// 	}
// }

// return await fetchData();
// }


    // IMPORTED
// export const submitBatch = async(submissions) => {
//     const options = {
//         method: 'POST',
//         url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//         params: {
//             base64_encoded: 'false'
//         },
//         headers: {
//             // It's generally better to use environment variables for API keys
//             // 15a5060426msh16d30e2b3812e73p1f6489jsn1173fa73d42c
//             'x-rapidapi-key': 'cd967ad053msh1060205bf58c511p11c65ajsn41f8e149e59e',
//             // cd967ad053msh1060205bf58c511p11c65ajsn41f8e149e59e',
//             // 83132b7981msh754a9987688db5ep1e4852jsn1e82551aa435
//             // a3d266026mshb586366240462d3p13e1f3jsnf71f9e1eedf2',
//             'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//             'Content-Type': 'application/json'
//         },
//         data: {
//             submissions
//         }
//     };

//     try {
//         const response = await axios.request(options);
//         return response.data;
//     } catch (error) {
//         console.error("Error submitting batch to Judge0:", error.message || error);
//         // It's good practice to rethrow or handle the error appropriately
//         throw new Error("Failed to submit batch to Judge0.");
//     }
// };





// org
// export const submitBatch = async (submissions) => {
//   try {
//     const response = await axios.post(
//       "https://ce.judge0.com/submissions/batch",
//       { submissions },
//       {
//         params: {
//           base64_encoded: false,
//         },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//    // console.log("Full response:", response.data);

//     return response.data;
//   } catch (error) {
//   console.dir(error, { depth: null });

//   console.log("name:", error.name);
//   console.log("message:", error.message);
//   console.log("code:", error.code);
//   console.log("cause:", error.cause);
//   console.log("response:", error.response?.data);

//   throw error;
// }
// };
        // }