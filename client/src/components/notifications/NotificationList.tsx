import { HiOutlineBell } from "react-icons/hi";

import Loader from "@/components/Loader";

import { Notification } from "@/types/prismaTypes";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  activeNotification: string | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
}

const NotificationList = ({
  notifications,
  isLoading,
  activeNotification,
  onMarkAsRead,
  onDelete,
  onClick
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <HiOutlineBell className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
          No notifications yet
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          When you get notifications, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto no-scrollbar space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          onClick={onClick}
          isActive={activeNotification === notification.id}
        />
      ))}
    </div>
  );
};

export default NotificationList;
