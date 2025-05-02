import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { FollowingsResponse } from "@/types";

export const useGetFollowingUsers = () => {
  return useQuery<FollowingsResponse>({
    queryKey: ["followings"],

    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/users/followings", {
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
