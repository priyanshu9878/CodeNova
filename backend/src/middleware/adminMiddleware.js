import jwt from "jsonwebtoken"; 
import User from '../models/User.model.js';
import { RedisClient } from "../config/redis.js";

export const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token)
            throw new Error("Token is not present");

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { _id } = payload;

        const result = await User.findById(_id);

        if (!result)
            throw new Error("User does not exist!");

        const isBlocked = await RedisClient.exists(`token:${token}`);

        if (isBlocked)
            throw new Error("Invalid token, user logged out");

        if (result.role !== "admin") {
            throw new Error("You are not admin!");
        }

        req.result = result;

        next();

    } catch (error) {
        return res.status(403).json({
            message: error.message
        });
    }
};