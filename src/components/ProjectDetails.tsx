import React from 'react';
import { Edit2 } from 'lucide-react';
import type { Project } from '../types/type';

const ProjectDetails: React.FC<{
  project: Project;
  onBack: () => void;
  onEdit: (project: Project) => void;
}> = ({ project, onBack, onEdit }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Projects
        </button>
        <button
          onClick={() => onEdit(project)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Edit2 size={18} />
          Edit Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{project.name}</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-600">
              {project.description || 'No description provided'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Project Creator</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{project.createdBy.name}</p>
              <p className="text-sm text-gray-600">{project.createdBy.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Team Members ({project.members.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.members.map(member => (
                <div key={member._id} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium text-gray-900">{formatDate(project.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900">{formatDate(project.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;