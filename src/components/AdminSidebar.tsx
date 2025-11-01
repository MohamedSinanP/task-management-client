import { Home, FolderOpen, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/slices/authSlice";
import { logout } from "../apis/auth";
import toast from "react-hot-toast";
import Notifications from "./Notifications";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/auth");
      setTimeout(() => dispatch(removeAuth()), 100);
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const menuItems = [
    { name: "Projects", path: "/admin/projects", icon: <FolderOpen size={20} /> },
    { name: "Tasks", path: "/admin/tasks", icon: <Home size={20} /> },
    { name: "Active Logs", path: "/admin/active-logs", icon: <FolderOpen size={20} /> },
  ];

  return (
    <>
      {/* ---------- Mobile Toggle ---------- */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 text-white bg-blue-500 rounded-lg p-2 shadow"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* ---------- Sidebar ---------- */}
      <div
        className={`
          bg-linear-to-b from-blue-700 to-blue-900 text-white w-64 fixed inset-y-0 left-0
          transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* ---- Header + Notification Bell ---- */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold mr-2">Admin Panel</h1>
          <Notifications />
        </div>

        {/* ---- Navigation ---- */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition 
                 ${isActive ? "bg-blue-800 bg-opacity-50" : "hover:bg-blue-800 hover:bg-opacity-30"}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* ---- Logout ---- */}
        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 hover:bg-opacity-30 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ---------- Mobile Overlay ---------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}