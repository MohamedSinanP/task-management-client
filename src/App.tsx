import { Route, Routes, Navigate } from 'react-router-dom'
import AuthPages from './pages/authentication/AuthPage'
import ProjectManagementPage from './pages/admin/ProjectManagementPage'
import PrivateRoute from './components/PrivateRoute'
import AdminTaskManagementPage from './pages/admin/AdminTaskManagementPage'
import UserTaskManagementPage from './pages/users/UserTaskManagementPage'
import ActivityLogs from './pages/admin/ActiveLogs'

const App = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Auth page */}
      <Route path="/auth" element={<AuthPages />} />

      {/* Admin routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/projects" element={<ProjectManagementPage />} />
        <Route path="/admin/tasks" element={<AdminTaskManagementPage />} />
        <Route path="/admin/active-logs" element={<ActivityLogs />} />
      </Route>

      {/* User routes */}
      <Route element={<PrivateRoute allowedRoles={["user"]} />}>
        <Route path="/tasks" element={<UserTaskManagementPage />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  )
}

export default App
