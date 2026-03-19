// src/models/ScanLog.js
import mongoose from "mongoose";

const scanLogSchema = new mongoose.Schema(
  {
    // ticketId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Ticket",
    //   required: true,
    // },
    // eventId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Event",
    //   required: true,
    // },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // admin or planner
    scannedAt: { type: Date, default: Date.now },
    success: { type: Boolean, required: true },
    message: String, // "valid", "already_used", "wrong_event", etc.
  },
  { timestamps: true },
);

export default mongoose.model("ScanLog", scanLogSchema);
