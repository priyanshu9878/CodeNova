import {mongoose,Schema} from "mongoose";
import Problem from "./Problems.model.js";

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:20
    },
    lastName:{
        type:String,
        minlength:3,
        maxlength:20
    },
    emailId:{
        type:String,
        required: [true, "Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        immutable:true
     },
     password:{
        type:String,
        required:true,
    },
    age:{
        min:10,
        max:60,
        type:Number
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    problemsSolved:{
       type:[{
        type: Schema.Types.ObjectId,
        ref:'Problem',
       }],
        default: [],
    }
},{
  timestamps:true  
});

const User = mongoose.model("User",userSchema);
export default User;