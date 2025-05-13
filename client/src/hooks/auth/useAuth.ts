import { useEffect } from "react";

import { useAuthStore } from "@/stores/authStore";

import { useGetCurrentUser } from "../users/useGetCurrentUser";

export const useAuth = () => {
  const { setUser } = useAuthStore();

  const { data, isLoading } = useGetCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      setUser(data);
    }
  }, [isLoading, data, setUser]);
};
