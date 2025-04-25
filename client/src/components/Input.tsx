import { InputHTMLAttributes } from "react";

import { cn } from "../lib/utils";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  size?: "sm" | "md" | "lg";
  error?: boolean;
}

const Input = ({
  className,
  size = "md",
  error = false,
  ...props
}: InputProps) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg"
  };

  const errorStyles = error
    ? "border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:ring-red-600"
    : "border-neutral-200 focus:ring-neutral-500 dark:border-neutral-800 dark:focus:ring-neutral-500";

  return (
    <input
      className={cn(
        "mt-1 w-full border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out placeholder:text-sm md:placeholder:text-base",
        sizeStyles[size],
        errorStyles,
        className
      )}
      {...props}
    />
  );
};

export default Input;
