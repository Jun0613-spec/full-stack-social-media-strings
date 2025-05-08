import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { Message } from "react-hook-form";

export const useGetMessagesByConversationId = (conversationId: string) => {
  return useQuery<{ messages: Message[] }>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/messages/${conversationId}`,
          {
            withCredentials: true
          }
        );

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });
};
