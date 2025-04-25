// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// import { axiosInstance, handleAxiosError } from "@/lib/axios";

// import { RegisterRequest, RegisterResponse } from "@/types";

// export const useRegister = () => {
//   const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
//     mutationFn: async (body: RegisterRequest) => {
//       try {
//         const response = await axiosInstance.post("/api/auth/register", body, {
//           withCredentials: true
//         });

//         return response.data;
//       } catch (error) {
//         handleAxiosError(error);
//         throw error;
//       }
//     },

//     onError: (error) => {
//       toast.error(error.message);
//     }
//   });

//   return mutation;
// };

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosInstance, handleAxiosError } from "@/lib/axios";

import { RegisterRequest, RegisterResponse } from "@/types";

export const useRegister = () => {
  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (body: RegisterRequest) => {
      try {
        const response = await axiosInstance.post("/api/auth/register", body, {
          withCredentials: true
        });

        return response.data;
      } catch (error) {
        handleAxiosError(error);
        throw error;
      }
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
