import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useToggleLikeReply = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (replyId: string) => {
      try {
        const response = await axiosInstance.post(
          `/api/likes/reply/${replyId}`,
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
