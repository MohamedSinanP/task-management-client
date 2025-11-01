import type { CreateTaskPayload, TaskResponse, TasksResponse, UpdateTaskPayload } from "../types/type";
import api from "./api";

// ========== TASK APIs ==========

export const createTask = async (
  data: CreateTaskPayload
): Promise<TaskResponse> => {
  const response = await api.post<TaskResponse>('/task', data);
  return response.data;
};

export const getAllTasks = async (): Promise<TasksResponse> => {
  const response = await api.get<TasksResponse>('/task');
  return response.data;
};

export const getTaskById = async (id: string): Promise<TaskResponse> => {
  const response = await api.get<TaskResponse>(`/task/${id}`);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: UpdateTaskPayload
): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(`/task/${id}`, data);
  return response.data;
};

export const updateTaskStatus = async (
  id: string,
  status: 'Todo' | 'In-Progress' | 'Done'
): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(`/task/${id}`, { status });
  return response.data;
};

export const deleteTask = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/task/${id}`);
  return response.data;
};
