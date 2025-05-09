import {
  HiOutlineBell,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineHeart,
  HiOutlineReply,
  HiOutlineUserAdd
} from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";

import Button from "@/components/Button";
import UserAvatar from "@/components/UserAvatar";

import { cn } from "@/lib/utils";

import { Notification } from "@/types/prismaTypes";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
  isActive: boolean;
}

const notificationTypeIcon = (type: string) => {
  switch (type) {
    case "LIKE_POST":
    case "LIKE_REPLY":
      return (
        <HiOutlineHeart className="text-red-500 dark:text-red-400 w-5 h-5" />
      );
    case "REPLY":
      return (
        <HiOutlineReply className="text-blue-500 dark:text-blue-400 w-5 h-5" />
      );
    case "FOLLOW":
      return (
        <HiOutlineUserAdd className="text-green-500 dark:text-green-400 w-5 h-5" />
      );
    default:
      return (
        <HiOutlineBell className="text-neutral-500 dark:text-neutral-400 w-5 h-5" />
      );
  }
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  isActive
}: NotificationCardProps) => {
  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 rounded-xl border shadow-sm transition-colors cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800",
        notification.isRead
          ? "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
          : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700"
      )}
      onClick={() => onClick(notification)}
    >
      <div className="flex-shrink-0 mt-1">
        {notificationTypeIcon(notification.type)}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <UserAvatar src={notification.sender.avatarImage} />

          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {notification.message}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {notification.body}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true
                })}
              </p>
              {!notification.isRead && (
                <span className="ml-2 w-2 h-2 inline-block rounded-full bg-blue-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className=" flex items-center space-x-2 self-start mt-1">
        {!notification.isRead && (
          <Button
            variant="muted"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            disabled={isActive}
          >
            <HiOutlineCheck className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="muted"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <HiOutlineTrash className="w-4 h-4 text-red-500 hover:text-red-600 dark:hover:text-red-400" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationCard;
