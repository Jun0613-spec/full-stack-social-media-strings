import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { FollowersResponse } from "@/types";

export const useGetFollowers = () => {
  return useQuery<FollowersResponse>({
    queryKey: ["followers"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/users/followers", {
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
