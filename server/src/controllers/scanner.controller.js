// // src/controllers/scanner.controller.js
// import Ticket from "../models/Ticket.js";
// import Event from "../models/Event.js";
// import ScanLog from "../models/ScanLog.js";


// export const validateTicket = async (req, res) => {
//   try {
//     const { ticketId, eventId } = req.body;

//     if (!ticketId || !eventId) {
//       return res.status(400).json({
//         success: false,
//         message: "ticketId and eventId required",
//       });
//     }

//     let ticket = await Ticket.findById(ticketId)
//       .populate("userId", "username email")
//       .populate("eventId", "title createdBy")
//       .populate("usedBy", "username email role");

//     if (!ticket) {
//       await logScan(ticketId, eventId, req.user.id, false, "Ticket not found");
//       return res.status(404).json({
//         success: false,
//         message: "Ticket not found",
//       });
//     }

//     // Handle old tickets without ticketPrice
//     if (ticket.ticketPrice === undefined || ticket.ticketPrice === null) {
//       ticket.ticketPrice = ticket.totalPrice || 0;
//     }

//     if (ticket.eventId._id.toString() !== eventId) {
//       await logScan(ticketId, eventId, req.user.id, false, "Wrong event");
//       return res.status(403).json({
//         success: false,
//         message: "Ticket does not belong to this event",
//       });
//     }

//     // ✅ Already used — return full ticket data so frontend can display it
//     if (ticket.status === "used") {
//       await logScan(ticketId, eventId, req.user.id, false, "Already used");
//       return res.status(409).json({
//         success: false,
//         message: "Ticket already used",
//         alreadyUsed: true,
//         ticket: {
//           _id: ticket._id.toString(),
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
//       await logScan(
//         ticketId,
//         eventId,
//         req.user.id,
//         false,
//         `Invalid status: ${ticket.status}`,
//       );
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

//     // Re-fetch with full population after save
//     ticket = await Ticket.findById(ticketId)
//       .populate("userId", "username email")
//       .populate("eventId", "title")
//       .populate("usedBy", "username email role");

//     await logScan(ticketId, eventId, req.user.id, true, "Valid ticket");

//     return res.json({
//       success: true,
//       message: "Valid ticket",
//       ticket: {
//         _id: ticket._id.toString(),
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
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import ScanLog from "../models/ScanLog.js";

export const validateTicket = async (req, res) => {
  try {
    const { ticketCode, eventId } = req.body;  // ← ticketCode instead of ticketId

    if (!ticketCode || !eventId) {
      return res.status(400).json({
        success: false,
        message: "ticketCode and eventId required",
      });
    }

    let ticket = await Ticket.findOne({ ticketCode: ticketCode.toUpperCase() })
      .populate("userId", "username email")
      .populate("eventId", "title createdBy")
      .populate("usedBy", "username email role");

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
          usedBy: ticket.usedBy
            ? {
                id: ticket.usedBy._id?.toString(),
                username: ticket.usedBy.username || "—",
                email: ticket.usedBy.email || "—",
                role: ticket.usedBy.role || "—",
              }
            : null,
        },
      });
    }

    if (ticket.status !== "active") {
      await logScan(ticket._id, eventId, req.user.id, false, `Invalid status: ${ticket.status}`);
      return res.status(400).json({
        success: false,
        message: `Ticket is ${ticket.status}`,
      });
    }

    // Mark as used
    ticket.status = "used";
    ticket.usedAt = new Date();
    ticket.usedBy = req.user?._id || null;

    await ticket.save();

    ticket = await Ticket.findById(ticket._id)
      .populate("userId", "username email")
      .populate("eventId", "title")
      .populate("usedBy", "username email role");

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
        usedBy: ticket.usedBy
          ? {
              id: ticket.usedBy._id.toString(),
              username: ticket.usedBy.username || "—",
              email: ticket.usedBy.email || "—",
              role: ticket.usedBy.role || "—",
            }
          : null,
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