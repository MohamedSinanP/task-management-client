import { type Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { addAuth, removeAuth } from "../slices/authSlice";
import { setConnected } from "../slices/socketSlice";

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  const state = store.getState();
  const userId = state.auth?.id;

  // Connect when user logs in
  if (addAuth.match(action)) {
    initSocket(store, userId);
  }

  // Connect again when Redux rehydrates (page reload)
  if (action.type === "persist/REHYDRATE" && userId) {
    initSocket(store, userId);
  }

  // Disconnect when logging out
  if (removeAuth.match(action)) {
    if (socket) {
      console.log("Socket manually disconnected");
      socket.disconnect();
      socket = null;
      store.dispatch(setConnected(false));
    }
  }

  return result;
};

function initSocket(store: any, userId?: string) {
  if (!userId || socket) return;

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:3001", {
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
    socket?.emit("joinUser", userId);
    store.dispatch(setConnected(true));
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    store.dispatch(setConnected(false));
  });
}

export const getSocket = (): Socket | null => socket;
