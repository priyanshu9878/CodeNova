import jwt from "jsonwebtoken"; 
import User from '../models/User.model.js';
import { RedisClient } from "../config/redis.js";

export const userMiddleware = async function (req,res,next) {
    try{
        const {token} = req.cookies;
        if(!token) throw new Error("Token is not present");

      const payload =  jwt.verify(token,process.env.JWT_SECRET_KEY);

      const {_id} = payload;
      if(!_id) throw new Error("Id is missing");

      const result = await User.findById(_id);
      if(!result) throw new Error("User do not exists!");

       // check whether he existes in redis
       const isblocked = await RedisClient.exists(`token:${token}`);

       if(isblocked) throw new Error("Invalid token, user logged Out");

       req.result = result;
       next();

    }catch (error) {
    return res.status(401).json({
        message: error.message
    });
}
}