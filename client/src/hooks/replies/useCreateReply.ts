import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useCreateReply = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      try {
        const response = await axiosInstance.post(
          `/api/replies/${postId}`,
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
      toast.success("Your reply has been created");

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
