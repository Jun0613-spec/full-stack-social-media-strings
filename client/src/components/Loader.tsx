import { LuLoaderCircle } from "react-icons/lu";

import { cn } from "../lib/utils";

interface LoaderProps {
  size?: string | number;
  color?: string;
  className?: string;
  iconClassName?: string;
}

const Loader = ({
  size = 18,
  color = "text-muted-foreground dark:text-muted",
  className = "",
  iconClassName = ""
}: LoaderProps) => {
  const sizeClass = typeof size === "number" ? `${size}px` : size;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <LuLoaderCircle
        className={cn("animate-spin", color, iconClassName)}
        style={{ width: sizeClass, height: sizeClass }}
      />
    </div>
  );
};

export default Loader;
