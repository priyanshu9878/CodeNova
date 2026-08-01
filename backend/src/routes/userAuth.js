import express from "express";
const authRouter = express.Router();

import { userMiddleware } from '../middleware/usermiddleware.js';
import {Register,Login,Logout,AdminRegister,deleteProfile} from "../controllers/userAuthenticate.js"
import { adminMiddleware } from "../middleware/adminMiddleware.js";

// register user
authRouter.post("/register",Register);
// login user
authRouter.post("/login",Login);
// logout user
authRouter.post("/logout",userMiddleware,Logout);
// getprofile
//authRouter.get("/profile",GetProfile);
//deleting profile

authRouter.delete("/profile",userMiddleware,deleteProfile);

// admin register
 authRouter.post("/admin/register",adminMiddleware,AdminRegister);
 
 // for checking is user authenticated, whenever he hits our site
 authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply = {
        firstName: req.result.firstName,
        emailId : req.result.emailId,
        _id: req.result._id,
       role: req.result.role
    }

    res.status(200).json({
        user:reply,
        message:"valid user"
    })
 });

export default authRouter;