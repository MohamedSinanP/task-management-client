// src/lib/api.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});


api.interceptors.response.use(
  response => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message?.toString()?.toLowerCase() || "";

    const isAuthError =
      status === 401 ||
      status === 403 ||
      message.includes("unauthenticated") ||
      message.includes("unauthorized");

    if (isAuthError) {
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default api;
