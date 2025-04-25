import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { io, Socket } from "socket.io-client";

import { Conversation, Message, Notification } from "@/types";
import { useAuth } from "./auth-provider";

interface SocketContextType {
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

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
  connect: () => {},
  disconnect: () => {},
  sendNotification: () => {},
  markNotificationAsRead: () => {},
  sendMessage: () => {},
  sendConversation: () => {},
  markMessagesAsSeen: () => {}
});

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { currentUser, isLoggedIn } = useAuth();

  const connect = useCallback(() => {
    if (socket && !isConnected) {
      socket.connect();
      return;
    }

    if (!currentUser || !isLoggedIn) return;

    const userId = currentUser.id;

    if (!userId) {
      console.error("Cannot connect socket: User ID is missing");
      return;
    }

    const socketInstance = io(import.meta.env.VITE_API_BASE_URL!, {
      query: { userId },
      withCredentials: true
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    socketInstance.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    socketInstance.on("notificationMarkedAsRead", (updatedNotification) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === updatedNotification.id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    });

    socketInstance.on("error", (errorMessage: string) => {
      console.error("Socket error:", errorMessage);
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

    setSocket(socketInstance);
  }, [currentUser, isLoggedIn, isConnected, socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setIsConnected(false);
    }
  }, [socket]);

  // Connect when user is logged in
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isLoggedIn, currentUser, connect, disconnect]);

  // The rest of your code remains the same
  const sendNotification = (
    notification: Omit<Notification, "id" | "createdAt">
  ) => {
    if (socket && isConnected) {
      socket.emit("sendNotification", notification);
    } else {
      console.warn("Cannot send notification: Socket not connected");
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    if (socket && isConnected) {
      socket.emit("markNotificationAsRead", notificationId);
    } else {
      console.warn("Cannot mark notification as read: Socket not connected");
    }
  };

  const sendMessage = (message: Message) => {
    if (socket && isConnected) {
      socket.emit("sendMessage", message);
    } else {
      console.warn("Cannot send message: Socket not connected");
    }
  };

  const sendConversation = (conversation: Conversation) => {
    if (socket && isConnected) {
      socket.emit("sendConversation", conversation);
    } else {
      console.warn("Cannot send conversation: Socket not connected");
    }
  };

  const markMessagesAsSeen = (conversationId: string) => {
    if (socket && isConnected) {
      socket.emit("markMessagesAsSeen", conversationId);
    } else {
      console.warn("Cannot mark messages as seen: Socket not connected");
    }
  };

  const value = {
    socket,
    isConnected,
    notifications,
    connect,
    disconnect,
    sendNotification,
    markNotificationAsRead,
    sendMessage,
    sendConversation,
    markMessagesAsSeen
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
