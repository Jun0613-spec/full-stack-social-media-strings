import { IconType } from "react-icons/lib";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketStore } from "@/stores/socketStore";

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

  const { hasNewNotification, markNotificationsSeen } = useSocketStore();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }

    if (label === "Notifications") {
      markNotificationsSeen();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-muted dark:hover:bg-neutral-800 flex items-center gap-4 cursor-pointer"
    >
      <div className="relative">
        {isActive ? (
          <ActiveIcon className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6" />
        )}
        {label === "Notifications" && hasNewNotification && (
          <span className="absolute -top-1 right-0 block h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
        )}
      </div>

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
