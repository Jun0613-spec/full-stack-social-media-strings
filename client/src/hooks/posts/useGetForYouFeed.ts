import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { ForYouFeedResponse } from "@/types";

export const useGetForYouFeed = () => {
  return useInfiniteQuery<ForYouFeedResponse>({
    queryKey: ["forYouFeed"],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      try {
        const response = await axiosInstance.get("/api/posts/for-you", {
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
