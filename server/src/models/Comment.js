// src/models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for fast retrieval
commentSchema.index({ event: 1, createdAt: -1 });
commentSchema.index({ user: 1, event: 1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
