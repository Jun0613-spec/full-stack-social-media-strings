import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { FollowingsResponse } from "@/types";

export const useGetFollowingUsers = () => {
  return useInfiniteQuery<FollowingsResponse>({
    queryKey: ["followings"],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      try {
        const response = await axiosInstance.get("/api/users/followings", {
          params: { cursor: pageParam },
          withCredentials: true
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
