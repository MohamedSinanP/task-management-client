import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectAddOrEditModal from '../../components/ProjectAddOrEditModal';
import ProjectCard from '../../components/ProjectCard';
import ProjectDetails from '../../components/ProjectDetails';
import AdminSidebar from '../../components/AdminSidebar';
import {
  getAllUsers,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../apis/admin';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastConfirmation';
import type { ProjectFormData, Project, User } from '../../types/type';

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Users & Projects
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [usersRes, projectsRes] = await Promise.all([
          getAllUsers(),
          getAllProjects(),
        ]);
        setUsers(usersRes.users || []);
        setProjects(projectsRes.projects || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Create / Update Project
  const handleCreateOrUpdate = async (data: ProjectFormData) => {
    try {
      setLoading(true);

      if (selectedProject) {
        // Update existing project
        const res = await updateProject(selectedProject._id, data);
        setProjects(prev =>
          prev.map(p => (p._id === selectedProject._id ? res.project : p))
        );
        toast.success('Project updated successfully');
      } else {
        // Create new project
        const res = await createProject(data);
        setProjects(prev => [...prev, res.project]);
        toast.success('Project created successfully');
      }

      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  // Delete Project
  const handleDelete = async (id: string) => {
    confirmToast('Are you sure you want to delete this project?', async () => {
      try {
        setLoading(true);
        await deleteProject(id);
        setProjects(prev => prev.filter(p => p._id !== id));
        toast.success('Project deleted successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete project');
      } finally {
        setLoading(false);
      }
    });
  };

  // Handlers
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setViewingProject(null);
  };

  const handleView = (project: Project) => {
    setViewingProject(project);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading...</div>
          ) : viewingProject ? (
            <ProjectDetails
              project={viewingProject}
              onBack={() => setViewingProject(null)}
              onEdit={handleEdit}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Plus size={20} />
                  New Project
                </button>
              </div>

              {/* Project Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>

              {/* No Projects */}
              {projects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No projects yet. Create your first project!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectAddOrEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSubmit={handleCreateOrUpdate}
        users={users}
      />
    </div>
  );
}
