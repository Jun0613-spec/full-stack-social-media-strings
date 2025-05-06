import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useEditReply = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      replyId,
      text
    }: {
      replyId: string;
      text: string;
    }) => {
      try {
        const response = await axiosInstance.put(
          `/api/replies/${replyId}`,
          { text },
          { withCredentials: true }
        );
        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Your reply has been edited");

      await queryClient.invalidateQueries({ queryKey: ["replies"] });
      await queryClient.invalidateQueries({ queryKey: ["forYouFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["followingsFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["replies"] });
      await queryClient.invalidateQueries({ queryKey: ["userReplies"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
      toast.error((error as Error).message);
    }
  });

  return mutation;
};
