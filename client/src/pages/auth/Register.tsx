import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Link } from "react-router-dom";

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
    <div className="container mx-auto max-w-xl w-full">
      <h2 className="text-2xl font-bold text-center mb-8">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label>First Name</Label>
            <Input
              {...register("firstName", {
                required: "First name is required"
              })}
              type="text"
              placeholder="Enter your first name"
              error={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 dark:text-red-600 mt-2">
                {errors.firstName?.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Label>Last Name</Label>
            <Input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Enter your last name"
              error={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 dark:text-red-600 mt-2">
                {errors.lastName?.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label>Username</Label>
          <Input
            size="md"
            type="username"
            placeholder="Enter your username"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
          />
          {errors.username && (
            <p className="text-sm text-red-500 dark:text-red-600 mt-2">
              {errors.username?.message}
            </p>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <Input
            size="md"
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-red-500 dark:text-red-600 mt-2">
              {errors.email?.message}
            </p>
          )}
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              size="md"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-neutral-600 dark:text-neutral-300 cursor-pointer"
            >
              {showPassword ? (
                <RiEyeOffLine className="size-5" />
              ) : (
                <RiEyeLine className="size-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 dark:text-red-600 mt-2">
              {errors.password?.message}
            </p>
          )}
        </div>

        <div>
          <Label> Confirm Password</Label>
          <div className="relative">
            <Input
              size="md"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
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
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-neutral-600 dark:text-neutral-300 cursor-pointer"
            >
              {showConfirmPassword ? (
                <RiEyeOffLine className="size-5" />
              ) : (
                <RiEyeLine className="size-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 dark:text-red-600 mt-2">
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? <Loader size={24} className="text-muted" /> : "Register"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-neutral-800 dark:text-neutral-200 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
