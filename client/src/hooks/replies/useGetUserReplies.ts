import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { UserRepliesResponse } from "@/types";

export const useGetUserReplies = (username: string) => {
  return useInfiniteQuery<UserRepliesResponse>({
    queryKey: ["userReplies"],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      try {
        const response = await axiosInstance.get(
          `/api/replies/profile/${username}`,
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
