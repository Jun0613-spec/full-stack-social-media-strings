import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useEditUser = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axiosInstance.put("/api/users", formData, {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      toast.success("User profile has been updated");

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["followings"] });
      await queryClient.invalidateQueries({ queryKey: ["followers"] });
      await queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });

      if (data?.user?.username) {
        navigate(`/profile/${data.user.username}`, { replace: true });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
