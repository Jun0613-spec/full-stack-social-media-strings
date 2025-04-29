import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      try {
        const response = await axiosInstance.delete(`/api/posts/${postId}`, {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Your post has been deleted");

      await queryClient.invalidateQueries({ queryKey: ["posts"] });

      queryClient.invalidateQueries({ queryKey: ["forYouFeed"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
