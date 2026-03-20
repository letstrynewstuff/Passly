
// // src/api/axios.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//     "Cache-Control": "no-cache",
//     Pragma: "no-cache",
//   },
// });

// // Request interceptor
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // Response interceptor
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // 401 — session expired, redirect to login
//     if (error.response?.status === 401) {
//       alert("Session expired. Please log in again.");
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//       return Promise.reject(error); // still reject so callers know
//     }

//     // No response at all — network error
//     if (!error.response) {
//       return Promise.reject({
//         message: "Network error. Please check your connection.",
//       });
//     }

//     // ✅ Always reject with the full Axios error object
//     // so catch blocks can access err.response.data, err.response.status, etc.
//     return Promise.reject(error);
//   },
// );

// export default API;


// src/api/axios.js
import axios from "axios";

// ✅ Smart baseURL (env first, fallback to localhost)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://passly.onrender.com/api");

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