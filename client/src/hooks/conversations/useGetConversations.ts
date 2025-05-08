import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { Conversation } from "@/types/prismaTypes";

export const useGetConversations = () => {
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/conversations", {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        return null;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false
  });
};
