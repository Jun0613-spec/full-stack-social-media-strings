import { cn } from "../lib/utils";
import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  className?: string;
}

const Label = ({ children, className }: LabelProps) => {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-neutral-700 dark:text-neutral-300",
        className
      )}
    >
      {children}
    </label>
  );
};

export default Label;
