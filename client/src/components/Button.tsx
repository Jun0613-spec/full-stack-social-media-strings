import { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | "muted";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  const defaultStyles =
    "rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer";
  const variantStyles = {
    primary:
      "text-white bg-neutral-900 hover:bg-neutral-900/80 dark:text-black dark:bg-white dark:hover:bg-white/80",
    secondary:
      "text-black bg-white hover:opacity-80 dark:text-white dark:bg-neutral-800 dark:hover:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700",
    danger:
      "text-white bg-red-600 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900",
    outline:
      "bg-tranparent border border-neutral-200 text-black hover:bg-muted dark:text-white dark:border-neutral-800 dark:hover:bg-neutral-800",
    ghost:
      "bg-transparent hover:bg-muted text-muted-foreground dark:hover:bg-neutral-900 dark:text-neutral-600",
    muted: "bg-transparent hover:opacity-80 "
  };

  const sizeStyles = {
    icon: "p-2",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg"
  };

  return (
    <button
      className={cn(
        defaultStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
