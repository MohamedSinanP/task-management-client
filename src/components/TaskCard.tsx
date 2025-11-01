import React from 'react';
import {
  Edit2, Trash2, User, Calendar
} from 'lucide-react';
import type { Task } from '../types/type';


const TaskCard: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
  onDelete?: (id: string) => void;
  onView: (task: Task) => void;
  onDragStart: (taskId: string) => void;
}> = ({ task, onEdit, onDelete, onView, onDragStart }) => {
  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task._id)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 border border-gray-200 cursor-move hover:scale-105 active:scale-95"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{task.title}</h3>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
          >
            <Edit2 size={16} />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={14} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onView(task)}
        className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition text-sm"
      >
        View Details
      </button>
    </div>
  );
};

export default TaskCard