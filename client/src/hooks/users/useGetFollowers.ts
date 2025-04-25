import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { FollowersResponse } from "@/types";

export const useGetFollowers = () => {
  return useInfiniteQuery<FollowersResponse>({
    queryKey: ["followers"],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      try {
        const response = await axiosInstance.get("/api/users/followers", {
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
