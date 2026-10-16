


// src/app.js
import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import profileRoutes from "./routes/profile.routes.js";
import eventRoutes from "./routes/event.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import publicEventsRoutes from "./routes/events.public.routes.js";
import adminRoutes from "./routes/adminRoutes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import scannerRouter from "./routes/scanner.routes.js";
import locationRouter from "./routes/location.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

// Needed when hosted behind a proxy (Render, Railway, etc.) so req.ip is the
// real client IP. Remove it if you run without any proxy.
app.set("trust proxy", 1);

const avatarDir = path.join(process.cwd(), "uploads/avatars");
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

// Folder for the seeded event flyers (served at /uploads/events/<file>)
const eventsDir = path.join(process.cwd(), "uploads/events");
if (!fs.existsSync(eventsDir)) fs.mkdirSync(eventsDir, { recursive: true });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARE =====
app.use(cors()); // Enable CORS for all origins (change in production)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// ===== MOUNT ROUTES =====
app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", (req, res, next) => {
  console.log("🎫 TICKET ROUTE HIT:", req.method, req.url);
  next();
});
// app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", ticketRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/events", publicEventsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/scanner", scannerRouter);
app.use("/api/locations", locationRouter);
app.use("/api/events", commentRoutes);

// Catch-all at the end
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

export default app;