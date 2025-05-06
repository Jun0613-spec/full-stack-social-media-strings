import { Outlet } from "react-router-dom";

import ThemeToggle from "@/components/ThemeToggle";

import { useTheme } from "@/providers/theme-provider";

const AuthLayout = () => {
  const { theme } = useTheme();
  return (
    <div className="flex min-h-screen ">
      {/* Left */}
      <div className="flex flex-col w-full lg:w-1/2 min-h-screen">
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <img
              src={
                theme === "light" ? "/images/logo.svg" : "/images/logo-dark.svg"
              }
              alt="logo"
            />
            <span className="text-xl font-semibold text-black dark:text-white">
              Strings
            </span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>

        <footer className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          © 2025 Strings
        </footer>
      </div>

      {/* Right */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/10 z-10" />
        <img
          src="/images/auth.jpg"
          alt="auth-bg"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Connect with your world
            </h1>
            <p className="text-lg text-white/80">
              Share your thoughts, and stay connected with the people that
              matter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
