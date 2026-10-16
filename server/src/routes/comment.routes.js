// src/routes/comment.routes.js
import express from "express";
import { authUser } from "../controllers/auth.controller.js";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:id/comments", authUser, createComment);
router.delete("/:id/comments/:commentId", authUser, deleteComment);

export default router;
