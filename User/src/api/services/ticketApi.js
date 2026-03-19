

// // src/api/services/ticketApi.js
// import API from "../axios";
// import {jwtDecode} from "jwt-decode";

// export const preCheckout = async (data) => {
//   const response = await API.post("/tickets/precheckout", data);
//   return response.data;
// };



// // Initialize Paystack payment
// export const initializeTicketPayment = async (payload) => {
//   const res = await API.post("/tickets/pay", payload);
//   return res.data;
// };

// // Verify Paystack payment
// export const verifyTicketPayment = async (reference) => {
//   const res = await API.get(`/tickets/verify/${reference}`);
//   return res.data;
// };


// export const buyTicket = async (data) => {
//   const response = await API.post("/tickets/buy", data);
//   return response.data;
// };

// export const getMyTickets = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("No token found");

//   const decoded = jwtDecode(token);
//   const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;

//   if (!userId) throw new Error("User ID not found in token");

//   const response = await API.get(`/tickets/user/${userId}`);
//   return response.data;
// };



// src/api/services/ticketApi.js
import API from "../axios";

/**
 * Pre-checkout before payment (optional validation step)
 */
export const preCheckout = async (data) => {
  const response = await API.post("/tickets/precheckout", data);
  return response.data;
};

/**
 * Initialize Paystack payment
 */
export const initializeTicketPayment = async (payload) => {
  const res = await API.post("/tickets/initialize", payload);
  return res.data;
};

/**
 * Verify Paystack payment
 */
export const verifyTicketPayment = async (reference) => {
  const res = await API.get(`/tickets/verify/${reference}`);
  return res.data;
};

/**
 * Direct ticket purchase (if supported)
 */
export const buyTicket = async (data) => {
  const response = await API.post("/tickets/buy", data);
  return response.data;
};

/**
 * Get currently logged-in user's tickets
 * (JWT-based — backend extracts user from token)
 */
// export const getMyTickets = async () => {
//   const response = await API.get("/tickets/my");
//   return response.data;
// };
// export const getMyTickets = async () => {
//   console.log("📡 CALLING GET MY TICKETS");
//   console.log("BASE URL:", API.defaults.baseURL);
//   const response = await API.get("/tickets/my");
//   console.log("RESPONSE:", response.data);
//   return response.data;
// };

export const getMyTickets = async () => {
  const response = await API.get(`/tickets/my?t=${Date.now()}`);
  return response.data;
};
