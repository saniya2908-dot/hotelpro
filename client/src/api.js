import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD
  ? "https://hotelpro-api-02lk.onrender.com/api"
  : "http://localhost:8001/api");

const api = axios.create({
  baseURL: apiBaseURL,
});

// Attach the saved authentication token to API requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
