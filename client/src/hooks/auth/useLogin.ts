import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { LoginRequest, LoginResponse } from "@/types";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { useAuthStore } from "@/stores/authStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (body: LoginRequest) => {
      try {
        const response = await axiosInstance.post("/api/auth/login", body, {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      toast.success(`Welcome to Strings ${data.user.username}!`);

      setUser(data.user);

      await queryClient.setQueryData(["currentUser"], data.user);

      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
