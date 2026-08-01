import express from "express";
import main from "./config/db.js";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import { RedisClient } from "./config/redis.js";

import authRouter from "./routes/userAuth.js";
import problemRouter from "./routes/problem.routes.js";
import submitRouter from "./routes/submit.route.js";
import chatRouter from "./routes/aichat.js";
import videoRouter from "./routes/videoCreator.js";

import cors from "cors";

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      // Add your frontend Render URL here after deployment
      // "https://your-frontend.onrender.com"
    ],
    credentials: true,
  })
);

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", chatRouter);
app.use("/video", videoRouter);

const InitializeConnection = async () => {
  try {
    await Promise.all([main(), RedisClient.connect()]);

    console.log("DB connected");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server listening at port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CodeNova Backend is running "
    });
});

InitializeConnection();
