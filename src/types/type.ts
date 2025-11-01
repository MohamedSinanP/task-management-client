/* ---------- TYPES realted to Notifications ---------- */
export interface NotificationProject {
  _id: string;
  name: string;
}

export interface NotificationTask {
  _id: string;
  title: string;
  status: string;
  priority: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  message: string;
  type: "task_assigned" | "task_updated";
  taskId?: NotificationTask | null;
  projectId?: NotificationProject | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  message: string;
  notifications: NotificationItem[];
  unreadCount: number;
}

export interface MarkReadResponse {
  message: string;
  notification: NotificationItem;
}

export interface GenericMessage {
  message: string;
}



/* ---------- TYPES related to the ActiveLogs ---------- */
export interface ActiveLogUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ActiveLogProject {
  _id: string;
  name: string;
}

export interface ActiveLogTask {
  _id: string;
  title: string;
  projectId?: ActiveLogProject | null;
}

export interface Change {
  field: string;
  oldValue: string | null;
  newValue: string;
}

export interface ActivityLog {
  _id: string;
  taskId: ActiveLogTask;
  updatedBy: ActiveLogUser;
  changes: Change[];
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}


export interface ActivityLogResponse {
  message: string;
  logs: ActivityLog[];
  count?: number;
  pagination: PaginationInfo;
}


// ========== TYPES related to the Tasks ==========
export interface TaskUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'Todo' | 'In-Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  projectId: string;
  assignedTo: string;
}

export interface TaskProject {
  _id: string;
  name: string;
  members?: TaskUser[]
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'In-Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId: TaskProject | string;
  assignedTo?: TaskUser;
  createdBy: TaskUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: 'Todo' | 'In-Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId: string;
  assignedTo: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: 'Todo' | 'In-Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  assignedTo?: string;
}

export interface TaskResponse {
  message: string;
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
}

// ========== TYPES related to the Kanban ==========
export interface KanbanUser {
  _id: string;
  name: string;
  email: string;
}

export interface KanbanProject {
  _id: string;
  name: string;
}

export interface KanbanTask {
  _id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'In-Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId: KanbanProject | string;
  assignedTo?: KanbanUser;
  createdBy: KanbanUser;
  createdAt: string;
  updatedAt: string;
}


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
  pagination: PaginationInfo;
}

export interface UsersResponse {
  message: string;
  users: User[];
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
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


export interface PrivateRouteProps {
  allowedRoles?: string[];
}


// TYPES related to the redux //
export interface AuthState {
  id: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
}

export interface SocketState {
  connected: boolean;
}

