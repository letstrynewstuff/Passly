// src/api/services/withdrawalApi.js
// Planner-facing withdrawal API calls
// Uses the regular planner "token" (not adminToken)

import API from "../axios"; // your pre-configured axios instance

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── GET /api/withdrawals/balance ──────────────────────────────────────────────
// Returns planner's available balance breakdown
// { grossRevenue, totalPaidOut, inProgress, available }
export const getWithdrawalBalance = () =>
  API.get("/withdrawals/balance", { headers: authHeader() }).then(
    (r) => r.data,
  );

// ── GET /api/withdrawals/my ───────────────────────────────────────────────────
// Returns planner's own withdrawal history (all statuses)
export const getMyWithdrawals = () =>
  API.get("/withdrawals/my", { headers: authHeader() }).then((r) => r.data);

// ── POST /api/withdrawals/request ────────────────────────────────────────────
// Submit a new withdrawal request (requires password confirmation)
// payload: { amount, bankName, accountNumber, accountName, password }
export const requestWithdrawal = (payload) =>
  API.post("/withdrawals/request", payload, { headers: authHeader() }).then(
    (r) => r.data,
  );
