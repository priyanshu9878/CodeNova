//import axios from "axios";

// async function test() {
//   try {
//     const response = await axios.post(
//       "https://ce.judge0.com/submissions/batch",
//       {
//         submissions: [
//           {
//             source_code: "print(2+3)",
//             language_id: 71,
//             stdin: "",
//             expected_output: "5"
//           }
//         ]
//       },
//       {
//         params: {
//           base64_encoded: false
//         }
//       }
//     );

//     console.log(response.data);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//   }
// }


import axios from "axios";

const token = "e026a5b2-084c-497c-bd49-ef132bbf87ee";

async function test() {
  try {
    const response = await axios.get(
      "https://ce.judge0.com/submissions/batch",
      {
        params: {
          tokens: token,
          base64_encoded: false,
          fields: "*"
        }
      }
    );

    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}


test();