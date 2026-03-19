import express from "express";
import {
  getPublicEvents,
  getPublicEventById,
  getEventComments,
} from "../controllers/events.public.controller.js";

const router = express.Router();

// Public read-only routes (no authentication required)
router.get("/", getPublicEvents);
router.get("/:id", getPublicEventById);
router.get("/:id/comments", getEventComments);

export default router;
