import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (replyId: string) => {
      try {
        const response = await axiosInstance.delete(`/api/replies/${replyId}`, {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Your reply has been deleted");

      await queryClient.invalidateQueries({ queryKey: ["replies"] });
      await queryClient.invalidateQueries({ queryKey: ["forYouFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["followingsFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["replies"] });
      await queryClient.invalidateQueries({ queryKey: ["userReplies"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
