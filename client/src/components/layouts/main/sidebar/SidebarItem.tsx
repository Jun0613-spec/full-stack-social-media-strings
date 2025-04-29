import { IconType } from "react-icons/lib";
import { useLocation, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  icon: IconType;
  activeIcon?: IconType;
  href?: string;
  onClick?: () => void;
}

const SidebarItem = ({
  label,
  href,
  onClick,
  icon: Icon,
  activeIcon
}: SidebarItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = href ? location.pathname === href : false;
  const ActiveIcon = activeIcon ?? Icon;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-muted dark:hover:bg-neutral-800 flex items-center gap-4 cursor-pointer"
    >
      {isActive ? (
        <ActiveIcon className="w-6 h-6" />
      ) : (
        <Icon className="w-6 h-6" />
      )}

      <span
        className={cn(
          "hidden 2xl:inline text-lg",
          isActive ? "font-semibold" : "font-medium"
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default SidebarItem;
