import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "@/components/Loader";

import { useAuthStore } from "@/stores/authStore";

import { useGoogleAuth } from "@/hooks/auth/useGetGoogleAuth";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { completeGoogleAuth } = useGoogleAuth();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
      return;
    }

    completeGoogleAuth.mutate(undefined, {
      onSuccess: () => navigate("/"),
      onError: () =>
        navigate("/login", {
          state: { error: "Google authentication failed. Please try again." }
        })
    });
  }, [completeGoogleAuth, navigate, isLoggedIn]);

  return <Loader />;
};

export default GoogleAuthSuccess;
