// src/routes/auth.routes.js
import express from "express";
import {
  registerUser,
  // verifyAccount,
  loginUser,
  scannerLogin,
} from "../controllers/auth.controller.js";
const router = express.Router();
// Registration route
router.post("/register", registerUser);
// Verification route (even if disabled, keep for future)
// router.post("/verify", verifyAccount);
// Login route
router.post("/login", loginUser);


router.post("/scanner-login", scannerLogin);
export default router;


