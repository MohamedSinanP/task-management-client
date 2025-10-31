import { Route, Routes } from 'react-router-dom'
import AuthPages from './pages/authentication/AuthPage'
import ProjectManagementPage from './pages/admin/ProjectManagementPage'
import PrivateRoute from './components/PrivateRoute'
import AdminTaskManagementPage from './pages/admin/AdminTaskManagementPage'
import UserTaskManagementPage from './pages/users/UserTaskManagementPage'
import ActivityLogs from './pages/admin/ActiveLogs'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/auth' element={<AuthPages />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
        { /* Routes related to the admin */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path='/admin/projects' element={<ProjectManagementPage />} />
          <Route path='/admin/tasks' element={<AdminTaskManagementPage />} />
          <Route path='/admin/active-logs' element={<ActivityLogs />} />
        </Route>
        { /* Routes related to the user */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path='/tasks' element={<UserTaskManagementPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
