import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (conversationId: string) => {
      try {
        const response = await axiosInstance.delete(
          `/api/conversations/${conversationId}`,
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
      toast.success("This conversation has been deleted");
      navigate("/messages");

      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
