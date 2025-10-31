import React from 'react';
import { Edit2, Trash2, Users, Calendar, User } from 'lucide-react';
import type { Project } from '../types/type';


const ProjectCard: React.FC<{
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView: (project: Project) => void;
}> = ({ project, onEdit, onDelete, onView }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {project.description || 'No description provided'}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User size={16} className="mr-2 text-blue-600" />
          <span>Created by: {project.createdBy.name}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-2 text-blue-600" />
          <span>{project.members.length} member(s)</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-blue-600" />
          <span>Updated: {formatDate(project.updatedAt)}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onView(project)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
        >
          View Details
        </button>
        <button
          onClick={() => onEdit(project)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;