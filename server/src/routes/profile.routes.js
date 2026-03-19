// import express from "express";
// import { authenticateJWT, requireRole } from "../middleware/auth.middleware.js";
// import {
//   getUserProfile,
//   updateUserProfile,
//   switchUserRole,
//   updateAvatarStyle,
// } from "../controllers/profile.controller.js";

// const router = express.Router();

// /* ================= AUTH ================= */

// router.use(authenticateJWT);

// /* ================= SELF ================= */

// // Update own profile
// router.put("/me", updateUserProfile);

// // Update own avatar style
// router.put("/me/avatar", updateAvatarStyle);

// /* ================= ADMIN ================= */

// router.post(
//   "/:userId/role-switch",
//   requireRole(["admin", "planner"]),
//   switchUserRole,
// );

// /* ================= PUBLIC ================= */

// // View public profile (KEEP LAST)
// router.get("/:userId", getUserProfile);

// export default router;


// src/routes/profile.routes.js
import express from "express";
import { authenticateJWT, requireRole } from "../middleware/auth.middleware.js";
import {
  getPublicProfile, // NEW: public view
  getPrivateProfile, // NEW: self/private view
  updateUserProfile,
  switchUserRole,
  updateAvatarStyle,
} from "../controllers/profile.controller.js";

const router = express.Router();

/* ================= PROTECTED (AUTH REQUIRED) ================= */
router.use(authenticateJWT);

// Self/private profile (must be before /:userId to avoid collision)
router.get("/me", getPrivateProfile);

// Update own profile
router.put("/me", updateUserProfile);

// Update own avatar style
router.put("/me/avatar", updateAvatarStyle);

// Self role switch (user -> planner only)
router.post("/me/role-switch", switchUserRole); // No requireRole — allow self-upgrade

/* ================= PUBLIC (NO AUTH) ================= */

// View public profile (dynamic :userId — KEEP LAST)
router.get("/:userId", getPublicProfile);

export default router;