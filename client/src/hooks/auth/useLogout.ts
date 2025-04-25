import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "@/lib/axios";

import { useAuthStore } from "@/stores/authStore";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true
        }
      );

      return response.data;
    },
    onSuccess: async () => {
      logout();

      await queryClient.cancelQueries();
      await queryClient.removeQueries({ queryKey: ["currentUser"] });
      await queryClient.clear();

      navigate("/login");
    }
  });

  return mutation;
};
