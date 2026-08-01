import {mongoose,Schema} from "mongoose"; 
import User from '../models/User.model.js';

const problemSchema = new Schema({

    title:{
        type:String,
        unique:true,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum : ["easy","medium","hard"],
        required:true
    },
    tags:{
        type:String,
        required:true,
        enum: ["array","linked-list","trees","graphs","dp"]
    },
    driverCode: [
  {
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
],
    referenceSolution:[
        {
            language:{
                type:String,
                required:true
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},{
    timestamps:true
})

const Problem = mongoose.model("Problem",problemSchema);
export default Problem;