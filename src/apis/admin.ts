import type {
  ActivityLogResponse,
  CreateProjectPayload,
  ProjectResponse,
  ProjectsResponse,
  UpdateProjectPayload,
  UsersResponse
} from '../types/type';
import api from './api';

// ========== PROJECT APIs ==========

export const createProject = async (
  data: CreateProjectPayload
): Promise<ProjectResponse> => {
  const response = await api.post<ProjectResponse>('/project', data);
  return response.data;
};

export const getPaginatedProjects = async (
  page: number = 1,
  limit: number = 10
): Promise<ProjectsResponse> => {
  const response = await api.get<ProjectsResponse>('/project/paginated', {
    params: { page, limit },
  });
  return response.data;
};

export const getAllProjects = async (): Promise<ProjectsResponse> => {
  const response = await api.get<ProjectsResponse>('/project');
  return response.data;
};

export const getProjectById = async (id: string): Promise<ProjectResponse> => {
  const response = await api.get<ProjectResponse>(`/project/${id}`);
  return response.data;
};

export const updateProject = async (
  id: string,
  data: UpdateProjectPayload
): Promise<ProjectResponse> => {
  const response = await api.put<ProjectResponse>(`/project/${id}`, data);
  return response.data;
};

export const deleteProject = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/project/${id}`);
  return response.data;
};

// ========== USER APIs ==========

export const getAllUsers = async (): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>('/admin/users');
  return response.data;
};

// ========== Activity logs APIs ==========

export const getAllLogs = async (
  page: number = 1,
  limit: number = 10
): Promise<ActivityLogResponse> => {
  const { data } = await api.get<ActivityLogResponse>('/admin/active-logs', {
    params: { page, limit },
  });
  return data;
};