import { useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { SearchUsersResponse } from "@/types";

export const useSearchUsers = (query: string) => {
  return useInfiniteQuery<SearchUsersResponse>({
    queryKey: ["searchUsers", query],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      if (!query.trim()) return { users: [], nextCursor: null };

      try {
        const response = await axiosInstance.get("/api/search/users", {
          params: { query, cursor: pageParam },
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1
  });
};
