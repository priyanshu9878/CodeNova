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
      // console.dir(error, { depth: null });
      // console.log("name:", error.name);
      // console.log("message:", error.message);
      // console.log("code:", error.code);
      // console.log("cause:", error.cause);
      // console.log("response:", error.response?.data);
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
