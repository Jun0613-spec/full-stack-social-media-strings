import { useEffect } from "react";

import { useAuthStore } from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";

export const useSocket = () => {
  const { currentUser } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (currentUser?.id) {
      connect(currentUser.id);
    }

    return () => {
      disconnect();
    };
  }, [currentUser?.id, connect, disconnect]);

  return null;
};
