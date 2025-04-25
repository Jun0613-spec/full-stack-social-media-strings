import { Outlet } from "react-router-dom";

import ThemeToggle from "@/components/ThemeToggle";

const AuthLayout = () => {
  return (
    <div className=" flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full h-full max-w-[72rem]  max-h-[52rem] overflow-hidden rounded-3xl shadow-xl border border-border">
        <div className="relative w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div className="absolute right-6 top-1/12 -translate-y-1/2 z-10">
            <ThemeToggle />
          </div>

          <main className="space-y-6 ">
            <Outlet />
          </main>

          <footer className="text-center text-sm text-muted-foreground mt-8">
            © 2025 Strings
          </footer>
        </div>

        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="/images/auth.jpg"
            alt="auth-bg"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
