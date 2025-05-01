import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useGetUserProfile = (username: string) => {
  return useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/users/profile/${username}`,
          {
            withCredentials: true
          }
        );

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        return null;
      }
    },
    enabled: !!username,
    retry: 1,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false
  });
};
