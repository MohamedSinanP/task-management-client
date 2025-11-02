import React, { useEffect, useState } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { getSocket } from "../redux/middleware/socketMiddleware";

import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../apis/notification";
import type { NotificationItem, NotificationResponse } from "../types/type";

const Notifications: React.FC = () => {
  const [list, setList] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /* ---------- SOCKET ---------- */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const uid = localStorage.getItem("userId");
    if (uid) socket.emit("joinUser", uid);

    socket.on("newNotification", (n: NotificationItem) => {
      setList((p) => [n, ...p]);
      setUnread((p) => p + 1);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res: NotificationResponse = await getUserNotifications();
      setList(res.notifications);
      setUnread(res.unreadCount);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ACTIONS ---------- */
  const readOne = async (id: string) => {
    try {
      await markAsRead(id);
      setList((p) => p.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnread((p) => Math.max(0, p - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const readAll = async () => {
    try {
      await markAllAsRead();
      setList((p) => p.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteNotification(id);
      setList((p) => p.filter((n) => n._id !== id));
      const n = list.find((n) => n._id === id);
      if (n && !n.isRead) setUnread((p) => Math.max(0, p - 1));
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------- UTILS ---------- */
  const format = (d: string) => {
    const now = Date.now();
    const then = new Date(d).getTime();
    const diff = Math.floor((now - then) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(d).toLocaleDateString();
  };

  const color = (t: string) => {
    switch (t) {
      case "task_assigned":
        return "bg-blue-100 text-blue-800";
      case "task_updated":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unread > 0 && (
          <span className="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 flex items-start justify-end p-4 z-50 pointer-events-none"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-96 bg-white rounded-lg shadow-xl border border-gray-200 pointer-events-auto mt-16 mr-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-500">{unread} unread</p>
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={readAll}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>Loading…</p>
                  </div>
                ) : list.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  list.map((n) => (
                    <div
                      key={n._id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!n.isRead ? "bg-blue-50" : ""
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${color(
                                n.type
                              )}`}
                            >
                              {n.type.replace("_", " ").toUpperCase()}
                            </span>
                            {!n.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-900 mb-1">
                            {n.message}
                          </p>
                          {n.taskId && (
                            <p className="text-xs text-gray-500">
                              Task: {n.taskId.title}
                            </p>
                          )}
                          {n.projectId && (
                            <p className="text-xs text-gray-500">
                              Project: {n.projectId.name}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {format(n.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!n.isRead && (
                            <button
                              onClick={() => readOne(n._id)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => remove(n._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Notifications;
