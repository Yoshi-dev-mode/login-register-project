import axios from "axios"
import { getAccessToken, setAccessTokenGlobal } from "../context/AuthProvider";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true // ✅ REQUIRED for cookies
})

// 🔹 REQUEST: attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  console.log("Token ->>>>>", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 🔹 RESPONSE: refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 🚫 Don't retry refresh endpoint
    if (originalRequest.url === "/refresh") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Refreshing access token...");

        const res = await api.post("/refresh");
        const newAccessToken = res.data.accessToken;

        setAccessTokenGlobal(newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.log("❌ Refresh failed → logout");

        setAccessTokenGlobal(null);
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

