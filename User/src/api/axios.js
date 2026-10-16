

// src/api/axios.js
import axios from "axios";

// ✅ Smart baseURL (env first, fallback to localhost)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://passllly.onrender.com/api");

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 — session expired
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Network error
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
      });
    }

    return Promise.reject(error);
  },
);

export default API;