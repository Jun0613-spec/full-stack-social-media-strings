import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { Post } from "@/types/prismaTypes";

export const useGetPostByPostId = (postId: string) => {
  return useQuery<Post>({
    queryKey: ["posts", postId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/api/posts/${postId}`, {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });
};
