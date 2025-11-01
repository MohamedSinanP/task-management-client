import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// === Create a second axios instance for refreshing token ===
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// === Flag to prevent infinite refresh loops ===
let isRefreshing = false;
let failedQueue: any[] = [];

// Helper function to process queued requests after refresh completes
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// === Response Interceptor ===
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await refreshApi.post("/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        console.error("Token refresh failed, redirecting to login...");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    // For all other errors
    return Promise.reject(error);
  }
);

export default api;
