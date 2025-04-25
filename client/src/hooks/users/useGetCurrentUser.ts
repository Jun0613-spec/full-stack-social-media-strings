import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/users/current-user", {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        return null;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });
};
