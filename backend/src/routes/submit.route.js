import express from "express";
import { userMiddleware } from '../middleware/usermiddleware.js';
import {userSubmission,runCode} from "../controllers/userSubmission.js";
import {judge0RateLimiter} from "../middleware/ratelimiterMiddleware.js";

const submitRouter = express.Router();

submitRouter.post("/submit/:id",userMiddleware,judge0RateLimiter,userSubmission);
submitRouter.post("/run/:id",userMiddleware,judge0RateLimiter,runCode);

export default submitRouter;