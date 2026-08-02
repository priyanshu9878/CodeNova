import express from "express";
import { userMiddleware } from "../middleware/usermiddleware.js";
import {solveDoubt} from "../controllers/solveDoubt.js";
import { aiLimiter } from "../middleware/aiLimiter.js";

const chatRouter = express.Router();

 chatRouter.post("/chat",userMiddleware,aiLimiter,solveDoubt);

 export default chatRouter;