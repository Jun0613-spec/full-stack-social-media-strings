import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { Post } from "@/types/prismaTypes";

export const useGetPost = () => {
  return useQuery<Post>({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/posts", {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1
  });
};
