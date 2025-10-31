// Types related projects
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  members: string[];
}




// ========== TYPES ==========
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  members?: string[];
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  members?: string[];
}

export interface ProjectResponse {
  message: string;
  project: Project;
}

export interface ProjectsResponse {
  message?: string;
  projects: Project[];
}

export interface UsersResponse {
  message: string;
  users: User[];
}



export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse {
  message: string;
  user?: UserResponse;
}
