
// src/api/services/adminApi.js
import API from "../axios";

const adminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

// Auth
export const loginAdmin = (email, password) =>
  API.post("/admin/login", { email, password }).then((r) => r.data);

export const getDashboardStats = () =>
  API.get("/admin/stats", { headers: adminHeaders() }).then((r) => r.data);

// Events
export const getAllEvents = () =>
  API.get("/admin/events", { headers: adminHeaders() }).then((r) => r.data);
export const approveEvent = (id) =>
  API.patch(
    `/admin/events/${id}/approve`,
    {},
    { headers: adminHeaders() },
  ).then((r) => r.data);
export const rejectEvent = (id) =>
  API.patch(`/admin/events/${id}/reject`, {}, { headers: adminHeaders() }).then(
    (r) => r.data,
  );
export const deleteEvent = (id) =>
  API.delete(`/admin/events/${id}`, { headers: adminHeaders() }).then(
    (r) => r.data,
  );

// Planners
export const getAllPlanners = () =>
  API.get("/admin/planners", { headers: adminHeaders() }).then((r) => r.data);
export const getPlannerDetails = (id) =>
  API.get(`/admin/planners/${id}`, { headers: adminHeaders() }).then(
    (r) => r.data,
  );
export const verifyPlanner = (id) =>
  API.patch(
    `/admin/planners/${id}/verify`,
    {},
    { headers: adminHeaders() },
  ).then((r) => r.data);
export const suspendPlanner = (id) =>
  API.patch(
    `/admin/planners/${id}/suspend`,
    {},
    { headers: adminHeaders() },
  ).then((r) => r.data);
export const unsuspendPlanner = (id) =>
  API.patch(
    `/admin/planners/${id}/unsuspend`,
    {},
    { headers: adminHeaders() },
  ).then((r) => r.data);

// Users
export const getAllUsers = () =>
  API.get("/admin/users", { headers: adminHeaders() }).then((r) => r.data);

// Withdrawals — admin
export const getWithdrawals = () =>
  API.get("/admin/withdrawals", { headers: adminHeaders() }).then(
    (r) => r.data,
  );
export const approveWithdrawal = (id) =>
  API.patch(
    `/admin/withdrawals/${id}/approve`,
    {},
    { headers: adminHeaders() },
  ).then((r) => r.data);
export const rejectWithdrawal = (id) =>
  API.patch(
    `/admin/withdrawals/${id}/reject`,
    {},
    { headers: adminHeaders() },
  ).then((r) => r.data);
export const markWithdrawalPaid = (id) =>
  API.patch(
    `/admin/withdrawals/${id}/paid`,
    {},
    { headers: adminHeaders() },
  ).then((r) => r.data);

// Withdrawal request — called by planner
export const requestWithdrawal = ({
  amount,
  bankName,
  accountNumber,
  accountName,
}) =>
  API.post(
    "/admin/withdrawals/request",
    { amount, bankName, accountNumber, accountName },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
  ).then((r) => r.data);
