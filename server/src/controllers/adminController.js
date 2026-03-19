

// src/controllers/admin.controller.js
import Event from "../models/Event.js";
import User from "../models/User.js";
import Withdrawal from "../models/Withdrawal.js";
import jwt from "jsonwebtoken";
import Ticket from "../models/Ticket.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcEventRevenue = (event) =>
  event.ticketCategories.reduce(
    (s, cat) => s + cat.quantitySold * cat.price, 0
  );

const calcEventTicketsSold = (event) =>
  event.ticketCategories.reduce((s, cat) => s + cat.quantitySold, 0);

const calcEventCapacity = (event) =>
  event.ticketCategories.reduce((s, cat) => s + cat.quantityAvailable, 0);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const detectFraud = async (req, res) => {
  res.json({ message: "Fraud detection endpoint working" });
};

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
// Computes everything from Event.ticketCategories — no separate Ticket model needed
export const getDashboardStats = async (req, res) => {
  try {
    const [allEvents, totalPlanners, totalUsers, pendingWithdrawals, withdrawals] =
      await Promise.all([
        Event.find({ status: { $ne: "deleted" } }),
        User.countDocuments({ role: "planner" }),
        User.countDocuments({ role: "user" }),
        Withdrawal.countDocuments({ status: "pending" }),
        Withdrawal.find({ status: "paid" }),
      ]);

    const approvedEvents = allEvents.filter((e) => e.status === "approved");
    const pendingEvents = allEvents.filter((e) => e.status === "pending");

    // Revenue from all approved events (planner gross revenue)
    const totalRevenue = approvedEvents.reduce(
      (s, e) => s + calcEventRevenue(e), 0
    );
    const platformCommission = totalRevenue * 0.1;

    // Total tickets sold across all approved events
    const totalTicketsSold = approvedEvents.reduce(
      (s, e) => s + calcEventTicketsSold(e), 0
    );

    // Total paid out via withdrawals
    const totalPaidOut = withdrawals.reduce((s, w) => s + w.amount, 0);

    // Revenue this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthRevenue = approvedEvents
      .filter((e) => new Date(e.createdAt) >= startOfMonth)
      .reduce((s, e) => s + calcEventRevenue(e), 0);

    // Top 5 events by revenue for the chart
    const topEvents = [...approvedEvents]
      .map((e) => ({
        title: e.title.length > 20 ? e.title.slice(0, 20) + "…" : e.title,
        revenue: calcEventRevenue(e),
        sold: calcEventTicketsSold(e),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent events (last 5 created)
    const recentEvents = [...allEvents]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((e) => ({
        _id: e._id,
        title: e.title,
        status: e.status,
        planner: null, // populated below if needed
        ticketsSold: calcEventTicketsSold(e),
        revenue: calcEventRevenue(e),
        date: e.date,
        createdAt: e.createdAt,
      }));

    // Recent events with planner info
    const recentEventsPopulated = await Event.find({ status: { $ne: "deleted" } })
      .populate("createdBy", "username email companyName")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentEventsFormatted = recentEventsPopulated.map((e) => ({
      _id: e._id,
      title: e.title,
      status: e.status,
      planner: e.createdBy,
      ticketsSold: calcEventTicketsSold(e),
      revenue: calcEventRevenue(e),
      date: e.date,
      media: e.media?.[0] || null,
      createdAt: e.createdAt,
    }));

    // Recent withdrawals (last 5)
    const recentWithdrawals = await Withdrawal.find()
      .populate("plannerId", "username email companyName")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        platformCommission,
        totalTicketsSold,
        totalPlanners,
        totalUsers,
        totalEvents: allEvents.length,
        approvedEvents: approvedEvents.length,
        pendingEvents: pendingEvents.length,
        pendingWithdrawals,
        totalPaidOut,
        monthRevenue,
        topEvents,
        recentEvents: recentEventsFormatted,
        recentWithdrawals,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── EVENTS ───────────────────────────────────────────────────────────────────
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: { $ne: "deleted" } })
      .populate("createdBy", "username email companyName isVerified")
      .sort({ createdAt: -1 });

    const formatted = events.map((e) => ({
      ...e.toObject(),
      ticketsSold: calcEventTicketsSold(e),
      revenue: calcEventRevenue(e),
      capacity: calcEventCapacity(e),
    }));

    return res.status(200).json({ success: true, events: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved", isPublished: true },
      { new: true }
    ).populate("createdBy", "username email");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.status(200).json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", isPublished: false },
      { new: true }
    ).populate("createdBy", "username email");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.status(200).json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, {
      status: "deleted",
      isPublished: false,
    });
    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── PLANNERS ─────────────────────────────────────────────────────────────────
export const getAllPlanners = async (req, res) => {
  try {
    const planners = await User.find({ role: "planner" }).sort({ createdAt: -1 });

    // For each planner, aggregate their event stats
    const plannerIds = planners.map((p) => p._id);
    const events = await Event.find({
      createdBy: { $in: plannerIds },
      status: { $ne: "deleted" },
    });

    const enriched = planners.map((planner) => {
      const plannerEvents = events.filter(
        (e) => e.createdBy.toString() === planner._id.toString()
      );
      const revenue = plannerEvents.reduce((s, e) => s + calcEventRevenue(e), 0);
      const ticketsSold = plannerEvents.reduce(
        (s, e) => s + calcEventTicketsSold(e), 0
      );
      return {
        ...planner.toObject(),
        eventCount: plannerEvents.length,
        revenue,
        ticketsSold,
      };
    });

    return res.status(200).json({ success: true, planners: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const suspendPlanner = async (req, res) => {
  try {
    const planner = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true },
      { new: true }
    );
    if (!planner) return res.status(404).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, planner });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unsuspendPlanner = async (req, res) => {
  try {
    const planner = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: false },
      { new: true }
    );
    return res.status(200).json({ success: true, planner });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyPlanner = async (req, res) => {
  try {
    const planner = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!planner) return res.status(404).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, planner });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPlannerDetails = async (req, res) => {
  try {
    const planner = await User.findById(req.params.id);
    if (!planner) return res.status(404).json({ success: false, message: "Not found" });
    const events = await Event.find({
      createdBy: req.params.id,
      status: { $ne: "deleted" },
    });
    const revenue = events.reduce((s, e) => s + calcEventRevenue(e), 0);
    const ticketsSold = events.reduce((s, e) => s + calcEventTicketsSold(e), 0);
    return res.status(200).json({
      success: true,
      planner: { ...planner.toObject(), events, revenue, ticketsSold },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── USERS ────────────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── WITHDRAWALS ──────────────────────────────────────────────────────────────
export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("plannerId", "username email companyName")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, withdrawals });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveWithdrawal = async (req, res) => {
  try {
    const w = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "approved", processedAt: new Date() },
      { new: true }
    ).populate("plannerId", "username email");
    return res.status(200).json({ success: true, withdrawal: w });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectWithdrawal = async (req, res) => {
  try {
    const w = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", processedAt: new Date() },
      { new: true }
    ).populate("plannerId", "username email");
    return res.status(200).json({ success: true, withdrawal: w });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markWithdrawalPaid = async (req, res) => {
  try {
    const w = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "paid", processedAt: new Date() },
      { new: true }
    ).populate("plannerId", "username email");
    return res.status(200).json({ success: true, withdrawal: w });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Called from planner's own dashboard to request payout
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountName } = req.body;
    const plannerId = req.user.id;
    if (!amount || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const w = await Withdrawal.create({
      plannerId,
      amount,
      bankName,
      accountNumber,
      accountName,
    });
    return res.status(201).json({ success: true, withdrawal: w });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getLogisticsOrders = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      "logistics.tier": { $ne: null, $exists: true },
      status: "active",
    })
      .populate("userId",  "username email avatarStyle")
      .populate("eventId", "title date location")
      .sort({ purchaseDate: -1 });

    return res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("getLogisticsOrders error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── PATCH /api/admin/logistics/:ticketId ─────────────────────────────────────
// Admin fills in: contactName, contactPhone, pickupAddress for a logistics order
export const updateLogisticsDetails = async (req, res) => {
  try {
    const { contactName, contactPhone, pickupAddress } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      {
        $set: {
          "logistics.contactName":   contactName   || null,
          "logistics.contactPhone":  contactPhone  || null,
          "logistics.pickupAddress": pickupAddress || null,
        },
      },
      { new: true },
    ).populate("userId", "username email");

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    return res.status(200).json({ success: true, ticket });
  } catch (err) {
    console.error("updateLogisticsDetails error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};