import React, { useState, useEffect } from 'react';
import {
  Activity,
  User,
  Calendar,
  FileText,
  ArrowRight,
} from 'lucide-react';
import {
  getAllLogs
} from '../../apis/admin';

import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import type { ActivityLog, ActivityLogResponse, PaginationInfo } from '../../types/type';

const ActivityLogs: React.FC = () => {
  /* ---------- Page State ---------- */
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  /* ---------- Fetch Logs ---------- */
  const fetchLogs = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const data: ActivityLogResponse = await getAllLogs(page, limit);
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(pagination.currentPage, pagination.itemsPerPage);
  }, []);

  /* ---------- Pagination Handlers ---------- */
  const handlePageChange = (page: number) => {
    fetchLogs(page, pagination.itemsPerPage);
  };

  const handleItemsPerPageChange = (items: number) => {
    fetchLogs(1, items);
  };

  /* ---------- Helpers ---------- */
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldIcon = (field: string): string => {
    const icons: Record<string, string> = {
      status: '🔁',
      priority: '⚡',
      title: '📝',
      description: '📄',
      dueDate: '📅',
      assignedTo: '👤',
    };
    return icons[field] || '•';
  };

  const getFieldColor = (field: string): string => {
    const colors: Record<string, string> = {
      status: 'text-blue-600',
      priority: 'text-orange-600',
      title: 'text-purple-600',
      description: 'text-gray-600',
      dueDate: 'text-green-600',
      assignedTo: 'text-indigo-600',
    };
    return colors[field] || 'text-gray-600';
  };

  const uniqueTasks = new Set(logs.map((l) => l.taskId?._id)).size;
  const uniqueUsers = new Set(logs.map((l) => l.updatedBy?._id)).size;
  const uniqueProjects = new Set(logs.map((l) => l.taskId?.projectId?._id)).size;

  /* ---------- Render ---------- */
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col">
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Activity Logs
                </h1>
              </div>
              <p className="text-gray-600">
                Track all task changes and updates across projects
              </p>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {pagination.totalItems}
                  </p>
                  <p className="text-sm text-gray-600">Total Logs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{uniqueTasks}</p>
                  <p className="text-sm text-gray-600">Tasks Modified</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{uniqueUsers}</p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{uniqueProjects}</p>
                  <p className="text-sm text-gray-600">Projects</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading activity logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No activity logs found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Activity will appear here when tasks are updated
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {log.updatedBy?.name || 'Unknown User'}
                            {log.updatedBy?.role && (
                              <span className="ml-2 text-xs font-normal text-white bg-blue-600 px-2 py-1 rounded">
                                {log.updatedBy.role}
                              </span>
                            )}
                          </p>
                          {log.updatedBy?.email && (
                            <p className="text-sm text-gray-500">
                              {log.updatedBy.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(log.updatedAt)}
                      </div>
                    </div>

                    {/* Task Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {log.taskId?.title || 'Deleted Task'}
                        </span>
                      </div>
                      {log.taskId?.projectId && (
                        <p className="text-sm text-gray-600 ml-7">
                          Project:{' '}
                          <span className="font-medium">
                            {log.taskId.projectId.name}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Changes */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Changes Made:
                      </p>
                      {log.changes.map((change, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-2xl">
                            {getFieldIcon(change.field)}
                          </span>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${getFieldColor(
                                change.field
                              )}`}
                            >
                              {change.field.charAt(0).toUpperCase() +
                                change.field.slice(1)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                                {change.oldValue || 'None'}
                              </span>
                              <span className="text-gray-400">
                                <ArrowRight />
                              </span>
                              <span className="text-sm text-gray-900 bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium">
                                {change.newValue}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage={true}
            itemsPerPageOptions={[10, 25, 50, 100]}
          />
        )}
      </main>
    </div>
  );
};

export default ActivityLogs;