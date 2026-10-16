// src/controllers/comment.controller.js
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Comment from "../models/Comment.js";

// POST /api/events/:id/comments  (logged-in users only)
export const createComment = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const content = String(req.body?.content || "").trim();

    if (!mongoose.isValidObjectId(eventId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event id" });
    }
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Comment cannot be empty" });
    }
    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Comment is too long (max 500 characters)",
      });
    }

    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const created = await Comment.create({
      event: eventId,
      user: req.user.id,
      content,
    });

    // Return it in the same shape the feed already displays (with username)
    const comment = await Comment.findById(created._id)
      .populate("user", "username profileImage")
      .select("content createdAt user")
      .lean();

    return res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/events/:id/comments/:commentId  (owner or admin)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid comment id" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    const isOwner = String(comment.user) === String(req.user.id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not allowed to delete this comment",
        });
    }

    await comment.deleteOne();
    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
