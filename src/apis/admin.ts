import type { CreateProjectPayload, ProjectResponse, ProjectsResponse, UpdateProjectPayload, UsersResponse } from '../types/type';
import api from './api';


// ========== PROJECT APIs ==========

// Create a new project

export const createProject = async (
  data: CreateProjectPayload
): Promise<ProjectResponse> => {
  const response = await api.post<ProjectResponse>('/project', data);
  return response.data;
};


// Get all projects

export const getAllProjects = async (): Promise<ProjectsResponse> => {
  const response = await api.get<ProjectsResponse>('/project');
  return response.data;
};

// Get a single project by ID

export const getProjectById = async (id: string): Promise<ProjectResponse> => {
  const response = await api.get<ProjectResponse>(`/project/${id}`);
  return response.data;
};

// Update a project

export const updateProject = async (
  id: string,
  data: UpdateProjectPayload
): Promise<ProjectResponse> => {
  const response = await api.put<ProjectResponse>(`/project/${id}`, data);
  return response.data;
};

// Delete a project

export const deleteProject = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/project/${id}`);
  return response.data;
};

// ========== USER APIs ==========

// Get all users (for member selection)

export const getAllUsers = async (): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>('/admin/users');
  return response.data;
};
// ========== Active logs APIs ==========

// Get all users (for member selection)

/* ---------- TYPES ---------- */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Project {
  _id: string;
  name: string;
}

export interface Task {
  _id: string;
  title: string;
  projectId?: Project | null;
}

export interface Change {
  field: string;
  oldValue: string | null;
  newValue: string;
}

export interface ActivityLog {
  _id: string;
  taskId: Task;
  updatedBy: User;
  changes: Change[];
  updatedAt: string;
}

export interface ActivityLogResponse {
  message: string;
  count: number;
  logs: ActivityLog[];
}

/* ---------- API ---------- */
export const getAllLogs = async (): Promise<ActivityLogResponse> => {
  const { data } = await api.get<ActivityLogResponse>('/admin/active-logs');
  return data;
};