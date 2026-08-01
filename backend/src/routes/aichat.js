import express from "express";
import { userMiddleware } from "../middleware/usermiddleware.js";
import {solveDoubt} from "../controllers/solveDoubt.js";

const chatRouter = express.Router();

 chatRouter.post("/chat",userMiddleware,solveDoubt);

 export default chatRouter;