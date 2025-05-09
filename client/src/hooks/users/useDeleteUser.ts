import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { axiosInstance, handleAxiosError } from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.delete("/api/users", {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("User account has been deleted");
      logout();
      navigate("/login");

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
