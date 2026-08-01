import express from "express";
import {adminMiddleware} from "../middleware/adminMiddleware.js";
import {generateUploadSignature,saveVideoMetadata,deleteVideo} from "../controllers/videoSection.js";

const videoRouter = express.Router();

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);


export default videoRouter;