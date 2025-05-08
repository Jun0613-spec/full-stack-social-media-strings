import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useCreateMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axiosInstance.post(
          `/api/messages/${conversationId}`,
          formData,
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
      await queryClient.invalidateQueries({
        queryKey: ["messages", conversationId]
      });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
