

// src/routes/events.routes.js
import express from "express";
// import multer from "multer";
import { authenticateJWT, requireRole } from "../middleware/auth.middleware.js";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} from "../controllers/event.controller.js";
import { uploadEventMedia } from "../middleware/upload.middleware.js";

const router = express.Router();

// const upload = multer({ dest: "uploads/" });
const requirePlanner = requireRole(["planner"]);

/* PUBLIC */
router.get("/", getAllEvents);

/* PLANNER ONLY */
router.get("/my-events", authenticateJWT, requirePlanner, getMyEvents);


router.get("/:id", getEventById);



router.post(
  "/",
  authenticateJWT,
  requirePlanner,
  (req, res, next) => {
    console.log("Middleware chain working");
    next();
  },
  // upload.array("media"),
  uploadEventMedia,
  createEvent,
);


router.put(
  "/:id",
  authenticateJWT,
  requirePlanner,
  // upload.array("media"),
  uploadEventMedia,
  updateEvent,
);

router.delete("/:id", authenticateJWT, requirePlanner, deleteEvent);

export default router;





// import express from "express";
// import multer from "multer";
// import { authenticateJWT, requireRole } from "../middleware/auth.middleware.js";
// import {
//   getAllEvents,
//   getEventById,
//   createEvent,
//   updateEvent,
//   deleteEvent,
//   getMyEvents,
// } from "../controllers/event.controller.js";

// const router = express.Router();

// // Setup multer for file uploads
// const upload = multer({ dest: "uploads/" });

// // Shortcut middleware for planner-only access
// const requirePlanner = requireRole(["planner"]);

// // Public routes
// router.get("/", getAllEvents);
// // Planner-only: get events created by logged-in planner
// router.get(
//   "/my-events",
//   authenticateJWT,
//   requirePlanner,
//   getMyEvents
// );

// router.get("/:id", getEventById);

// // Planner-only routes (protected)
// router.post("/", authenticateJWT, requirePlanner, upload.array("media"), createEvent);
// router.put("/:id", authenticateJWT, requirePlanner, upload.array("media"), updateEvent);
// router.delete("/:id", authenticateJWT, requirePlanner, deleteEvent);

// export default router;
