import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useEditPost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      postId,
      formData
    }: {
      postId: string;
      formData: FormData;
    }) => {
      try {
        const response = await axiosInstance.put(
          `/api/posts/${postId}`,
          formData,
          {
            withCredentials: true
          }
        );

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Your post has been edited");

      await queryClient.invalidateQueries({ queryKey: ["posts"] });

      await queryClient.invalidateQueries({ queryKey: ["forYouFeed"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
