import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3001" });

// register user
export const register = (data) => API.post("/auth/register", data);

// login user
export const login = (data) => API.post("/auth/login", data);

// scan food
export const scanFood = (formData, token) =>
  API.post("/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

// get user history
export const getHistory = (token) =>
  API.get("/scan/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
