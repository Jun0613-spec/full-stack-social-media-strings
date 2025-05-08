import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

import Label from "@/components/Label";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import GoogleSignInButton from "@/components/GoogleSignInButton";

import { LoginRequest } from "@/types";

import { useLogin } from "@/hooks/auth/useLogin";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: LoginRequest) => {
    login(values);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
          Welcome back
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Enter your details to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            size="md"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500 dark:red-text-600">
              {errors.email?.message}
            </p>
          )}
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              size="md"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 cursor-pointer"
            >
              {showPassword ? (
                <RiEyeOffLine className="w-5 h-5" />
              ) : (
                <RiEyeLine className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500 dark:red-text-600">
              {errors.password?.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? <Loader size={20} className="mx-auto" /> : "Login"}
        </Button>
      </form>

      {/* Divider */}
      <div className="mt-6">
        <div className="relative">
          <div className="relative flex items-center justify-center text-sm">
            <div className="flex-1 w-full border-t border-neutral-200 dark:border-neutral-800" />
            <span className="bg-transparent px-2 text-gray-500">Or</span>
            <div className="flex-1 w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
        </div>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </div>

      {/* Sign up link */}
      <p className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
