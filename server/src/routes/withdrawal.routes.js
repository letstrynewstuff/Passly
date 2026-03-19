// // src/routes/withdrawal.routes.js
// import express from "express";
// import {
//   getBalance,
//   getMyWithdrawals,
//   requestWithdrawal,
//   getAllWithdrawals,
//   approveWithdrawal,
//   rejectWithdrawal,
//   markWithdrawalPaid,
// } from "../controllers/withdrawal.controller.js";
// import {
//   verifyToken,
//   requireAdmin,
//   requirePlanner,
// } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // ── Planner routes (auth required, role = planner) ────────────────────────────
// router.get("/balance", verifyToken, requirePlanner, getBalance);
// router.get("/my", verifyToken, requirePlanner, getMyWithdrawals);
// router.post("/request", verifyToken, requirePlanner, requestWithdrawal);

// // ── Admin routes ──────────────────────────────────────────────────────────────
// router.get("/", verifyToken, requireAdmin, getAllWithdrawals);
// router.patch("/:id/approve", verifyToken, requireAdmin, approveWithdrawal);
// router.patch("/:id/reject", verifyToken, requireAdmin, rejectWithdrawal);
// router.patch("/:id/paid", verifyToken, requireAdmin, markWithdrawalPaid);

// export default router;

// /*
//   Register in your server.js / app.js:
  
//   import withdrawalRoutes from "./routes/withdrawal.routes.js";
//   app.use("/api/withdrawals", withdrawalRoutes);

//   Admin dashboard already calls /api/admin/withdrawals — update those
//   calls to /api/withdrawals OR add aliases in your admin routes:

//   // In admin.routes.js, proxy to withdrawal controller:
//   import { getAllWithdrawals, approveWithdrawal, rejectWithdrawal, markWithdrawalPaid }
//     from "../controllers/withdrawal.controller.js";
//   router.get("/withdrawals",              verifyToken, requireAdmin, getAllWithdrawals);
//   router.patch("/withdrawals/:id/approve",verifyToken, requireAdmin, approveWithdrawal);
//   router.patch("/withdrawals/:id/reject", verifyToken, requireAdmin, rejectWithdrawal);
//   router.patch("/withdrawals/:id/paid",   verifyToken, requireAdmin, markWithdrawalPaid);
// */


// src/routes/withdrawal.routes.js
import express from "express";
import {
  getBalance,
  getMyWithdrawals,
  requestWithdrawal,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  markWithdrawalPaid,
} from "../controllers/withdrawal.controller.js";

// ✅ Use the same middleware names already in your project
import { authUser, authAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

// ── Planner routes ────────────────────────────────────────────────────────────
// Uses authUser — token already stored from login, no extra verification needed
router.get("/balance",  authUser, getBalance);
router.get("/my",       authUser, getMyWithdrawals);
router.post("/request", authUser, requestWithdrawal);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get("/",              authAdmin, getAllWithdrawals);
router.patch("/:id/approve", authAdmin, approveWithdrawal);
router.patch("/:id/reject",  authAdmin, rejectWithdrawal);
router.patch("/:id/paid",    authAdmin, markWithdrawalPaid);

export default router;