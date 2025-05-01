import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axiosInstance.post("/api/posts", formData, {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Your post has been created");

      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["forYouFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["followingsFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
