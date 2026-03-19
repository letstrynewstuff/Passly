

// src/models/Withdrawal.js
import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    plannerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    bankName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    accountName: { type: String, required: true, trim: true },
    status: {
      type: String,
      // "pending"  → planner submitted, admin hasn't touched it
      // "approved" → admin approved, not yet transferred
      // "paid"     → admin marked as transferred — shows as "Sent" on planner side
      // "rejected" → admin rejected
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
    },
    note: { type: String, trim: true },      
    processedAt: { type: Date },             
  },
  { timestamps: true }
);

export default mongoose.model("Withdrawal", withdrawalSchema);