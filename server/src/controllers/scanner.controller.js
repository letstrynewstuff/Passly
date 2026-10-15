

// // src/controllers/scanner.controller.js
// import Ticket from "../models/Ticket.js";
// import Event from "../models/Event.js";
// import ScanLog from "../models/ScanLog.js";

// export const validateTicket = async (req, res) => {
//   try {
//     const { ticketCode, eventId } = req.body;  // ← ticketCode instead of ticketId

//     if (!ticketCode || !eventId) {
//       return res.status(400).json({
//         success: false,
//         message: "ticketCode and eventId required",
//       });
//     }

//     let ticket = await Ticket.findOne({ ticketCode: ticketCode.toUpperCase() })
//       .populate("userId", "username email")
//       .populate("eventId", "title createdBy")
//       .populate("usedBy", "username email role");

//     if (!ticket) {
//       await logScan(null, eventId, req.user.id, false, "Ticket not found");
//       return res.status(404).json({
//         success: false,
//         message: "Ticket not found",
//       });
//     }

//     if (ticket.ticketPrice === undefined || ticket.ticketPrice === null) {
//       ticket.ticketPrice = ticket.totalPrice || 0;
//     }

//     if (ticket.eventId._id.toString() !== eventId) {
//       await logScan(ticket._id, eventId, req.user.id, false, "Wrong event");
//       return res.status(403).json({
//         success: false,
//         message: "Ticket does not belong to this event",
//       });
//     }

//     // Already used — return full ticket data so frontend can display it
//     if (ticket.status === "used") {
//       await logScan(ticket._id, eventId, req.user.id, false, "Already used");
//       return res.status(409).json({
//         success: false,
//         message: "Ticket already used",
//         alreadyUsed: true,
//         ticket: {
//           _id: ticket._id.toString(),
//           ticketCode: ticket.ticketCode,
//           username: ticket.userId?.username || "Unknown",
//           email: ticket.userId?.email || "—",
//           ticketTypeName: ticket.ticketTypeName,
//           quantity: ticket.quantity,
//           eventTitle: ticket.eventId?.title || "—",
//           usedAt: ticket.usedAt?.toISOString() || null,
//           usedBy: ticket.usedBy
//             ? {
//                 id: ticket.usedBy._id?.toString(),
//                 username: ticket.usedBy.username || "—",
//                 email: ticket.usedBy.email || "—",
//                 role: ticket.usedBy.role || "—",
//               }
//             : null,
//         },
//       });
//     }

//     if (ticket.status !== "active") {
//       await logScan(ticket._id, eventId, req.user.id, false, `Invalid status: ${ticket.status}`);
//       return res.status(400).json({
//         success: false,
//         message: `Ticket is ${ticket.status}`,
//       });
//     }

//     // Mark as used
//     ticket.status = "used";
//     ticket.usedAt = new Date();
//     ticket.usedBy = req.user?._id || null;

//     await ticket.save();

//     ticket = await Ticket.findById(ticket._id)
//       .populate("userId", "username email")
//       .populate("eventId", "title")
//       .populate("usedBy", "username email role");

//     await logScan(ticket._id, eventId, req.user.id, true, "Valid ticket");

//     return res.json({
//       success: true,
//       message: "Valid ticket",
//       ticket: {
//         _id: ticket._id.toString(),
//         ticketCode: ticket.ticketCode,
//         username: ticket.userId?.username || "Unknown",
//         email: ticket.userId?.email || "—",
//         ticketTypeName: ticket.ticketTypeName,
//         quantity: ticket.quantity,
//         eventTitle: ticket.eventId?.title || "—",
//         usedAt: ticket.usedAt?.toISOString(),
//         usedBy: ticket.usedBy
//           ? {
//               id: ticket.usedBy._id.toString(),
//               username: ticket.usedBy.username || "—",
//               email: ticket.usedBy.email || "—",
//               role: ticket.usedBy.role || "—",
//             }
//           : null,
//       },
//     });
//   } catch (err) {
//     console.error("validateTicket error:", err);

//     if (err.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         message: "Ticket validation failed",
//         errors: Object.values(err.errors).map((e) => e.message),
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Server error during ticket validation",
//       error: process.env.NODE_ENV === "development" ? err.message : undefined,
//     });
//   }
// };

// async function logScan(ticketId, eventId, scannedBy, success, message) {
//   try {
//     await ScanLog.create({
//       ticketId,
//       eventId,
//       scannedBy,
//       success,
//       message,
//     });
//   } catch (e) {
//     console.error("Scan log failed:", e);
//   }
// }


// src/controllers/scanner.controller.js
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import ScanLog from "../models/ScanLog.js";
import User from "../models/User.js";
import { MASTER_USER_ID } from "../utils/masterAuth.js";

// ─── Master login helpers ────────────────────────────────────────────────────
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
// constant-time comparison (hashing first makes both buffers the same length)
const safeEqual = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));

// Brute-force protection: max 5 wrong passwords per IP per 15 minutes
const attempts = new Map(); // ip -> { count, resetAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const isBlocked = (ip) => {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (Date.now() > rec.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
};

const recordFailure = (ip) => {
  const rec = attempts.get(ip);
  if (!rec || Date.now() > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    rec.count++;
  }
};

// ─── POST /api/scanner/master-login ──────────────────────────────────────────
// Body: { identifier, password }
// If the identifier is not the master ID, replies 401 { isMaster: false } and
// does NOT count as a failed attempt, so the frontend can fall back to the
// normal planner/admin login without affecting the lockout.
export const masterLogin = (req, res) => {
  const { MASTER_SCANNER_ID, MASTER_SCANNER_PASSWORD, JWT_SECRET } = process.env;
  const { identifier, password } = req.body || {};

  const notMaster = () =>
    res
      .status(401)
      .json({ success: false, isMaster: false, message: "Not a master login" });

  if (!MASTER_SCANNER_ID || !MASTER_SCANNER_PASSWORD || !JWT_SECRET) return notMaster();
  if (!identifier || !password) return notMaster();

  if (
    !safeEqual(
      String(identifier).trim().toLowerCase(),
      MASTER_SCANNER_ID.trim().toLowerCase(),
    )
  ) {
    return notMaster();
  }

  // Identifier matches the master ID: from here on, wrong attempts are counted
  const ip = req.ip;
  if (isBlocked(ip)) {
    return res.status(429).json({
      success: false,
      isMaster: true,
      message: "Too many failed attempts. Try again in 15 minutes.",
    });
  }

  if (!safeEqual(password, MASTER_SCANNER_PASSWORD)) {
    recordFailure(ip);
    return res.status(401).json({
      success: false,
      isMaster: true,
      message: "Invalid credentials",
    });
  }

  attempts.delete(ip);

  const token = jwt.sign(
    { id: MASTER_USER_ID, role: "master", isMaster: true },
    JWT_SECRET,
    { expiresIn: "12h" },
  );

  console.log("🔑 Master scanner login from", ip);

  return res.status(200).json({
    success: true,
    token,
    user: { id: MASTER_USER_ID, username: "Admin", role: "master" },
  });
};

// ─── Who scanned the ticket (handles the master, who has no User document) ───
const describeScanner = async (userId) => {
  if (!userId) return null;
  const id = userId.toString();

  if (id === MASTER_USER_ID) {
    return { id, username: "Admin", email: "—", role: "admin" };
  }

  const user = await User.findById(id).select("username email role");
  if (!user) return { id, username: "—", email: "—", role: "—" };

  return {
    id: user._id.toString(),
    username: user.username || "—",
    email: user.email || "—",
    role: user.role || "—",
  };
};

// ─── POST /api/scanner/validate ──────────────────────────────────────────────
export const validateTicket = async (req, res) => {
  try {
    const { ticketCode, eventId } = req.body; // ← ticketCode instead of ticketId

    if (!ticketCode || !eventId) {
      return res.status(400).json({
        success: false,
        message: "ticketCode and eventId required",
      });
    }

    let ticket = await Ticket.findOne({ ticketCode: ticketCode.toUpperCase() })
      .populate("userId", "username email")
      .populate("eventId", "title createdBy");

    if (!ticket) {
      await logScan(null, eventId, req.user.id, false, "Ticket not found");
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (ticket.ticketPrice === undefined || ticket.ticketPrice === null) {
      ticket.ticketPrice = ticket.totalPrice || 0;
    }

    if (ticket.eventId._id.toString() !== eventId) {
      await logScan(ticket._id, eventId, req.user.id, false, "Wrong event");
      return res.status(403).json({
        success: false,
        message: "Ticket does not belong to this event",
      });
    }

    // Already used — return full ticket data so frontend can display it
    if (ticket.status === "used") {
      await logScan(ticket._id, eventId, req.user.id, false, "Already used");
      return res.status(409).json({
        success: false,
        message: "Ticket already used",
        alreadyUsed: true,
        ticket: {
          _id: ticket._id.toString(),
          ticketCode: ticket.ticketCode,
          username: ticket.userId?.username || "Unknown",
          email: ticket.userId?.email || "—",
          ticketTypeName: ticket.ticketTypeName,
          quantity: ticket.quantity,
          eventTitle: ticket.eventId?.title || "—",
          usedAt: ticket.usedAt?.toISOString() || null,
          usedBy: await describeScanner(ticket.usedBy),
        },
      });
    }

    if (ticket.status !== "active") {
      await logScan(
        ticket._id,
        eventId,
        req.user.id,
        false,
        `Invalid status: ${ticket.status}`,
      );
      return res.status(400).json({
        success: false,
        message: `Ticket is ${ticket.status}`,
      });
    }

    // Mark as used
    ticket.status = "used";
    ticket.usedAt = new Date();
    ticket.usedBy = req.user.id; // fixed: JWT payload has `id`, not `_id`

    await ticket.save();

    await logScan(ticket._id, eventId, req.user.id, true, "Valid ticket");

    return res.json({
      success: true,
      message: "Valid ticket",
      ticket: {
        _id: ticket._id.toString(),
        ticketCode: ticket.ticketCode,
        username: ticket.userId?.username || "Unknown",
        email: ticket.userId?.email || "—",
        ticketTypeName: ticket.ticketTypeName,
        quantity: ticket.quantity,
        eventTitle: ticket.eventId?.title || "—",
        usedAt: ticket.usedAt?.toISOString(),
        usedBy: await describeScanner(ticket.usedBy),
      },
    });
  } catch (err) {
    console.error("validateTicket error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Ticket validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during ticket validation",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

async function logScan(ticketId, eventId, scannedBy, success, message) {
  try {
    await ScanLog.create({
      ticketId,
      eventId,
      scannedBy,
      success,
      message,
    });
  } catch (e) {
    console.error("Scan log failed:", e);
  }
}