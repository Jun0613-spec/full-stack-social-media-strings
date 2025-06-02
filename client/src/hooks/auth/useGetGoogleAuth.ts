import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { useAuthStore } from "@/stores/authStore";

import { User } from "@/types/prismaTypes";

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const getGoogleAuthURL = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.get("/api/auth/google", {
          withCredentials: true
        });

        return response.data.url;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (error) => {
      toast.error("Failed to initiate Google sign in");
      console.error("Google auth URL error:", error);
    }
  });

  const completeGoogleAuth = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      const currentUser = await queryClient.fetchQuery<User>({
        queryKey: ["currentUser"]
      });

      return currentUser;
    },
    onSuccess: (user) => {
      if (user) {
        setUser(user);
        toast.success(`Welcome to Strings ${user.username}!`);
      }
    },
    onError: (error) => {
      toast.error("Google authentication failed");
      console.error("Complete Google auth error:", error);
    }
  });

  const initiateGoogleLogin = () => {
    getGoogleAuthURL.mutate();
  };

  return {
    initiateGoogleLogin,
    isInitiating: getGoogleAuthURL.isPending,
    completeGoogleAuth,
    isCompleting: completeGoogleAuth.isPending
  };
};
