import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TaskDetails from "../../components/TaskDetails";
import KanbanColumn from "../../components/KanbanColumn";
import TaskModal from "../../components/TaskModal";
import UserSidebar from "../../components/UserSidebar";
import {
  getAllTasks,
  updateTask,
  updateTaskStatus,
} from "../../apis/task";
import { getAllProjects, getAllUsers } from "../../apis/admin";
import { useTaskSocket } from "../../hooks/useTaskSocket";

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

export default function UserTaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Task["status"] | null>(null);


  const taskIds = tasks.map(t => t._id);
  // Listen to socket events
  useTaskSocket(
    taskIds,
    (newTask) => {
      setTasks(prev => [...prev, newTask]);
      toast.success(`New task: ${newTask.title}`);
    },
    (updatedTask) => {
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    },
    (taskId) => {
      console.log("this is the data", taskId);

      setTasks(prev => prev.filter(t => t._id !== taskId._id));
      toast.success("Task deleted by admin");
    }
  );

  /* ---------- FETCH ---------- */
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
      } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- UPDATE ---------- */
  const handleUpdate = async (data: TaskFormData) => {
    if (!selectedTask) return;
    try {
      setLoading(true);
      const res = await updateTask(selectedTask._id, data);
      setTasks((prev) =>
        prev.map((t) => (t._id === selectedTask._id ? res.task : t))
      );
      toast.success("Task updated");
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DRAG & DROP ---------- */
  const handleDragStart = (id: string) => setDraggedTaskId(id);
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
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error("Failed to move task");
    } finally {
      setDraggedTaskId(null);
      setDragOverColumn(null);
    }
  };

  /* ---------- FILTERS ---------- */
  const todo = tasks.filter((t) => t.status === "Todo");
  const inProgress = tasks.filter((t) => t.status === "In-Progress");
  const done = tasks.filter((t) => t.status === "Done");

  /* ---------- RENDER ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />

      <div className="flex-1 md:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ height: "calc(100vh - 73px)" }}>
          {viewingTask ? (
            <TaskDetails
              task={viewingTask}
              onBack={() => setViewingTask(null)}
              onEdit={(t) => {
                setSelectedTask(t);
                setIsModalOpen(true);
                setViewingTask(null);
              }}
            />
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn
                  title="Todo"
                  status="Todo"
                  tasks={todo}
                  onEdit={(t) => {
                    setSelectedTask(t);
                    setIsModalOpen(true);
                  }}
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
                  tasks={inProgress}
                  onEdit={(t) => {
                    setSelectedTask(t);
                    setIsModalOpen(true);
                  }}
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
                  tasks={done}
                  onEdit={(t) => {
                    setSelectedTask(t);
                    setIsModalOpen(true);
                  }}
                  onView={setViewingTask}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  isDraggingOver={dragOverColumn === "Done"}
                  onDragOver={(e) => handleDragOver(e, "Done")}
                  onDragLeave={handleDragLeave}
                />
              </div>

              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No tasks assigned to you yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmit={handleUpdate}
        users={users}
        projects={projects}
      />
    </div>
  );
}