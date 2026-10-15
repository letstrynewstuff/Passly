import API from "../axios";

export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};
// ── Dedicated scanner/staff login (restricted to admin + planner) ────────────
export const scannerLogin = async ({ identifier, password }) => {
  const response = await API.post("/auth/scanner-login", {
    identifier,
    password,
  });
  return response.data;
};
export const masterScannerLogin = async ({ identifier, password }) => {
  const res = await API.post("/scanner/master-login", { identifier, password });
  return res.data;
};