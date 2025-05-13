import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { Notification } from "@/types/prismaTypes";

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await axiosInstance.delete(
          `/api/notifications/${notificationId}`,
          {
            withCredentials: true
          }
        );

        return { notificationId, notification: response.data };
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async ({ notificationId }) => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });

      queryClient.setQueryData(
        ["notifications"],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return [];

          return oldData.filter(
            (notification) => notification.id !== notificationId
          );
        }
      );
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
