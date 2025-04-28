import { FcGoogle } from "react-icons/fc";

import { useGoogleAuth } from "@/hooks/auth/useGetGoogleAuth";

import Button from "./Button";
import Loader from "./Loader";

const GoogleSignInButton = () => {
  const { initiateGoogleLogin, isInitiating } = useGoogleAuth();

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={initiateGoogleLogin}
      disabled={isInitiating}
      className="w-full gap-4"
      type="button"
    >
      {isInitiating ? <Loader size={20} /> : <FcGoogle className="w-5 h-5" />}
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
