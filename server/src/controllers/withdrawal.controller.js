

// src/controllers/withdrawal.controller.js
import Withdrawal from "../models/Withdrawal.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import bcrypt from "bcryptjs";

// ─── Revenue helper ───────────────────────────────────────────────────────────
// Uses ticketPrice (ticket-only, excludes logistics) from actual Ticket documents.
// Includes BOTH "active" and "used" tickets — planner earned the money either way.
const calcPlannerBalance = async (plannerId) => {
  const events = await Event.find({ createdBy: plannerId });

  const plannerTickets = await Ticket.find({
    eventId: { $in: events.map((e) => e._id) },
    status: { $in: ["active", "used"] }, // ✅ include scanned (used) tickets
  });

  const grossRevenue = plannerTickets.reduce(
    (s, t) => s + (t.ticketPrice || t.totalPrice || 0),
    0
  );

  const paidWithdrawals = await Withdrawal.find({ plannerId, status: "paid" });
  const totalPaidOut = paidWithdrawals.reduce((s, w) => s + w.amount, 0);

  const inProgressWithdrawals = await Withdrawal.find({
    plannerId,
    status: { $in: ["pending", "approved"] },
  });
  const inProgress = inProgressWithdrawals.reduce((s, w) => s + w.amount, 0);

  const available = grossRevenue - totalPaidOut - inProgress;

  return {
    grossRevenue,
    totalPaidOut,
    inProgress,
    available: Math.max(0, available),
  };
};

// ─── GET /api/withdrawals/balance ─────────────────────────────────────────────
export const getBalance = async (req, res) => {
  try {
    const balance = await calcPlannerBalance(req.user.id);
    return res.status(200).json({ success: true, balance });
  } catch (err) {
    console.error("getBalance error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET /api/withdrawals/my ──────────────────────────────────────────────────
export const getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ plannerId: req.user.id })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, withdrawals });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── POST /api/withdrawals/request ───────────────────────────────────────────
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountName, password } = req.body;
    const plannerId = req.user.id;

    if (!amount || !bankName || !accountNumber || !accountName || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including password confirmation",
      });
    }

    const user = await User.findById(plannerId).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Transfer not authorized.",
      });
    }

    if (Number(amount) < 1000) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdrawal is ₦1,000",
      });
    }

    const { available } = await calcPlannerBalance(plannerId);
    if (Number(amount) > available) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₦${available.toLocaleString()}`,
      });
    }

    const withdrawal = await Withdrawal.create({
      plannerId,
      amount: Number(amount),
      bankName,
      accountNumber,
      accountName,
    });

    return res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully",
      withdrawal,
    });
  } catch (err) {
    console.error("requestWithdrawal error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── ADMIN: GET /api/withdrawals ─────────────────────────────────────────────
export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("plannerId", "username email companyName avatarStyle")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, withdrawals });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── ADMIN: PATCH /:id/approve ────────────────────────────────────────────────
export const approveWithdrawal = async (req, res) => {
  try {
    const w = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "approved", processedAt: new Date() },
      { new: true }
    ).populate("plannerId", "username email");
    if (!w) return res.status(404).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, withdrawal: w });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── ADMIN: PATCH /:id/reject ─────────────────────────────────────────────────
export const rejectWithdrawal = async (req, res) => {
  try {
    const { note } = req.body;
    const w = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", processedAt: new Date(), ...(note && { note }) },
      { new: true }
    ).populate("plannerId", "username email");
    if (!w) return res.status(404).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, withdrawal: w });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── ADMIN: PATCH /:id/paid ───────────────────────────────────────────────────
export const markWithdrawalPaid = async (req, res) => {
  try {
    const w = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "paid", processedAt: new Date() },
      { new: true }
    ).populate("plannerId", "username email");
    if (!w) return res.status(404).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, withdrawal: w });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};