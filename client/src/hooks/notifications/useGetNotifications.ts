// import { useQuery } from "@tanstack/react-query";

// import { axiosInstance, handleAxiosError } from "@/lib/axios";

// import { Notification } from "@/types/prismaTypes";

// export const useGetNotifications = () => {
//   return useQuery<Notification[]>({
//     queryKey: ["notifications"],
//     queryFn: async () => {
//       try {
//         const response = await axiosInstance.get("/api/notifications", {
//           withCredentials: true
//         });

//         return response.data || [];
//       } catch (error) {
//         handleAxiosError(error);
//         return [];
//       }
//     },
//     retry: 1,
//     staleTime: 1000 * 60 * 30,
//     gcTime: 1000 * 60 * 60,
//     refetchOnWindowFocus: false
//   });
// };

import { useQuery } from "@tanstack/react-query";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { Notification } from "@/types/prismaTypes";
export const useGetNotifications = () => {
  return useQuery<{ notifications: Notification[] }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/notifications", {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false
  });
};
