import { useTheme } from "@/providers/theme-provider";

const AuthBranding = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <img
        src={theme === "light" ? "/images/logo.svg" : "/images/logo-dark.svg"}
        alt="Strings Logo"
        className="w-12 h-12"
      />
      <h1 className="text-2xl font-bold">Welcome to Strings</h1>
      <p className="text-sm text-muted-foreground">
        Share your thoughts and stay connected in a modern social experience.
      </p>
    </div>
  );
};

export default AuthBranding;
