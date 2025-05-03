import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens
} from "./auth";


export const api = axios.create({
  baseURL: "https://careerguidance.runasp.net",
});

let refreshTimer = null;

// Function to schedule token refresh before it expires
export const scheduleTokenRefresh = (expiresInSeconds) => {
  clearTimeout(refreshTimer); // Clear any previous timer

  const bufferInSeconds = 60; // Refresh 1 minute before expiry
  const refreshTime = (expiresInSeconds - bufferInSeconds) * 1000;

  if (refreshTime <= 0) {
    refreshAccessToken(); // Token is about to expire, refresh now
  } else {
    refreshTimer = setTimeout(async () => {
      try {
        await refreshAccessToken();
      } catch (err) {
        console.error("Token refresh failed", err);
        clearTokens()
        window.location.href = '/registration';
      }
    }, refreshTime);
  }
};

// Function to refresh token
const refreshAccessToken = async () => {
  const oldToken = getAccessToken();
  const refreshToken = getRefreshToken();

  try {
    const response = await axios.post(
      "https://careerguidance.runasp.net/Auth/refresh",
      {
        token: oldToken,
        refreshToken,
      }
    );

    const {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    } = response.data;

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    scheduleTokenRefresh(expiresIn);

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearTokens()
    window.location.href = '/registration';
  }
};

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 errors and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the failed request
      } catch (err) {
        clearTokens()
        window.location.href = '/registration';
        console.error("Refresh token failed on 401 retry", err);
      }
    }

    return Promise.reject(error);
  }
);
