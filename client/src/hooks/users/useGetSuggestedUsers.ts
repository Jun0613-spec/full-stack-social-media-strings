import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { SuggestedUsersResponse } from "@/types";

export const useGetSuggestedUsers = () => {
  return useInfiniteQuery<SuggestedUsersResponse>({
    queryKey: ["suggestedUsers"],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      try {
        const response = await axiosInstance.get("/api/users/suggested", {
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
