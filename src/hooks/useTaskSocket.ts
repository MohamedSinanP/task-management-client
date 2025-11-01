import { useEffect } from "react";
import { getSocket } from "../redux/middleware/socketMiddleware";

export const useTaskSocket = (
  taskIds: string[],
  onTaskAssigned: (task: any) => void,
  onTaskUpdated: (task: any) => void,
  onTaskDeleted: (taskId: any) => void
) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    taskIds.forEach((id) => socket.emit("joinTask", id));

    socket.on("taskAssigned", (task) => {
      socket.emit("joinTask", task._id);
      onTaskAssigned(task);
    });
    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskDeleted", onTaskDeleted);

    return () => {
      taskIds.forEach((id) => socket.emit("leaveTask", id));
      socket.off("taskAssigned");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [taskIds, onTaskAssigned, onTaskUpdated, onTaskDeleted]);
};
