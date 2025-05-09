import { create } from "zustand";
import { io, Socket } from "socket.io-client";

import { Notification, Message, Conversation } from "@/types/prismaTypes";

import { useAuthStore } from "@/stores/authStore";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  connect: () => void;
  disconnect: () => void;
  sendNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  markNotificationAsRead: (notificationId: string) => void;
  sendMessage: (message: Message) => void;
  sendConversation: (conversation: Conversation) => void;
  markMessagesAsSeen: (conversationId: string) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  notifications: [],

  connect: () => {
    const { currentUser, isLoggedIn } = useAuthStore.getState();

    if (!currentUser || !isLoggedIn || get().socket) return;

    const socketInstance = io(import.meta.env.VITE_API_BASE_URL!, {
      query: { userId: currentUser.id },
      withCredentials: true
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      set({ socket: socketInstance, isConnected: true });
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      set({ isConnected: false });
    });

    socketInstance.on("newNotification", (notification: Notification) => {
      set((state) => ({
        notifications: [...state.notifications, notification]
      }));
    });

    socketInstance.on("notificationMarkedAsRead", (updatedNotification) => {
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === updatedNotification.id
            ? { ...notification, isRead: true }
            : notification
        )
      }));
    });

    socketInstance.on("newMessage", (message: Message) => {
      console.log("New message received:", message);
    });

    socketInstance.on("newConversation", (conversation: Conversation) => {
      console.log("New conversation received:", conversation);
    });

    socketInstance.on("messagesSeen", ({ conversationId }) => {
      console.log("Messages seen in conversation:", conversationId);
    });

    socketInstance.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    set({ socket: socketInstance });
  },

  disconnect: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();

      set({ socket: null, isConnected: false });
    }
  },

  sendNotification: (notification) => {
    const { socket, isConnected } = get();

    if (socket && isConnected) {
      socket.emit("sendNotification", notification);
    } else {
      console.warn("Socket not connected");
    }
  },

  markNotificationAsRead: (notificationId) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit("markNotificationAsRead", notificationId);
    } else {
      console.warn("Socket not connected");
    }
  },

  sendMessage: (message) => {
    const { socket, isConnected } = get();

    if (socket && isConnected) {
      socket.emit("sendMessage", message);
    } else {
      console.warn("Socket not connected");
    }
  },

  sendConversation: (conversation) => {
    const { socket, isConnected } = get();

    if (socket && isConnected) {
      socket.emit("sendConversation", conversation);
    } else {
      console.warn("Socket not connected");
    }
  },

  markMessagesAsSeen: (conversationId) => {
    const { socket, isConnected } = get();

    if (socket && isConnected) {
      socket.emit("markMessagesAsSeen", conversationId);
    } else {
      console.warn("Socket not connected");
    }
  }
}));
