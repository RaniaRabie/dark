import axios from "axios";

// Callback to notify AuthContext of token updates
let updateTokensCallback = null;

export const setUpdateTokensCallback = (callback) => {
  updateTokensCallback = callback;
};

// Token storage helpers
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const setAccessToken = (token) => localStorage.setItem("accessToken", token);
export const setRefreshToken = (token) => localStorage.setItem("refreshToken", token);
export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Refresh token logic
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://careerguidance.runasp.net/api/refresh-token",
      {
        refreshToken: getRefreshToken(),
      }
    );
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setAccessToken(accessToken);
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }
    // Notify AuthContext of new tokens
    if (updateTokensCallback) {
      updateTokensCallback(accessToken, newRefreshToken);
    }
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    clearTokens();
    window.location.href = "/regesteration";
    throw new Error("Session expired. Please log in again.");
  }
};

// Axios interceptor setup
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response.config.url !==
        "https://careerguidance.runasp.net/api/refresh-token"
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// export const apiClient = axios;