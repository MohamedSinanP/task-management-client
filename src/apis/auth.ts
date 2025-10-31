import type { ApiResponse, LoginPayload, SignupPayload } from '../types/type';
import api from './api';

// Signup
export const signup = async (data: SignupPayload): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/auth/signup", data);
  return response.data;
};

// Login
export const login = async (data: LoginPayload): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/auth/login", data);
  return response.data;
};

// Logout
export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
};