import express from "express";
const problemRouter = express.Router();

import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { userMiddleware } from "../middleware/usermiddleware.js";

import {
  createProblem,
  updateProblem,
  deleteProblem,
  fetchProblembyId,
  getAllProblem,
  getAllProblemsAdmin,
  AllSolvedProblems,
  submittedProblem, getAllProblemsAdmin
} from "../controllers/userProblem.js";

// Create
problemRouter.post("/create", adminMiddleware, createProblem);

// Update
problemRouter.put("/update/:id", adminMiddleware, updateProblem);

// Delete
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

// Fetch single problem
problemRouter.get("/problemById/:id", userMiddleware, fetchProblembyId);

// User homepage (Paginated)
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);

// Admin (Fetch ALL problems)
problemRouter.get("/admin/all", adminMiddleware, getAllProblemsAdmin);

// Solved problems
problemRouter.get("/problemSolvedByUser", userMiddleware, AllSolvedProblems);

// User submissions
problemRouter.get("/submittedProblem/:id", userMiddleware, submittedProblem);

export default problemRouter;