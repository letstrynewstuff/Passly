

// // src/routes/ticket.routes.js
// import express from "express";
// import { authenticateJWT } from "../middleware/auth.middleware.js";
// import {
//   initializeTicketPayment,
//   verifyTicketPayment,
//   getMyTickets,
//   resendTicketEmail,
//   getPlannerAnalytics,
// } from "../controllers/ticket.controller.js";

// const router = express.Router();

// // Protected routes
// router.use(authenticateJWT);

// router.post("/initialize", initializeTicketPayment);
// router.post("/:ticketId/resend-email", resendTicketEmail);

// // router.post("/precheckout", preCheckout);
// // router.post("/buy", buyTicket);
// router.get("/verify/:reference", verifyTicketPayment);
// router.get("/my", getMyTickets);
// router.get("/analytics", getPlannerAnalytics);
// export default router;

// src/routes/ticket.routes.js
import express from "express";
import { authUser, authAdmin } from "../controllers/auth.controller.js";
import {
  initializeTicketPayment,
  verifyTicketPayment,
  getMyTickets,
  resendTicketEmail,
  getPlannerAnalytics,
  deleteDuplicateTickets,
} from "../controllers/ticket.controller.js";

const router = express.Router();

// ── /my and /analytics MUST come before /:reference (order matters in Express)

// User / planner routes
router.post("/initialize",          authUser, initializeTicketPayment);
router.get("/my",                   authUser, getMyTickets);
router.get("/analytics",            authUser, getPlannerAnalytics);
router.get("/verify/:reference",    authUser, verifyTicketPayment);
router.post("/:ticketId/resend-email", authUser, resendTicketEmail);

// Admin: one-time duplicate cleanup — call once then remove if desired
router.delete("/admin/cleanup-duplicates", authAdmin, deleteDuplicateTickets);

export default router;