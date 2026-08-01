import axios from "axios";

try {
    const res = await axios.get("https://ce.judge0.com/languages", {
        timeout: 20000
    });

    console.log(res.data.length);
}
catch(err){
    console.dir(err,{depth:null});
}