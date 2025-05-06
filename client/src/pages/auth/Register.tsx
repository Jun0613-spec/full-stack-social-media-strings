import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

import Label from "@/components/Label";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Loader from "@/components/Loader";

import { RegisterRequest } from "@/types";

import { useRegister } from "@/hooks/auth/useRegister";
import { useLogin } from "@/hooks/auth/useLogin";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { mutate: registerUser, isPending } = useRegister();
  const { mutate: login } = useLogin();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (values: RegisterRequest) => {
    registerUser(values, {
      onSuccess: () => {
        login({
          email: values.email,
          password: values.password
        });
      }
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
          Create your account
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Join Strings to connect with your world
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input
              type="text"
              placeholder="Enter your first name"
              size="md"
              {...register("firstName", { required: "First name is required" })}
              error={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="mt-1.5 text-sm text-red-500 dark:text-red-600">
                {errors.firstName?.message}
              </p>
            )}
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              type="text"
              placeholder="Enter your last name"
              size="md"
              {...register("lastName", { required: "Last name is required" })}
              error={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="mt-1.5 text-sm text-red-500 dark:text-red-600">
                {errors.lastName?.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Username</Label>
          <Input
            type="text"
            placeholder="Enter your username"
            size="md"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
          />
          {errors.username && (
            <p className="mt-1.5 text-sm text-red-500 dark:text-red-600">
              {errors.username?.message}
            </p>
          )}
        </div>

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
            <p className="mt-1.5 text-sm text-red-500 dark:text-red-600">
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
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
            <p className="mt-1.5 text-sm text-red-500 dark:text-red-600">
              {errors.password?.message}
            </p>
          )}
        </div>

        <div>
          <Label>Confirm Password</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              size="md"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match"
              })}
              error={!!errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 cursor-pointer"
            >
              {showConfirmPassword ? (
                <RiEyeOffLine className="w-5 h-5" />
              ) : (
                <RiEyeLine className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-500 dark:text-red-600">
              {errors.confirmPassword?.message}
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
          {isPending ? (
            <Loader size={20} className="mx-auto" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
