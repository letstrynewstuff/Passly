// // src/routes/adminRoutes.js
// import express from "express";
// import {
//   loginAdmin,
//   getDashboardStats,
//   getAllEvents,
//   approveEvent,
//   rejectEvent,
//   deleteEvent,
//   getAllPlanners,
//   suspendPlanner,
//   verifyPlanner,
//   getWithdrawals,
//   approveWithdrawal,
//   rejectWithdrawal,
//   markWithdrawalPaid,
//   getAllUsers,
//   detectFraud,
// } from "../controllers/adminController.js";

// import { authAdmin } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.post("/login", loginAdmin);

// router.get("/stats", authAdmin, getDashboardStats);

// router.get("/events", authAdmin, getAllEvents);
// router.patch("/events/:id/approve", authAdmin, approveEvent);
// router.patch("/events/:id/reject", authAdmin, rejectEvent);
// router.patch("/events/:id/delete", authAdmin, deleteEvent);

// router.get("/planners", authAdmin, getAllPlanners);
// router.patch("/planners/:id/suspend", authAdmin, suspendPlanner);
// router.patch("/planners/:id/verify", authAdmin, verifyPlanner);

// router.get("/withdrawals", authAdmin, getWithdrawals);
// router.patch("/withdrawals/:id/approve", authAdmin, approveWithdrawal);
// router.patch("/withdrawals/:id/reject", authAdmin, rejectWithdrawal);
// router.patch("/withdrawals/:id/paid", authAdmin, markWithdrawalPaid);

// router.get("/users", authAdmin, getAllUsers);

// router.get("/fraud", authAdmin, detectFraud);

// export default router;

// // src/routes/admin.routes.js
// import express from "express";
// import {
//   loginAdmin,
//   getDashboardStats,
//   getAllEvents,
//   approveEvent,
//   rejectEvent,
//   deleteEvent,
//   getAllPlanners,
//   suspendPlanner,
//   unsuspendPlanner,
//   verifyPlanner,
//   getPlannerDetails,
//   getAllUsers,
//   getWithdrawals,
//   approveWithdrawal,
//   rejectWithdrawal,
//   markWithdrawalPaid,
//   requestWithdrawal,
// } from "../controllers/adminController.js";
// import {
//   verifyToken,
//   requireAdmin,
//   requirePlanner,
// } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // ── Public ────────────────────────────────────────────────────────────────────
// router.post("/login", loginAdmin);

// // ── Admin: Dashboard ──────────────────────────────────────────────────────────
// router.get("/stats", verifyToken, requireAdmin, getDashboardStats);

// // ── Admin: Events ─────────────────────────────────────────────────────────────
// router.get("/events", verifyToken, requireAdmin, getAllEvents);
// router.patch("/events/:id/approve", verifyToken, requireAdmin, approveEvent);
// router.patch("/events/:id/reject", verifyToken, requireAdmin, rejectEvent);
// router.delete("/events/:id", verifyToken, requireAdmin, deleteEvent);

// // ── Admin: Planners ───────────────────────────────────────────────────────────
// router.get("/planners", verifyToken, requireAdmin, getAllPlanners);
// router.get("/planners/:id", verifyToken, requireAdmin, getPlannerDetails);
// router.patch("/planners/:id/suspend", verifyToken, requireAdmin, suspendPlanner);
// router.patch("/planners/:id/unsuspend", verifyToken, requireAdmin, unsuspendPlanner);
// router.patch("/planners/:id/verify", verifyToken, requireAdmin, verifyPlanner);

// // ── Admin: Users ──────────────────────────────────────────────────────────────
// router.get("/users", verifyToken, requireAdmin, getAllUsers);

// // ── Admin: Withdrawals ────────────────────────────────────────────────────────
// router.get("/withdrawals", verifyToken, requireAdmin, getWithdrawals);
// router.patch("/withdrawals/:id/approve", verifyToken, requireAdmin, approveWithdrawal);
// router.patch("/withdrawals/:id/reject", verifyToken, requireAdmin, rejectWithdrawal);
// router.patch("/withdrawals/:id/paid", verifyToken, requireAdmin, markWithdrawalPaid);

// // ── Planner: Request payout ───────────────────────────────────────────────────
// router.post("/withdrawals/request", verifyToken, requirePlanner, requestWithdrawal);

// export default router;


// // src/routes/adminRoutes.js
// import express from "express";
// import {
//   loginAdmin,
//   getDashboardStats,
//   getAllEvents,
//   approveEvent,
//   rejectEvent,
//   deleteEvent,
//   getAllPlanners,
//   suspendPlanner,
//   verifyPlanner,
//   getAllUsers,
//   detectFraud,
// } from "../controllers/adminController.js";

// // ✅ Withdrawal actions come from withdrawal.controller, NOT adminController
// // This keeps one source of truth — both /api/admin/withdrawals and
// // /api/withdrawals share the same controller functions
// import {
//   getAllWithdrawals,
//   approveWithdrawal,
//   rejectWithdrawal,
//   markWithdrawalPaid,
// } from "../controllers/withdrawal.controller.js";

// import { authAdmin } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // ── Auth ──────────────────────────────────────────────────────────────────────
// router.post("/login", loginAdmin);

// // ── Dashboard ─────────────────────────────────────────────────────────────────
// router.get("/stats", authAdmin, getDashboardStats);

// // ── Events ────────────────────────────────────────────────────────────────────
// router.get("/events",                   authAdmin, getAllEvents);
// router.patch("/events/:id/approve",     authAdmin, approveEvent);
// router.patch("/events/:id/reject",      authAdmin, rejectEvent);
// router.patch("/events/:id/delete",      authAdmin, deleteEvent);

// // ── Planners ──────────────────────────────────────────────────────────────────
// router.get("/planners",                 authAdmin, getAllPlanners);
// router.patch("/planners/:id/suspend",   authAdmin, suspendPlanner);
// router.patch("/planners/:id/verify",    authAdmin, verifyPlanner);

// // ── Withdrawals — shared with withdrawal.controller.js ───────────────────────
// router.get("/withdrawals",                    authAdmin, getAllWithdrawals);
// router.patch("/withdrawals/:id/approve",      authAdmin, approveWithdrawal);
// router.patch("/withdrawals/:id/reject",       authAdmin, rejectWithdrawal);
// router.patch("/withdrawals/:id/paid",         authAdmin, markWithdrawalPaid);

// // ── Users ─────────────────────────────────────────────────────────────────────
// router.get("/users",  authAdmin, getAllUsers);

// // ── Fraud detection ───────────────────────────────────────────────────────────
// router.get("/fraud",  authAdmin, detectFraud);

// export default router;


// src/routes/adminRoutes.js
import express from "express";
import {
  loginAdmin,
  getDashboardStats,
  getAllEvents,
  approveEvent,
  rejectEvent,
  deleteEvent,
  getAllPlanners,
  suspendPlanner,
  verifyPlanner,
  getAllUsers,
  detectFraud,
  getLogisticsOrders,
  updateLogisticsDetails,
} from "../controllers/adminController.js";

import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  markWithdrawalPaid,
} from "../controllers/withdrawal.controller.js";


import { authAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/login", loginAdmin);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get("/stats", authAdmin, getDashboardStats);

// ── Events ────────────────────────────────────────────────────────────────────
router.get("/events",                   authAdmin, getAllEvents);
router.patch("/events/:id/approve",     authAdmin, approveEvent);
router.patch("/events/:id/reject",      authAdmin, rejectEvent);
router.patch("/events/:id/delete",      authAdmin, deleteEvent);

// ── Planners ──────────────────────────────────────────────────────────────────
router.get("/planners",                 authAdmin, getAllPlanners);
router.patch("/planners/:id/suspend",   authAdmin, suspendPlanner);
router.patch("/planners/:id/verify",    authAdmin, verifyPlanner);

// ── Withdrawals ───────────────────────────────────────────────────────────────
router.get("/withdrawals",                     authAdmin, getAllWithdrawals);
router.patch("/withdrawals/:id/approve",       authAdmin, approveWithdrawal);
router.patch("/withdrawals/:id/reject",        authAdmin, rejectWithdrawal);
router.patch("/withdrawals/:id/paid",          authAdmin, markWithdrawalPaid);

// ── Logistics ─────────────────────────────────────────────────────────────────
router.get("/logistics",                       authAdmin, getLogisticsOrders);
router.patch("/logistics/:ticketId",           authAdmin, updateLogisticsDetails);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users",                           authAdmin, getAllUsers);

// ── Fraud ─────────────────────────────────────────────────────────────────────
router.get("/fraud",                           authAdmin, detectFraud);

export default router;