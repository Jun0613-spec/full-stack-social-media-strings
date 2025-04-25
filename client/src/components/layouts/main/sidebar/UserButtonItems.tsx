import { cn } from "@/lib/utils";

import { IconType } from "react-icons/lib";

interface UserButtonItemsProps {
  icon: IconType;
  label: string;
  onClick: () => void;
  className?: string;
}

const UserButtonItems = ({
  icon: Icon,
  label,
  onClick,
  className = ""
}: UserButtonItemsProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-10 flex items-center gap-4 px-4 font-medium text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer",
        className
      )}
    >
      <Icon className="size-5" />
      {label}
    </button>
  );
};

export default UserButtonItems;
