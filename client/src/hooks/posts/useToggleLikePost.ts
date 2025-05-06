import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useToggleLikePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      try {
        const response = await axiosInstance.post(
          `/api/likes/post/${postId}`,
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
      await queryClient.invalidateQueries({ queryKey: ["followingsFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["forYouFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["replies"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      await queryClient.invalidateQueries({ queryKey: ["userReplies"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
