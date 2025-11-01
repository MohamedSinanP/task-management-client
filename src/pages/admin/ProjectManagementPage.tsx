import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectAddOrEditModal from '../../components/ProjectAddOrEditModal';
import ProjectCard from '../../components/ProjectCard';
import ProjectDetails from '../../components/ProjectDetails';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import {
  getAllUsers,
  getPaginatedProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../apis/admin';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastConfirmation';
import type {
  ProjectFormData,
  Project,
  User,
  PaginationInfo
} from '../../types/type';

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
  });

  // Fetch Users (once)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await getAllUsers();
        setUsers(usersRes.users || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  // Fetch Projects with Pagination
  const fetchProjects = async (page: number = 1, limit: number = 9) => {
    try {
      setLoading(true);
      const projectsRes = await getPaginatedProjects(page, limit);
      setProjects(projectsRes.projects || []);
      setPagination(projectsRes.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(pagination.currentPage, pagination.itemsPerPage);
  }, []);

  // Pagination Handlers
  const handlePageChange = (page: number) => {
    fetchProjects(page, pagination.itemsPerPage);
  };

  const handleItemsPerPageChange = (items: number) => {
    fetchProjects(1, items);
  };

  // Create / Update Project
  const handleCreateOrUpdate = async (data: ProjectFormData) => {
    try {
      setLoading(true);

      if (selectedProject) {
        await updateProject(selectedProject._id, data);
        await fetchProjects(pagination.currentPage, pagination.itemsPerPage);
        toast.success('Project updated successfully');
      } else {
        await createProject(data);
        await fetchProjects(1, pagination.itemsPerPage);
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

        // If current page becomes empty after deletion, go to previous page
        const remainingItems = pagination.totalItems - 1;
        const maxPage = Math.ceil(remainingItems / pagination.itemsPerPage);
        const targetPage = pagination.currentPage > maxPage ? maxPage : pagination.currentPage;

        await fetchProjects(Math.max(1, targetPage), pagination.itemsPerPage);
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
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
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
              {projects.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No projects yet. Create your first project!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !viewingProject && projects.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage={true}
            itemsPerPageOptions={[9, 18, 27, 36]}
          />
        )}
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