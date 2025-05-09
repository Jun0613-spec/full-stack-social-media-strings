import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { RepliesResponse } from "@/types";

export const useGetRepliesByPostId = (postId: string) => {
  return useInfiniteQuery<RepliesResponse>({
    queryKey: ["replies", postId],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      try {
        const response = await axiosInstance.get(`/api/replies/${postId}`, {
          withCredentials: true,
          params: { cursor: pageParam }
        });

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
