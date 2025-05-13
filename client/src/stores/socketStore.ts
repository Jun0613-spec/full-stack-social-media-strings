import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  hasNewNotification: boolean;
  connect: (userId: string) => void;
  disconnect: () => void;
  markNotificationsSeen: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  hasNewNotification: false,

  connect: (userId: string) => {
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket = io(import.meta.env.VITE_API_BASE_URL!, {
      query: { userId },
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("new_notification", () => {
      console.log("New notification received");
      set({ hasNewNotification: true });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  markNotificationsSeen: () => {
    set({ hasNewNotification: false });
  }
}));
