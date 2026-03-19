

// // src/controllers/ticket.controller.js
// import Ticket from "../models/Ticket.js";
// import Event from "../models/Event.js";
// import User from "../models/User.js";
// import { initializePayment, verifyPayment } from "../services/paystack.service.js";
// import { generateQRCode } from "../services/qr.service.js";
// import { sendTicketEmail } from "../services/email.service.js";

// // ─── Helper: generate unique 5-char alphanumeric code ────────────────────────
// const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// const generateTicketCode = async () => {
//   let code;
//   let exists = true;

//   while (exists) {
//     code = Array.from({ length: 5 }, () =>
//       CHARS[Math.floor(Math.random() * CHARS.length)]
//     ).join("");
//     exists = await Ticket.exists({ ticketCode: code });
//   }

//   return code;
// };

// // ─── POST /api/tickets/initialize ────────────────────────────────────────────
// export const initializeTicketPayment = async (req, res) => {
//   try {
//     const { eventId, ticketType, quantity, logistics } = req.body;
//     const userId = req.user.id;

//     const event = await Event.findById(eventId);
//     if (!event) return res.status(404).json({ success: false, message: "Event not found" });

//     const category = event.ticketCategories.find((cat) => cat.name === ticketType);
//     if (!category) return res.status(400).json({ success: false, message: "Invalid ticket type" });

//     const available = category.quantityAvailable - category.quantitySold;
//     if (available < quantity) {
//       return res.status(400).json({ success: false, message: `Only ${available} ticket(s) remaining` });
//     }

//     const ticketPrice    = category.price * Number(quantity);
//     const logisticsPrice = logistics?.price || 0;
//     const totalPrice     = ticketPrice + logisticsPrice;

//     const user = await User.findById(userId).select("email");
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const metadata = {
//       eventId:       String(eventId),
//       ticketType,
//       quantity:      Number(quantity),
//       userId:        String(userId),
//       ticketPrice,
//       logisticsPrice,
//       totalPrice,
//       logistics:     logistics || null,
//     };

//     const payResponse = await initializePayment(
//       user.email,
//       totalPrice,
//       metadata,
//       "http://localhost:5173/checkout",
//     );

//     if (!payResponse.status) {
//       return res.status(500).json({ success: false, message: payResponse.message });
//     }

//     return res.status(200).json({
//       success:          true,
//       authorizationUrl: payResponse.data.authorization_url,
//       reference:        payResponse.data.reference,
//     });
//   } catch (error) {
//     console.error("initializeTicketPayment error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ─── GET /api/tickets/verify/:reference ──────────────────────────────────────
// export const verifyTicketPayment = async (req, res) => {
//   const { reference } = req.params;
//   console.log("VERIFY HIT:", reference);

//   try {
//     // Layer 1: already exists? Return immediately
//     const existing = await Ticket.findOne({ paymentReference: reference })
//       .populate("eventId", "title location date time media");
//     if (existing) {
//       console.log("Ticket already exists — returning cached:", existing._id);
//       return res.status(200).json({ success: true, ticket: existing });
//     }

//     // Verify with Paystack
//     const verifyResponse = await verifyPayment(reference);
//     if (verifyResponse.data.status !== "success") {
//       return res.status(400).json({ success: false, message: "Payment not successful" });
//     }

//     const { metadata } = verifyResponse.data;
//     if (!metadata) {
//       return res.status(400).json({ success: false, message: "Payment metadata missing" });
//     }

//     const { eventId, ticketType, quantity, userId, ticketPrice, logistics } = metadata;

//     if (req.user.id !== userId) {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const event = await Event.findById(eventId);
//     if (!event) return res.status(404).json({ success: false, message: "Event not found" });

//     const category = event.ticketCategories.find((cat) => cat.name === ticketType);
//     if (!category) return res.status(400).json({ success: false, message: "Invalid ticket type" });

//     if (category.quantitySold + Number(quantity) > category.quantityAvailable) {
//       return res.status(400).json({ success: false, message: "Not enough tickets available" });
//     }

//     const finalTicketPrice    = ticketPrice ?? category.price * Number(quantity);
//     const finalLogisticsPrice = logistics?.price || 0;
//     const finalTotalPrice     = finalTicketPrice + finalLogisticsPrice;

//     // ✅ Generate unique 5-char code before saving
//     const ticketCode = await generateTicketCode();

//     const ticket = new Ticket({
//       userId,
//       eventId,
//       ticketCategoryId: category._id,
//       ticketTypeName:   category.name,
//       quantity:         Number(quantity),
//       ticketPrice:      finalTicketPrice,
//       totalPrice:       finalTotalPrice,
//       ticketCode,                          // ← stored on ticket
//       logistics: logistics
//         ? { tier: logistics.tier, name: logistics.name, price: logistics.price }
//         : { tier: null, name: null, price: 0 },
//       status:           "active",
//       paymentReference: reference,
//       purchaseDate:     new Date(),
//     });

//     // ✅ QR now encodes the short ticketCode instead of the long _id
//     ticket.qrCode = await generateQRCode(ticketCode);

//     // Layer 2: atomic save — unique index catches simultaneous duplicates
//     try {
//       await ticket.save();
//     } catch (saveErr) {
//       if (saveErr.code === 11000) {
//         console.log("E11000 duplicate caught — fetching existing ticket");
//         const created = await Ticket.findOne({ paymentReference: reference })
//           .populate("eventId", "title location date time media");
//         return res.status(200).json({ success: true, ticket: created });
//       }
//       throw saveErr;
//     }

//     category.quantitySold += Number(quantity);
//     await event.save();

//     User.findById(userId).select("email username").then((user) => {
//       if (user?.email) {
//         sendTicketEmail({
//           to:       user.email,
//           username: user.username || "there",
//           event:    event.title,
//           ticket,
//           qrCode:   ticket.qrCode,
//         }).catch((e) => console.error("Email error (non-fatal):", e));
//       }
//     });

//     const populated = await Ticket.findById(ticket._id)
//       .populate("eventId", "title location date time media");

//     return res.status(200).json({ success: true, ticket: populated });
//   } catch (error) {
//     console.error("verifyTicketPayment error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ─── GET /api/tickets/my ─────────────────────────────────────────────────────
// export const getMyTickets = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     const tickets = await Ticket.find({ userId, status: { $in: ["active", "pending"] } })
//       .populate({ path: "eventId", select: "title location date time media" })
//       .sort({ purchaseDate: -1 });

//     return res.status(200).json({ success: true, tickets });
//   } catch (error) {
//     console.error("getMyTickets error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ─── POST /api/tickets/:ticketId/resend-email ─────────────────────────────────
// export const resendTicketEmail = async (req, res) => {
//   try {
//     const ticket = await Ticket.findById(req.params.ticketId).populate("eventId");
//     if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

//     const user = await User.findById(ticket.userId).select("email username");
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     await sendTicketEmail({
//       to:       user.email,
//       username: user.username || "there",
//       event:    ticket.eventId?.title,
//       ticket,
//       qrCode:   ticket.qrCode,
//     });
//     return res.status(200).json({ success: true, message: "Email sent" });
//   } catch (error) {
//     console.error("resendTicketEmail error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ─── DELETE /api/tickets/duplicates ──────────────────────────────────────────
// export const deleteDuplicateTickets = async (req, res) => {
//   try {
//     const duplicates = await Ticket.aggregate([
//       { $group: { _id: "$paymentReference", count: { $sum: 1 }, ids: { $push: "$_id" } } },
//       { $match: { count: { $gt: 1 } } },
//     ]);

//     let deleted = 0;
//     for (const dup of duplicates) {
//       const [keep, ...remove] = dup.ids;
//       await Ticket.deleteMany({ _id: { $in: remove } });
//       deleted += remove.length;
//       console.log(`Kept ${keep}, deleted ${remove.length} duplicate(s) for ref: ${dup._id}`);
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Cleaned up ${deleted} duplicate ticket(s) across ${duplicates.length} reference(s)`,
//       deleted,
//     });
//   } catch (error) {
//     console.error("deleteDuplicateTickets error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ─── GET /api/tickets/analytics ──────────────────────────────────────────────
// export const getPlannerAnalytics = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const plannerEvents = await Event.find({ createdBy: userId });
//     const eventIds = plannerEvents.map((e) => e._id);

//     const tickets = await Ticket.find({ eventId: { $in: eventIds }, status: "active" })
//       .populate("eventId", "title ticketCategories");

//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//     const recent = tickets.filter((t) => new Date(t.purchaseDate) >= thirtyDaysAgo);

//     const dailyMap = {};
//     recent.forEach((t) => {
//       const date = new Date(t.purchaseDate).toISOString().split("T")[0];
//       if (!dailyMap[date]) dailyMap[date] = { date, revenue: 0, count: 0 };
//       dailyMap[date].revenue += t.ticketPrice || t.totalPrice || 0;
//       dailyMap[date].count   += t.quantity;
//     });
//     const dailySales = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));

//     const byEvent = {};
//     recent.forEach((t) => {
//       const eid = t.eventId?._id?.toString();
//       if (!eid) return;
//       if (!byEvent[eid]) byEvent[eid] = [];
//       const date = new Date(t.purchaseDate).toISOString().split("T")[0];
//       const rev  = t.ticketPrice || t.totalPrice || 0;
//       const ex   = byEvent[eid].find((d) => d.date === date);
//       if (ex) { ex.revenue += rev; ex.count += t.quantity; }
//       else byEvent[eid].push({ date, revenue: rev, count: t.quantity });
//     });

//     return res.status(200).json({
//       success: true,
//       analytics: {
//         totalRevenue:     tickets.reduce((s, t) => s + (t.ticketPrice || t.totalPrice || 0), 0),
//         totalTicketsSold: tickets.reduce((s, t) => s + t.quantity, 0),
//         dailySales,
//         dailySalesByEvent: byEvent,
//       },
//     });
//   } catch (error) {
//     console.error("getPlannerAnalytics error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// src/controllers/ticket.controller.js
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { initializePayment, verifyPayment } from "../services/paystack.service.js";
import { generateQRCode } from "../services/qr.service.js";
import { sendTicketEmail } from "../services/email.service.js";

// ─── Helper: generate unique 5-char alphanumeric code ────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateTicketCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Array.from({ length: 5 }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");
    exists = await Ticket.exists({ ticketCode: code });
  }
  return code;
};

// ─── POST /api/tickets/initialize ────────────────────────────────────────────
export const initializeTicketPayment = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, logistics } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    const category = event.ticketCategories.find((cat) => cat.name === ticketType);
    if (!category) return res.status(400).json({ success: false, message: "Invalid ticket type" });

    const available = category.quantityAvailable - category.quantitySold;
    if (available < quantity) {
      return res.status(400).json({ success: false, message: `Only ${available} ticket(s) remaining` });
    }

    const ticketPrice    = category.price * Number(quantity);
    const logisticsPrice = logistics?.price || 0;
    const totalPrice     = ticketPrice + logisticsPrice;

    const user = await User.findById(userId).select("email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const metadata = {
      eventId:       String(eventId),
      ticketType,
      quantity:      Number(quantity),
      userId:        String(userId),
      ticketPrice,
      logisticsPrice,
      totalPrice,
      logistics:     logistics || null,
    };

    const payResponse = await initializePayment(
      user.email,
      totalPrice,
      metadata,
      "http://localhost:5173/checkout",
    );

    if (!payResponse.status) {
      return res.status(500).json({ success: false, message: payResponse.message });
    }

    return res.status(200).json({
      success:          true,
      authorizationUrl: payResponse.data.authorization_url,
      reference:        payResponse.data.reference,
    });
  } catch (error) {
    console.error("initializeTicketPayment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET /api/tickets/verify/:reference ──────────────────────────────────────
export const verifyTicketPayment = async (req, res) => {
  const { reference } = req.params;
  console.log("VERIFY HIT:", reference);

  try {
    // Layer 1: already exists? Return immediately
    const existing = await Ticket.findOne({ paymentReference: reference })
      .populate("eventId", "title location date time media");
    if (existing) {
      console.log("Ticket already exists — returning cached:", existing._id);
      return res.status(200).json({ success: true, ticket: existing });
    }

    // Verify with Paystack
    const verifyResponse = await verifyPayment(reference);
    if (verifyResponse.data.status !== "success") {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    const { metadata } = verifyResponse.data;
    if (!metadata) {
      return res.status(400).json({ success: false, message: "Payment metadata missing" });
    }

    const { eventId, ticketType, quantity, userId, ticketPrice, logistics } = metadata;

    if (req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    const category = event.ticketCategories.find((cat) => cat.name === ticketType);
    if (!category) return res.status(400).json({ success: false, message: "Invalid ticket type" });

    if (category.quantitySold + Number(quantity) > category.quantityAvailable) {
      return res.status(400).json({ success: false, message: "Not enough tickets available" });
    }

    const finalTicketPrice    = ticketPrice ?? category.price * Number(quantity);
    const finalLogisticsPrice = logistics?.price || 0;
    const finalTotalPrice     = finalTicketPrice + finalLogisticsPrice;

    // Generate unique 5-char code
    const ticketCode = await generateTicketCode();

    const ticket = new Ticket({
      userId,
      eventId,
      ticketCategoryId: category._id,
      ticketTypeName:   category.name,
      quantity:         Number(quantity),
      ticketPrice:      finalTicketPrice,
      totalPrice:       finalTotalPrice,
      ticketCode,
      logistics: logistics
        ? { tier: logistics.tier, name: logistics.name, price: logistics.price }
        : { tier: null, name: null, price: 0 },
      status:           "active",
      paymentReference: reference,
      purchaseDate:     new Date(),
    });

    // QR encodes the short ticketCode
    ticket.qrCode = await generateQRCode(ticketCode);

    // Layer 2: atomic save
    try {
      await ticket.save();
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        console.log("E11000 duplicate caught — fetching existing ticket");
        const created = await Ticket.findOne({ paymentReference: reference })
          .populate("eventId", "title location date time media");
        return res.status(200).json({ success: true, ticket: created });
      }
      throw saveErr;
    }

    category.quantitySold += Number(quantity);
    await event.save();

    // ✅ Fetch fully populated ticket FIRST, then send email
    // This ensures ticketCode, logistics, and all fields are present in the email
    const populated = await Ticket.findById(ticket._id)
      .populate("eventId", "title location date time media")
      .populate("userId", "email username");

    // Send email non-blocking — uses populated ticket so ticketCode is included
    if (populated.userId?.email) {
      sendTicketEmail({
        to:       populated.userId.email,
        username: populated.userId.username || "there",
        event:    event.title,
        ticket:   populated,   // ✅ fully populated — has ticketCode, logistics, etc.
        qrCode:   populated.qrCode,
      }).catch((e) => console.error("Email error (non-fatal):", e));
    }

    return res.status(200).json({ success: true, ticket: populated });
  } catch (error) {
    console.error("verifyTicketPayment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET /api/tickets/my ─────────────────────────────────────────────────────
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const tickets = await Ticket.find({ userId, status: { $in: ["active", "pending"] } })
      .populate({ path: "eventId", select: "title location date time media" })
      .sort({ purchaseDate: -1 });

    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error("getMyTickets error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── POST /api/tickets/:ticketId/resend-email ─────────────────────────────────
export const resendTicketEmail = async (req, res) => {
  try {
    // ✅ Populate userId so we have email + username for the email
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate("eventId")
      .populate("userId", "email username");

    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

    const email    = ticket.userId?.email;
    const username = ticket.userId?.username || "there";

    if (!email) return res.status(400).json({ success: false, message: "No email on file for this user" });

    await sendTicketEmail({
      to:       email,
      username,
      event:    ticket.eventId?.title || "your event",
      ticket,   // ✅ fully populated — ticketCode, logistics all present
      qrCode:   ticket.qrCode,
    });

    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("resendTicketEmail error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── DELETE /api/tickets/duplicates ──────────────────────────────────────────
export const deleteDuplicateTickets = async (req, res) => {
  try {
    const duplicates = await Ticket.aggregate([
      { $group: { _id: "$paymentReference", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    let deleted = 0;
    for (const dup of duplicates) {
      const [keep, ...remove] = dup.ids;
      await Ticket.deleteMany({ _id: { $in: remove } });
      deleted += remove.length;
    }

    return res.status(200).json({
      success: true,
      message: `Cleaned up ${deleted} duplicate ticket(s) across ${duplicates.length} reference(s)`,
      deleted,
    });
  } catch (error) {
    console.error("deleteDuplicateTickets error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET /api/tickets/analytics ──────────────────────────────────────────────
export const getPlannerAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const plannerEvents = await Event.find({ createdBy: userId });
    const eventIds = plannerEvents.map((e) => e._id);

    const tickets = await Ticket.find({ eventId: { $in: eventIds }, status: "active" })
      .populate("eventId", "title ticketCategories");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = tickets.filter((t) => new Date(t.purchaseDate) >= thirtyDaysAgo);

    const dailyMap = {};
    recent.forEach((t) => {
      const date = new Date(t.purchaseDate).toISOString().split("T")[0];
      if (!dailyMap[date]) dailyMap[date] = { date, revenue: 0, count: 0 };
      dailyMap[date].revenue += t.ticketPrice || t.totalPrice || 0;
      dailyMap[date].count   += t.quantity;
    });
    const dailySales = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    const byEvent = {};
    recent.forEach((t) => {
      const eid = t.eventId?._id?.toString();
      if (!eid) return;
      if (!byEvent[eid]) byEvent[eid] = [];
      const date = new Date(t.purchaseDate).toISOString().split("T")[0];
      const rev  = t.ticketPrice || t.totalPrice || 0;
      const ex   = byEvent[eid].find((d) => d.date === date);
      if (ex) { ex.revenue += rev; ex.count += t.quantity; }
      else byEvent[eid].push({ date, revenue: rev, count: t.quantity });
    });

    return res.status(200).json({
      success: true,
      analytics: {
        totalRevenue:     tickets.reduce((s, t) => s + (t.ticketPrice || t.totalPrice || 0), 0),
        totalTicketsSold: tickets.reduce((s, t) => s + t.quantity, 0),
        dailySales,
        dailySalesByEvent: byEvent,
      },
    });
  } catch (error) {
    console.error("getPlannerAnalytics error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};