import { LuShell } from "react-icons/lu";

import { cn } from "../lib/utils";

interface SpinnerProps {
  size?: string | number;
  color?: string;
  className?: string;
  iconClassName?: string;
}

const Spinner = ({
  size = 18,
  color = "text-muted-foreground dark:text-muted",
  className = "",
  iconClassName = ""
}: SpinnerProps) => {
  const sizeClass = typeof size === "number" ? `${size}px` : size;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <LuShell
        className={cn("animate-spin", color, iconClassName)}
        style={{ width: sizeClass, height: sizeClass }}
      />
    </div>
  );
};

export default Spinner;
