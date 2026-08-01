import {Schema,mongoose} from "mongoose";
import User from '../models/User.model.js';
import Problem from "./Problems.model.js";

const submissionSchema = new Schema({
    userId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
},
problemId:{
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true
},
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:["javascript","cpp","java"]
    },
    status:{
        type:String,
        enum:["pending","accepted","wrong","error"],
        default:"pending"
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasesPassed:{
        type:String,
        default:0
    },
    testCasesTotal:{
        type:Number,
        default:0
    },
},{
    timestamps:true
})

submissionSchema.index({ userId:1 , problemId:1});

const Submission = mongoose.model("Submission",submissionSchema);
export default Submission;