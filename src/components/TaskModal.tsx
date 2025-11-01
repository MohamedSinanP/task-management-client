import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Task, TaskFormData, TaskProject, TaskUser } from '../types/type';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

const TaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSubmit: (data: TaskFormData) => void;
  users: TaskUser[];
  projects: TaskProject[];
}> = ({ isOpen, onClose, task, onSubmit, projects }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm<TaskFormData>();
  const role = useSelector((state: RootState) => state.auth?.role);
  const isUser = role === "user";

  const [availableMembers, setAvailableMembers] = useState<TaskUser[]>([]);

  // Watch selected project dynamically
  const selectedProjectId = useWatch({ control, name: "projectId" });

  // Update available members when project changes (for new tasks)
  useEffect(() => {
    if (selectedProjectId && !task) {
      const selectedProject = projects.find(p => p._id === selectedProjectId);
      setAvailableMembers(selectedProject?.members || []);
    }
  }, [selectedProjectId, projects, task]);

  // Populate form when editing a task
  useEffect(() => {
    if (task) {
      // Extract project ID
      const pid = typeof task.projectId === "string" ? task.projectId : task.projectId._id;

      // STEP 1: Set available members FIRST
      const selectedProject = projects.find(p => p._id === pid);
      const members = selectedProject?.members || [];
      setAvailableMembers(members);

      // STEP 2: Set all form values
      setValue("title", task.title);
      setValue("description", task.description || "");
      setValue("status", task.status);
      setValue("priority", task.priority);
      setValue("dueDate", task.dueDate ? task.dueDate.split("T")[0] : "");
      setValue("projectId", pid);

      // STEP 3: Set assignedTo AFTER members are set
      // Use setTimeout to ensure DOM has updated with new options
      setTimeout(() => {
        const assignedUserId = task.assignedTo?._id || "";
        setValue("assignedTo", assignedUserId);
        console.log("Setting assignedTo:", assignedUserId);
      }, 0);

    } else {
      // Reset form for new task
      reset();
      setAvailableMembers([]);
    }
  }, [task, setValue, reset, projects]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-blue-800 rounded-full p-2 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Task title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 100, message: 'Title must not exceed 100 characters' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', {
                maxLength: { value: 500, message: 'Description must not exceed 500 characters' }
              })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Enter task description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Project & Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                {...register("projectId", { required: "Project is required" })}
                disabled={isUser}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg 
                ${isUser ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500"} 
                focus:border-transparent outline-none`}
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Todo">Todo</option>
                <option value="In-Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate', {
                  validate: (value) => {
                    if (!value) return true;
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today || 'Due date cannot be before today';
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To *
            </label>
            <select
              {...register("assignedTo", {
                required: "Assigned user is required",
              })}
              disabled={isUser || !selectedProjectId}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg 
                ${isUser || !selectedProjectId
                  ? "bg-gray-100 cursor-not-allowed"
                  : "focus:ring-2 focus:ring-blue-500"
                } 
                focus:border-transparent outline-none`}
            >
              <option value="">Select Member</option>
              {availableMembers.length > 0 ? (
                availableMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} {member.email && `(${member.email})`}
                  </option>
                ))
              ) : (
                <option disabled>
                  {selectedProjectId ? "No members in this project" : "Select a project first"}
                </option>
              )}
            </select>
            {errors.assignedTo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.assignedTo.message}
              </p>
            )}
            {isUser && (
              <p className="mt-1 text-sm text-blue-600">
                You cannot change the assigned user
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;