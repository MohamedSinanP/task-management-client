import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Project, ProjectFormData, User } from '../types/type';

const ProjectAddOrEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSubmit: (data: ProjectFormData) => void;
  users: User[];
}> = ({ isOpen, onClose, project, onSubmit, users }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
      members: []
    }
  });

  const selectedMembers = watch('members') || [];

  useEffect(() => {
    if (project) {
      setValue('name', project.name);
      setValue('description', project.description || '');
      setValue('members', project.members.map(m => m._id));
    } else {
      reset();
    }
  }, [project, setValue, reset]);

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit(data);
    reset();
  };

  const toggleMember = (userId: string) => {
    const current = selectedMembers;
    if (current.includes(userId)) {
      setValue('members', current.filter(id => id !== userId));
    } else {
      setValue('members', [...current, userId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Project name is required',
                minLength: {
                  value: 3,
                  message: 'Project name must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Project name must not exceed 100 characters'
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must not exceed 500 characters'
                }
              })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Enter project description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Members Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members *
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
              {users.map(user => (
                <label
                  key={user._id}
                  className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    value={user._id}
                    {...register("members", {
                      validate: (value) =>
                        (value && value.length > 0) || "At least one member must be selected",
                    })}
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => toggleMember(user._id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Error Message */}
            {errors.members && (
              <p className="mt-1 text-sm text-red-600">{errors.members.message}</p>
            )}

            <p className="mt-2 text-sm text-gray-500">
              {selectedMembers.length} member(s) selected
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit(handleFormSubmit)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              {project ? 'Update Project' : 'Create Project'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAddOrEditModal;