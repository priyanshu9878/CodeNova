import express from "express";
const problemRouter = express.Router();
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import  {createProblem,updateProblem,deleteProblem,fetchProblembyId,getAllProblem,AllSolvedProblems,submittedProblem} from "../controllers/userProblem.js";
import {userMiddleware} from "../middleware/usermiddleware.js";

// create
problemRouter.post("/create",adminMiddleware,createProblem);
// update
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
// // delete
 problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);
// // fetch
 problemRouter.get("/problemById/:id",userMiddleware,fetchProblembyId);
 problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
// // solved problems
 problemRouter.get("/problemSolvedByUser",userMiddleware,AllSolvedProblems);

// submissions made by him
problemRouter.get("/submittedProblem/:id",userMiddleware,submittedProblem);

export default problemRouter;