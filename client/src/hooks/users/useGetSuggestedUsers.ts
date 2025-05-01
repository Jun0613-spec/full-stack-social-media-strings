import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { SuggestedUsers } from "@/types";

export const useGetSuggestedUsers = () => {
  return useQuery<SuggestedUsers>({
    queryKey: ["suggestedUsers"],

    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/users/suggested", {
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
