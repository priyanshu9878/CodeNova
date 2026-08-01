import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const solveDoubt = async (req, res) => {
    try {
        const { messages, title, description, testCases, startCode } = req.body;

    //     console.log(req.body);
    //     console.log("Headers:", req.headers["content-type"]);
    // console.log("Body:", req.body);


        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const model = "gemini-flash-latest";

        const latestQuestion = messages[messages.length - 1].parts[0].text;

const contents = [
  {
    role: "user",
    parts: [
      {
        text: `
Problem Title:
${title}

Problem Description:
${description}

Visible Test Cases:
${JSON.stringify(testCases, null, 2)}

Starter Code:
${JSON.stringify(startCode, null, 2)}

Student Question:
${latestQuestion}
`
      }
    ]
  }
];

        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                 temperature: 0.2,
                systemInstruction: `
You are Codey, an AI coding mentor.

Rules:
- Answer ONLY questions related to the given programming problem.
- Explain concepts instead of directly giving complete solutions unless the user explicitly asks.
- Be concise and beginner-friendly.
- If the user asks something unrelated to the problem, politely refuse.
`
            }
        });

//         console.log(req.originalUrl);
// console.log(req.body);

        res.status(200).json({
            message: response.text
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};



// export const solveDoubt = async (req, res) => {
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);

//     res.json({
//         body: req.body
//     });
// };