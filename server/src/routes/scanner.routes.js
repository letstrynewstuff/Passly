// src/routes/scanner.routes.js
import express from "express";
import { validateTicket } from "../controllers/scanner.controller.js";
import { authenticateJWT, requireRole } from "../middleware/auth.middleware.js";
import { restrictToEventOwner } from "../middleware/eventAccess.middleware.js";

const router = express.Router();

router.post(
  "/validate",
  authenticateJWT,
  requireRole(["admin", "planner"]),
  restrictToEventOwner, // only runs for planners
  validateTicket,
);

export default router;
