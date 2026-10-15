// // src/middleware/eventAccess.middleware.js
// import mongoose from "mongoose";

// // const Event = mongoose.model("Event"); // ← this is usually safe

// // or better – explicit import (preferred if you use named/default exports)
// import Event from "../models/Event.js";

// export const restrictToEventOwner = async (req, res, next) => {
//   if (req.user.role === "admin") return next();

//   const { eventId } = req.body;
//   if (!eventId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "eventId required" });
//   }

//   try {
//     // const event = await Event.findById(eventId).select('createdBy');
//     const event = await Event.findById(eventId);

//     if (!event) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Event not found" });
//     }

//     if (event.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "You do not own this event",
//       });
//     }

//     next();
//   } catch (err) {
//     console.error("restrictToEventOwner error:", err);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Server error in event ownership check",
//       });
//   }
// };


// src/middleware/eventAccess.middleware.js
import Event from "../models/Event.js";

export const restrictToEventOwner = async (req, res, next) => {
  // admin and master can scan any event
  if (req.user.role === "admin" || req.user.role === "master") return next();

  const { eventId } = req.body;
  if (!eventId) {
    return res
      .status(400)
      .json({ success: false, message: "eventId required" });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not own this event",
      });
    }

    next();
  } catch (err) {
    console.error("restrictToEventOwner error:", err);
    res.status(500).json({
      success: false,
      message: "Server error in event ownership check",
    });
  }
};