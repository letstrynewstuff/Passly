

// src/controllers/auth.controller.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/sendVerification.js";

const EMAIL_VERIFICATION_ENABLED =
  process.env.EMAIL_VERIFICATION_ENABLED === "true";

/**
 * ==========================
 * REGISTER USER
 * ==========================
 */
export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role = "user",
      companyName,
    } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (role === "planner" && !companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required for planners",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      ...(role === "planner" && { companyName }),
    });

    await user.save();

    // If email verification enabled
    if (EMAIL_VERIFICATION_ENABLED) {
      await sendVerificationEmail(user.email, user._id);

      return res.status(201).json({
        success: true,
        message: "User registered. Please verify your email.",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      success: true,
      token,
      role: user.role,
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/**
 * ==========================
 * LOGIN USER
 * ==========================
 * Supports:
 * - identifier (username OR email)
 * - optional role (planner)
 */
export const loginUser = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Identifier and password are required",
      });
    }

    // Build query
    const query = {
      $or: [{ email: identifier }, { username: identifier }],
    };

    // If role is provided (planner login), enforce it
    if (role) {
      query.role = role;
    }

    // Find user (include password)
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or role mismatch",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Email verification check
    if (EMAIL_VERIFICATION_ENABLED && !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please check your email.",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};


export const authUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * authAdmin
 * ---------
 * Same as authUser but also checks role === "admin".
 * Admin token is signed at login with { role: "admin" }.
 */
export const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access only" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


export const scannerLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username and password required' });
    }

    // Same lookup logic as normal login
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Only allow admin & planner
    if (!['admin', 'planner'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'This login is only for admins and event organizers',
      });
    }

    // Optional: check suspension, verification, etc.
    if (user.isSuspended) {
      return res.status(403).json({ success: false, message: 'Account is suspended' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // shorter for scanner sessions
    );

    return res.json({
      success: true,
      token,
      role: user.role,
      // optional: username, id, etc.
    });
  } catch (err) {
    console.error('Scanner login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};