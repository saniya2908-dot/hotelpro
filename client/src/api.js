import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const apiBaseURL = (configuredApiUrl || (import.meta.env.PROD
  ? "https://hotelpro-api-p49g.onrender.com/api"
  : "http://localhost:8001/api")).replace(/\/$/, "");

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
