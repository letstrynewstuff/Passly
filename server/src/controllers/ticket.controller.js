


// // // src/controllers/ticket.controller.js
// // import Ticket from "../models/Ticket.js";
// // import Event from "../models/Event.js";
// // import User from "../models/User.js";
// // import { initializePayment, verifyPayment } from "../services/paystack.service.js";
// // import { generateQRCode } from "../services/qr.service.js";
// // import { sendTicketEmail } from "../services/email.service.js";

// // // ─── Helper: generate unique 5-char alphanumeric code ────────────────────────
// // const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// // const generateTicketCode = async () => {
// //   let code;
// //   let exists = true;
// //   while (exists) {
// //     code = Array.from({ length: 5 }, () =>
// //       CHARS[Math.floor(Math.random() * CHARS.length)]
// //     ).join("");
// //     exists = await Ticket.exists({ ticketCode: code });
// //   }
// //   return code;
// // };

// // // ─── POST /api/tickets/initialize ────────────────────────────────────────────
// // export const initializeTicketPayment = async (req, res) => {
// //   try {
// //     const { eventId, ticketType, quantity, logistics } = req.body;
// //     const userId = req.user.id;

// //     const event = await Event.findById(eventId);
// //     if (!event) return res.status(404).json({ success: false, message: "Event not found" });

// //     const category = event.ticketCategories.find((cat) => cat.name === ticketType);
// //     if (!category) return res.status(400).json({ success: false, message: "Invalid ticket type" });

// //     const available = category.quantityAvailable - category.quantitySold;
// //     if (available < quantity) {
// //       return res.status(400).json({ success: false, message: `Only ${available} ticket(s) remaining` });
// //     }

// //     // ✅ Validate phone if logistics selected
// //     if (logistics) {
// //       const phone = logistics.contactPhone?.trim() || "";
// //       if (!phone) {
// //         return res.status(400).json({ success: false, message: "Phone number is required for logistics service" });
// //       }
// //       const cleaned = phone.replace(/\s/g, "");
// //       if (!/^(\+234|0)[789][01]\d{8}$/.test(cleaned)) {
// //         return res.status(400).json({ success: false, message: "Invalid Nigerian phone number" });
// //       }
// //     }

// //     const ticketPrice    = category.price * Number(quantity);
// //     const logisticsPrice = logistics?.price || 0;
// //     const totalPrice     = ticketPrice + logisticsPrice;

// //     const user = await User.findById(userId).select("email");
// //     if (!user) return res.status(404).json({ success: false, message: "User not found" });

// //     const metadata = {
// //       eventId:       String(eventId),
// //       ticketType,
// //       quantity:      Number(quantity),
// //       userId:        String(userId),
// //       ticketPrice,
// //       logisticsPrice,
// //       totalPrice,
// //       logistics:     logistics || null,  // includes contactPhone
// //     };

// //     // // const payResponse = await initializePayment(
// //     // //   user.email,
// //     // //   totalPrice,
// //     // //   metadata,
// //     // //   "http://localhost:5173/checkout",
// //     // // );
// //     // const payResponse = await initializePayment(
// //     //   user.email,
// //     //   totalPrice,
// //     //   metadata,
// //     //   "https://passlly.com/checkout",
// //     // );
// //         const payResponse = await initializePayment(
// //           user.email,
// //           totalPrice,
// //           metadata,
// //           `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout`,
// //         );

// //     if (!payResponse.status) {
// //       return res.status(500).json({ success: false, message: payResponse.message });
// //     }

// //     return res.status(200).json({
// //       success:          true,
// //       authorizationUrl: payResponse.data.authorization_url,
// //       reference:        payResponse.data.reference,
// //     });
// //   } catch (error) {
// //     console.error("initializeTicketPayment error:", error);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // // ─── GET /api/tickets/verify/:reference ──────────────────────────────────────
// // export const verifyTicketPayment = async (req, res) => {
// //   const { reference } = req.params;
// //   console.log("VERIFY HIT:", reference);

// //   try {
// //     // Layer 1: already exists?
// //     const existing = await Ticket.findOne({ paymentReference: reference })
// //       .populate("eventId", "title location date time media");
// //     if (existing) {
// //       return res.status(200).json({ success: true, ticket: existing });
// //     }

// //     const verifyResponse = await verifyPayment(reference);
// //     if (verifyResponse.data.status !== "success") {
// //       return res.status(400).json({ success: false, message: "Payment not successful" });
// //     }

// //     const { metadata } = verifyResponse.data;
// //     if (!metadata) {
// //       return res.status(400).json({ success: false, message: "Payment metadata missing" });
// //     }

// //     const { eventId, ticketType, quantity, userId, ticketPrice, logistics } = metadata;

// //     if (req.user.id !== userId) {
// //       return res.status(403).json({ success: false, message: "Unauthorized" });
// //     }

// //     const event = await Event.findById(eventId);
// //     if (!event) return res.status(404).json({ success: false, message: "Event not found" });

// //     const category = event.ticketCategories.find((cat) => cat.name === ticketType);
// //     if (!category) return res.status(400).json({ success: false, message: "Invalid ticket type" });

// //     if (category.quantitySold + Number(quantity) > category.quantityAvailable) {
// //       return res.status(400).json({ success: false, message: "Not enough tickets available" });
// //     }

// //     const finalTicketPrice    = ticketPrice ?? category.price * Number(quantity);
// //     const finalLogisticsPrice = logistics?.price || 0;
// //     const finalTotalPrice     = finalTicketPrice + finalLogisticsPrice;

// //     const ticketCode = await generateTicketCode();

// //     const ticket = new Ticket({
// //       userId,
// //       eventId,
// //       ticketCategoryId: category._id,
// //       ticketTypeName:   category.name,
// //       quantity:         Number(quantity),
// //       ticketPrice:      finalTicketPrice,
// //       totalPrice:       finalTotalPrice,
// //       ticketCode,
// //       logistics: logistics
// //         ? {
// //             tier:         logistics.tier,
// //             name:         logistics.name,
// //             price:        logistics.price,
// //             // ✅ Phone number saved to ticket — visible to admin in logistics panel
// //             contactPhone: logistics.contactPhone?.trim() || null,
// //             contactName:  null,   // admin fills this later
// //             pickupAddress: null,  // admin fills this later
// //           }
// //         : { tier: null, name: null, price: 0 },
// //       status:           "active",
// //       paymentReference: reference,
// //       purchaseDate:     new Date(),
// //     });

// //     ticket.qrCode = await generateQRCode(ticketCode);

// //     try {
// //       await ticket.save();
// //     } catch (saveErr) {
// //       if (saveErr.code === 11000) {
// //         const created = await Ticket.findOne({ paymentReference: reference })
// //           .populate("eventId", "title location date time media");
// //         return res.status(200).json({ success: true, ticket: created });
// //       }
// //       throw saveErr;
// //     }

// //     category.quantitySold += Number(quantity);
// //     await event.save();

// //     const populated = await Ticket.findById(ticket._id)
// //       .populate("eventId", "title location date time media")
// //       .populate("userId", "email username");

// //     if (populated.userId?.email) {
// //       sendTicketEmail({
// //         to:       populated.userId.email,
// //         username: populated.userId.username || "there",
// //         event:    event.title,
// //         ticket:   populated,
// //         qrCode:   populated.qrCode,
// //       }).catch((e) => console.error("Email error (non-fatal):", e));
// //     }

// //     return res.status(200).json({ success: true, ticket: populated });
// //   } catch (error) {
// //     console.error("verifyTicketPayment error:", error);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // // ─── GET /api/tickets/my ─────────────────────────────────────────────────────
// // export const getMyTickets = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
// //     res.setHeader("Pragma", "no-cache");
// //     res.setHeader("Expires", "0");
// //     const tickets = await Ticket.find({ userId, status: { $in: ["active", "pending"] } })
// //       .populate({ path: "eventId", select: "title location date time media" })
// //       .sort({ purchaseDate: -1 });
// //     return res.status(200).json({ success: true, tickets });
// //   } catch (error) {
// //     console.error("getMyTickets error:", error);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // // ─── POST /api/tickets/:ticketId/resend-email ─────────────────────────────────
// // export const resendTicketEmail = async (req, res) => {
// //   try {
// //     const ticket = await Ticket.findById(req.params.ticketId)
// //       .populate("eventId")
// //       .populate("userId", "email username");
// //     if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
// //     const email    = ticket.userId?.email;
// //     const username = ticket.userId?.username || "there";
// //     if (!email) return res.status(400).json({ success: false, message: "No email on file for this user" });
// //     await sendTicketEmail({
// //       to: email, username,
// //       event:  ticket.eventId?.title || "your event",
// //       ticket,
// //       qrCode: ticket.qrCode,
// //     });
// //     return res.status(200).json({ success: true, message: "Email sent" });
// //   } catch (error) {
// //     console.error("resendTicketEmail error:", error);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // // ─── DELETE /api/tickets/duplicates ──────────────────────────────────────────
// // export const deleteDuplicateTickets = async (req, res) => {
// //   try {
// //     const duplicates = await Ticket.aggregate([
// //       { $group: { _id: "$paymentReference", count: { $sum: 1 }, ids: { $push: "$_id" } } },
// //       { $match: { count: { $gt: 1 } } },
// //     ]);
// //     let deleted = 0;
// //     for (const dup of duplicates) {
// //       const [, ...remove] = dup.ids;
// //       await Ticket.deleteMany({ _id: { $in: remove } });
// //       deleted += remove.length;
// //     }
// //     return res.status(200).json({ success: true, message: `Cleaned up ${deleted} duplicate ticket(s)`, deleted });
// //   } catch (error) {
// //     console.error("deleteDuplicateTickets error:", error);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // // ─── GET /api/tickets/analytics ──────────────────────────────────────────────
// // export const getPlannerAnalytics = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const plannerEvents = await Event.find({ createdBy: userId });
// //     const eventIds = plannerEvents.map((e) => e._id);
// //     const tickets = await Ticket.find({ eventId: { $in: eventIds }, status: "active" })
// //       .populate("eventId", "title ticketCategories");
// //     const thirtyDaysAgo = new Date();
// //     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
// //     const recent = tickets.filter((t) => new Date(t.purchaseDate) >= thirtyDaysAgo);
// //     const dailyMap = {};
// //     recent.forEach((t) => {
// //       const date = new Date(t.purchaseDate).toISOString().split("T")[0];
// //       if (!dailyMap[date]) dailyMap[date] = { date, revenue: 0, count: 0 };
// //       dailyMap[date].revenue += t.ticketPrice || t.totalPrice || 0;
// //       dailyMap[date].count   += t.quantity;
// //     });
// //     const dailySales = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
// //     const byEvent = {};
// //     recent.forEach((t) => {
// //       const eid = t.eventId?._id?.toString();
// //       if (!eid) return;
// //       if (!byEvent[eid]) byEvent[eid] = [];
// //       const date = new Date(t.purchaseDate).toISOString().split("T")[0];
// //       const rev  = t.ticketPrice || t.totalPrice || 0;
// //       const ex   = byEvent[eid].find((d) => d.date === date);
// //       if (ex) { ex.revenue += rev; ex.count += t.quantity; }
// //       else byEvent[eid].push({ date, revenue: rev, count: t.quantity });
// //     });
// //     return res.status(200).json({
// //       success: true,
// //       analytics: {
// //         totalRevenue:      tickets.reduce((s, t) => s + (t.ticketPrice || t.totalPrice || 0), 0),
// //         totalTicketsSold:  tickets.reduce((s, t) => s + t.quantity, 0),
// //         dailySales,
// //         dailySalesByEvent: byEvent,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("getPlannerAnalytics error:", error);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };



// // src/controllers/ticket.controller.js
// import Ticket from "../models/Ticket.js";
// import Event from "../models/Event.js";
// import User from "../models/User.js";
// import { initializePayment, verifyPayment } from "../services/paystack.service.js";
// import { generateQRCode } from "../services/qr.service.js";
// import { sendTicketEmail } from "../services/email.service.js";
// import { createRequestQueue } from "../middleware/requestQueue.js";

// // ─── Queues (tune with env vars, no code change needed) ──────────────────────
// // 2000 people at once => 20 run, up to 1000 wait, the rest get a friendly 503
// const initQueue = createRequestQueue({
//   name: "ticket-initialize",
//   concurrency: Number(process.env.INIT_QUEUE_CONCURRENCY) || 20,
//   maxWaiting: Number(process.env.INIT_QUEUE_MAX_WAITING) || 1000,
// });

// const verifyQueue = createRequestQueue({
//   name: "ticket-verify",
//   concurrency: Number(process.env.VERIFY_QUEUE_CONCURRENCY) || 10,
//   maxWaiting: Number(process.env.VERIFY_QUEUE_MAX_WAITING) || 1000,
// });

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

// // ─── Helper: give seats back if ticket creation fails after reserving ────────
// const releaseSeats = async (eventId, categoryId, qty) => {
//   try {
//     await Event.updateOne(
//       { _id: eventId, "ticketCategories._id": categoryId },
//       { $inc: { "ticketCategories.$.quantitySold": -qty } }
//     );
//   } catch (e) {
//     console.error("releaseSeats error:", e);
//   }
// };

// // ─── POST /api/tickets/initialize ────────────────────────────────────────────
// const initializeTicketPaymentHandler = async (req, res) => {
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

//     // ✅ Validate phone if logistics selected
//     if (logistics) {
//       const phone = logistics.contactPhone?.trim() || "";
//       if (!phone) {
//         return res.status(400).json({ success: false, message: "Phone number is required for logistics service" });
//       }
//       const cleaned = phone.replace(/\s/g, "");
//       if (!/^(\+234|0)[789][01]\d{8}$/.test(cleaned)) {
//         return res.status(400).json({ success: false, message: "Invalid Nigerian phone number" });
//       }
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
//       logistics:     logistics || null,  // includes contactPhone
//     };

//     const payResponse = await initializePayment(
//       user.email,
//       totalPrice,
//       metadata,
//       `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout`,
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
// const verifyTicketPaymentHandler = async (req, res) => {
//   const { reference } = req.params;
//   console.log("VERIFY HIT:", reference);

//   try {
//     // Layer 1: already exists?
//     const existing = await Ticket.findOne({ paymentReference: reference })
//       .populate("eventId", "title location date time media");
//     if (existing) {
//       return res.status(200).json({ success: true, ticket: existing });
//     }

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

//     const qty = Number(quantity);

//     // ✅ ATOMIC seat reservation: only succeeds if enough seats are still left.
//     // Safe even when hundreds of people verify at the same instant.
//     const reserve = await Event.updateOne(
//       {
//         _id: eventId,
//         ticketCategories: {
//           $elemMatch: {
//             _id: category._id,
//             quantitySold: { $lte: category.quantityAvailable - qty },
//           },
//         },
//       },
//       { $inc: { "ticketCategories.$.quantitySold": qty } }
//     );

//     if (reserve.modifiedCount === 0) {
//       return res.status(400).json({ success: false, message: "Not enough tickets available" });
//     }

//     const finalTicketPrice    = ticketPrice ?? category.price * qty;
//     const finalLogisticsPrice = logistics?.price || 0;
//     const finalTotalPrice     = finalTicketPrice + finalLogisticsPrice;

//     let ticket;
//     try {
//       const ticketCode = await generateTicketCode();

//       ticket = new Ticket({
//         userId,
//         eventId,
//         ticketCategoryId: category._id,
//         ticketTypeName:   category.name,
//         quantity:         qty,
//         ticketPrice:      finalTicketPrice,
//         totalPrice:       finalTotalPrice,
//         ticketCode,
//         logistics: logistics
//           ? {
//               tier:         logistics.tier,
//               name:         logistics.name,
//               price:        logistics.price,
//               // ✅ Phone number saved to ticket — visible to admin in logistics panel
//               contactPhone: logistics.contactPhone?.trim() || null,
//               contactName:  null,   // admin fills this later
//               pickupAddress: null,  // admin fills this later
//             }
//           : { tier: null, name: null, price: 0 },
//         status:           "active",
//         paymentReference: reference,
//         purchaseDate:     new Date(),
//       });

//       ticket.qrCode = await generateQRCode(ticketCode);
//       await ticket.save();
//     } catch (saveErr) {
//       // Ticket was not created, so give the reserved seats back
//       await releaseSeats(eventId, category._id, qty);

//       if (saveErr.code === 11000) {
//         const created = await Ticket.findOne({ paymentReference: reference })
//           .populate("eventId", "title location date time media");
//         if (created) {
//           return res.status(200).json({ success: true, ticket: created });
//         }
//       }
//       throw saveErr;
//     }

//     const populated = await Ticket.findById(ticket._id)
//       .populate("eventId", "title location date time media")
//       .populate("userId", "email username");

//     if (populated.userId?.email) {
//       sendTicketEmail({
//         to:       populated.userId.email,
//         username: populated.userId.username || "there",
//         event:    event.title,
//         ticket:   populated,
//         qrCode:   populated.qrCode,
//       }).catch((e) => console.error("Email error (non-fatal):", e));
//     }

//     return res.status(200).json({ success: true, ticket: populated });
//   } catch (error) {
//     console.error("verifyTicketPayment error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ✅ Exports go through the queues, so your routes file needs NO changes
// export const initializeTicketPayment = initQueue(initializeTicketPaymentHandler);
// export const verifyTicketPayment     = verifyQueue(verifyTicketPaymentHandler);

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
//     const ticket = await Ticket.findById(req.params.ticketId)
//       .populate("eventId")
//       .populate("userId", "email username");
//     if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
//     const email    = ticket.userId?.email;
//     const username = ticket.userId?.username || "there";
//     if (!email) return res.status(400).json({ success: false, message: "No email on file for this user" });
//     await sendTicketEmail({
//       to: email, username,
//       event:  ticket.eventId?.title || "your event",
//       ticket,
//       qrCode: ticket.qrCode,
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
//       const [, ...remove] = dup.ids;
//       await Ticket.deleteMany({ _id: { $in: remove } });
//       deleted += remove.length;
//     }
//     return res.status(200).json({ success: true, message: `Cleaned up ${deleted} duplicate ticket(s)`, deleted });
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
//         totalRevenue:      tickets.reduce((s, t) => s + (t.ticketPrice || t.totalPrice || 0), 0),
//         totalTicketsSold:  tickets.reduce((s, t) => s + t.quantity, 0),
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
import { createQueue, runExclusive, withQueue } from "../utils/requestQueue.js";

// ─── Queues (tune with env vars, defaults are safe starting points) ──────────
const num = (v, d) => (Number(v) > 0 ? Number(v) : d);

// Starting a payment: if too busy, we can safely ask the user to retry
const initQueue = createQueue({
  name: "payment-initialize",
  concurrency: num(process.env.QUEUE_INIT_CONCURRENCY, 30),
  maxQueued: num(process.env.QUEUE_INIT_MAX_WAITING, 1500),
  maxWaitMs: num(process.env.QUEUE_INIT_MAX_WAIT_MS, 30000),
});

// Verifying a payment: the user has ALREADY paid, so we allow a longer line
// and wait longer before giving up
const verifyQueue = createQueue({
  name: "payment-verify",
  concurrency: num(process.env.QUEUE_VERIFY_CONCURRENCY, 15),
  maxQueued: num(process.env.QUEUE_VERIFY_MAX_WAITING, 5000),
  maxWaitMs: num(process.env.QUEUE_VERIFY_MAX_WAIT_MS, 90000),
});

// Handy for a health/monitoring route: getQueueStats()
export const getQueueStats = () => ({
  initialize: initQueue.stats(),
  verify: verifyQueue.stats(),
});

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
const initializeTicketPaymentHandler = async (req, res) => {
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

    // ✅ Validate phone if logistics selected
    if (logistics) {
      const phone = logistics.contactPhone?.trim() || "";
      if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required for logistics service" });
      }
      const cleaned = phone.replace(/\s/g, "");
      if (!/^(\+234|0)[789][01]\d{8}$/.test(cleaned)) {
        return res.status(400).json({ success: false, message: "Invalid Nigerian phone number" });
      }
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
      logistics:     logistics || null,  // includes contactPhone
    };

    // // const payResponse = await initializePayment(
    // //   user.email,
    // //   totalPrice,
    // //   metadata,
    // //   "http://localhost:5173/checkout",
    // // );
    // const payResponse = await initializePayment(
    //   user.email,
    //   totalPrice,
    //   metadata,
    //   "https://passlly.com/checkout",
    // );
    const payResponse = await initializePayment(
      user.email,
      totalPrice,
      metadata,
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout`,
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

// Queued version (skips users who already closed the page while waiting)
export const initializeTicketPayment = withQueue(
  initQueue,
  initializeTicketPaymentHandler,
  { skipIfClosed: true, retryAfterSec: 5 },
);

// ─── GET /api/tickets/verify/:reference ──────────────────────────────────────
const verifyTicketPaymentHandler = async (req, res) => {
  const { reference } = req.params;
  console.log("VERIFY HIT:", reference);

  try {
    // Layer 1: already exists?
    const existing = await Ticket.findOne({ paymentReference: reference })
      .populate("eventId", "title location date time media");
    if (existing) {
      return res.status(200).json({ success: true, ticket: existing });
    }

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

    // 🔒 Only one ticket creation per event at a time, so the sold count
    // can never be overwritten by two buyers at the same moment
    return await runExclusive(`event:${eventId}`, async () => {
      // Re-check inside the lock (a duplicate request may have finished while we waited)
      const already = await Ticket.findOne({ paymentReference: reference })
        .populate("eventId", "title location date time media");
      if (already) {
        return res.status(200).json({ success: true, ticket: already });
      }

      // Load the event fresh, inside the lock
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
          ? {
              tier:         logistics.tier,
              name:         logistics.name,
              price:        logistics.price,
              // ✅ Phone number saved to ticket — visible to admin in logistics panel
              contactPhone: logistics.contactPhone?.trim() || null,
              contactName:  null,   // admin fills this later
              pickupAddress: null,  // admin fills this later
            }
          : { tier: null, name: null, price: 0 },
        status:           "active",
        paymentReference: reference,
        purchaseDate:     new Date(),
      });

      ticket.qrCode = await generateQRCode(ticketCode);

      try {
        await ticket.save();
      } catch (saveErr) {
        if (saveErr.code === 11000) {
          const created = await Ticket.findOne({ paymentReference: reference })
            .populate("eventId", "title location date time media");
          return res.status(200).json({ success: true, ticket: created });
        }
        throw saveErr;
      }

      category.quantitySold += Number(quantity);
      await event.save();

      const populated = await Ticket.findById(ticket._id)
        .populate("eventId", "title location date time media")
        .populate("userId", "email username");

      if (populated.userId?.email) {
        sendTicketEmail({
          to:       populated.userId.email,
          username: populated.userId.username || "there",
          event:    event.title,
          ticket:   populated,
          qrCode:   populated.qrCode,
        }).catch((e) => console.error("Email error (non-fatal):", e));
      }

      return res.status(200).json({ success: true, ticket: populated });
    });
  } catch (error) {
    console.error("verifyTicketPayment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Queued version (NOT skipped if the user leaves: they've already paid,
// so the ticket should still be created)
export const verifyTicketPayment = withQueue(
  verifyQueue,
  verifyTicketPaymentHandler,
  { skipIfClosed: false, retryAfterSec: 5 },
);

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
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate("eventId")
      .populate("userId", "email username");
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    const email    = ticket.userId?.email;
    const username = ticket.userId?.username || "there";
    if (!email) return res.status(400).json({ success: false, message: "No email on file for this user" });
    await sendTicketEmail({
      to: email, username,
      event:  ticket.eventId?.title || "your event",
      ticket,
      qrCode: ticket.qrCode,
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
      const [, ...remove] = dup.ids;
      await Ticket.deleteMany({ _id: { $in: remove } });
      deleted += remove.length;
    }
    return res.status(200).json({ success: true, message: `Cleaned up ${deleted} duplicate ticket(s)`, deleted });
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
        totalRevenue:      tickets.reduce((s, t) => s + (t.ticketPrice || t.totalPrice || 0), 0),
        totalTicketsSold:  tickets.reduce((s, t) => s + t.quantity, 0),
        dailySales,
        dailySalesByEvent: byEvent,
      },
    });
  } catch (error) {
    console.error("getPlannerAnalytics error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};