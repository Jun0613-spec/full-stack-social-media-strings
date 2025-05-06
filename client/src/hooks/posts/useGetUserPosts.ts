import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { UserPostsResponse } from "@/types";

export const useGetUserPosts = (username: string) => {
  return useInfiniteQuery<UserPostsResponse>({
    queryKey: ["userPosts"],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      try {
        const response = await axiosInstance.get(
          `/api/posts/profile/${username}`,
          {
            params: { cursor: pageParam }
          }
        );

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });
};
