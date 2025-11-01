import React from 'react';
import {
  Edit2
} from 'lucide-react';
import type { Task } from '../types/type';

const TaskDetails: React.FC<{
  task: Task;
  onBack: () => void;
  onEdit: (task: Task) => void;
}> = ({ task, onBack, onEdit }) => {
  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800',
    'In-Progress': 'bg-blue-100 text-blue-800',
    'Done': 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Board
        </button>
        <button
          onClick={() => onEdit(task)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Edit2 size={18} />
          Edit Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">{task.title}</h1>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-600">{task.description || 'No description provided'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Project</h3>
              <p className="font-medium text-gray-900">
                {typeof task.projectId === 'string' ? task.projectId : task.projectId.name}
              </p>
            </div>

            {task.assignedTo && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Assigned To</h3>
                <p className="font-medium text-gray-900">{task.assignedTo.name}</p>
                <p className="text-sm text-gray-600">{task.assignedTo.email}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Created By</h3>
              <p className="font-medium text-gray-900">{task.createdBy.name}</p>
              <p className="text-sm text-gray-600">{task.createdBy.email}</p>
            </div>

            {task.dueDate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h3>
                <p className="font-medium text-gray-900">
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(task.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;