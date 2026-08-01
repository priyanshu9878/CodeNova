import User from '../models/User.model.js';
import validate from '../utils/validator.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RedisClient } from "../config/redis.js";
import Submission from "../models/submission.model.js";

dotenv.config();

export const Register = async(req,res)=>{

    try{
        validate(req.body);
        const{firstName,emailId,password} = req.body;

      const exists = await User.findOne({emailId});
      if(exists) throw new Error("user with this emailId already exists!");
     
      req.body.role = 'user';   // default user set

    req.body.password =  await bcrypt.hash(password,10);
    const user =  await User.create(req.body);
    
    // sending token 
    const token = jwt.sign({emailId:emailId,_id:user._id,role:'user'},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
   const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  maxAge: 60 * 60 * 1000,
});

    const reply = {
        firstName : user.firstName,
        emailId : user.emailId,
        _id : user._id,
        role:user.role
    }

   res.status(201).json({
        user:reply,
        message:"Registered successfully!!"
    });

    }
    catch(error){
    res.status(400).send("ERROR: "+ error);
    }
}

export const Login = async(req,res)=>{
try{
    const {emailId,password} = req.body;

    if(!emailId || !password) throw new Error("Invalid Credentials!!");

    const user = await User.findOne({emailId});
    if (!user) {
    throw new Error("Invalid credentials");
}

    // now compare pass
    const match = await bcrypt.compare(password,user.password);
    if(!match) throw new Error("Invalid credentials to login");


    const reply = {
        firstName : user.firstName,
        emailId : user.emailId,
        _id : user._id,
        role:user.role
    }

     const token = jwt.sign({emailId:emailId,_id:user._id, role:user.role},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
    const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  maxAge: 60 * 60 * 1000,
});

    res.status(200).json({
        user:reply,
        message:"loggedIn successfully!!"
    });

}catch(error){
  res.status(401).send("ERROR: "+ error);
}
}

export const Logout = async(req,res)=>{
 try{

    // validate the token first(middleware) and then add it to redis blacklist
    const {token} = req.cookies;
    const payload = jwt.decode(token);

    await RedisClient.set(`token:${token}`, `Blocked`);   //  KEY:VALUE pair
    await RedisClient.expireAt(`token:${token}`,payload.exp);

       // token null v kr diya
       const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", "", {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  expires: new Date(0),
});

    res.send("Logged Out successfully");

 }catch(error){
    res.status(503).send("Error is: "+ error);
 }
}

export const AdminRegister= async(req,res)=>{
    try{
        validate(req.body);
        const{firstName,emailId,password} = req.body;

        //  req.body.role = 'admin';  admin can register himself OR other as both admin/user
         req.body.password =  await bcrypt.hash(password,10);
         
         const user =  await User.create(req.body);
    
    // sending token 
    const token = jwt.sign({emailId:emailId,_id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn: 60*60});
    const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  maxAge: 60 * 60 * 1000,
});

    res.status(201).send("admin registered successfully!!");
         

    }catch(error){

    }
}

export const GetProfile = async(req,res)=>{

}

export const deleteProfile = async(req,res)=>{
    try{
        const userId = req.result._id;

      await  User.findByIdAndDelete(userId);

      // delete submissions too
   await Submission.deleteMany({userId});;  // deletemany jaha-jaha userId hogi vo sari fields delete ho jayegi

   res.status(200).send("Profile deleted successfully");


    }catch(error){
        res.status(500).send("Error is: "+ error); 
    }
}