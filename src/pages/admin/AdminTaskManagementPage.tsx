import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import TaskDetails from "../../components/TaskDetails";
import KanbanColumn from "../../components/KanbanColumn";
import TaskModal from "../../components/TaskModal";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  updateTaskStatus,
} from "../../apis/task";
import { getAllProjects, getAllUsers } from "../../apis/admin";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/toastConfirmation";
import { useTaskSocket } from "../../hooks/useTaskSocket";

// ========== TYPES ==========
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "Todo" | "In-Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  projectId: Project | string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

interface TaskFormData {
  title: string;
  description: string;
  status: "Todo" | "In-Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  projectId: string;
  assignedTo: string;
}

// ========== MAIN COMPONENT ==========
export default function AdminTaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Task["status"] | null>(
    null
  );

  const taskIds = tasks.map(t => t._id);
  useTaskSocket(
    taskIds,
    (newTask) => {
      setTasks(prev => [...prev, newTask]);
      toast.success(`New task created`);
    },
    (updatedTask) => {
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    },
    (taskId) => {
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success("Task deleted");
    }
  );
  // ======= Fetch Data =======
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [tasksRes, usersRes, projectsRes] = await Promise.all([
          getAllTasks(),
          getAllUsers(),
          getAllProjects(),
        ]);
        setTasks(tasksRes.tasks);
        setUsers(usersRes.users);
        setProjects(projectsRes.projects);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ======= Create / Update =======
  const handleCreateOrUpdate = async (data: TaskFormData) => {
    try {
      setLoading(true);
      if (selectedTask) {
        const res = await updateTask(selectedTask._id, data);
        setTasks((prev) =>
          prev.map((t) => (t._id === selectedTask._id ? res.task : t))
        );
        toast.success("Task updated successfully");
      } else {
        const res = await createTask(data);
        setTasks((prev) => [...prev, res.task]);
        toast.success("Task created successfully");
      }
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  // ======= Delete =======
  const handleDelete = async (id: string) => {
    confirmToast("Are you sure you want to delete this task?", async () => {
      try {
        setLoading(true);
        await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success("Task deleted successfully");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete task");
      } finally {
        setLoading(false);
      }
    });
  };

  // ======= Drag & Drop =======
  const handleDragStart = (taskId: string) => setDraggedTaskId(taskId);
  const handleDragOver = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    setDragOverColumn(status);
  };
  const handleDragLeave = () => setDragOverColumn(null);
  const handleDrop = async (newStatus: Task["status"]) => {
    if (!draggedTaskId) return;
    try {
      const res = await updateTaskStatus(draggedTaskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t._id === draggedTaskId ? res.task : t))
      );
      toast.success(`Task moved to ${newStatus}`);
    } catch {
      toast.error("Failed to update task status");
    } finally {
      setDraggedTaskId(null);
      setDragOverColumn(null);
    }
  };

  // ======= Filters =======
  const todoTasks = tasks.filter((t) => t.status === "Todo");
  const inProgressTasks = tasks.filter((t) => t.status === "In-Progress");
  const doneTasks = tasks.filter((t) => t.status === "Done");

  // ======= Loading State =======
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // ======= Main Layout =======
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header (like Project Page) */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
          </div>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ height: "calc(100vh - 73px)" }}
        >
          {viewingTask ? (
            <TaskDetails
              task={viewingTask}
              onBack={() => setViewingTask(null)}
              onEdit={(task) => {
                setSelectedTask(task);
                setIsModalOpen(true);
                setViewingTask(null);
              }}
            />
          ) : (
            <div className="space-y-6">
              {/* Header Row */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Task Board
                </h2>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Plus size={20} />
                  New Task
                </button>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn
                  title="Todo"
                  status="Todo"
                  tasks={todoTasks}
                  onEdit={(task) => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onView={setViewingTask}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  isDraggingOver={dragOverColumn === "Todo"}
                  onDragOver={(e) => handleDragOver(e, "Todo")}
                  onDragLeave={handleDragLeave}
                />
                <KanbanColumn
                  title="In Progress"
                  status="In-Progress"
                  tasks={inProgressTasks}
                  onEdit={(task) => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onView={setViewingTask}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  isDraggingOver={dragOverColumn === "In-Progress"}
                  onDragOver={(e) => handleDragOver(e, "In-Progress")}
                  onDragLeave={handleDragLeave}
                />
                <KanbanColumn
                  title="Done"
                  status="Done"
                  tasks={doneTasks}
                  onEdit={(task) => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onView={setViewingTask}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  isDraggingOver={dragOverColumn === "Done"}
                  onDragOver={(e) => handleDragOver(e, "Done")}
                  onDragLeave={handleDragLeave}
                />
              </div>

              {/* No Tasks */}
              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No tasks yet. Create your first task!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmit={handleCreateOrUpdate}
        users={users}
        projects={projects}
      />
    </div>
  );
}
