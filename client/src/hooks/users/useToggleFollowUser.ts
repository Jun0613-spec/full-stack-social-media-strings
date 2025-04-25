import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useToggleFollowUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (followingId: string) => {
      try {
        const response = await axiosInstance.post(
          `/api/users/follow/${followingId}`,
          {},
          { withCredentials: true }
        );

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["followings"] });
      await queryClient.invalidateQueries({ queryKey: ["followers"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
