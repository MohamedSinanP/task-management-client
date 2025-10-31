// src/hooks/useTaskSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { store } from "../redux/store";
export const useTaskSocket = (
  taskIds: string[],
  onTaskAssigned: (task: any) => void,
  onTaskUpdated: (task: any) => void,
  onTaskDeleted: (taskId: any) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    const state = store.getState();
    const userId = state.auth?.id;

    if (userId) socket.emit("joinUser", userId);

    // Join each task room
    taskIds.forEach((id) => socket.emit("joinTask", id));

    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    socket.on("taskAssigned", (task) => {
      socket.emit("joinTask", task._id);
      onTaskAssigned(task)
    });
    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskDeleted", onTaskDeleted);

    return () => {
      taskIds.forEach((id) => socket.emit("leaveTask", id));
      socket.off("taskAssigned");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.disconnect();
    };
  }, [taskIds, onTaskAssigned, onTaskUpdated, onTaskDeleted]);
};
