import mongoose from "mongoose";
import User from "./User.model.js";
import Problem from "./Problems.model.js";


const { Schema } = mongoose;

const videoSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
    },
    secureUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SolutionVideo = mongoose.model("SolutionVideo", videoSchema);
export default SolutionVideo;