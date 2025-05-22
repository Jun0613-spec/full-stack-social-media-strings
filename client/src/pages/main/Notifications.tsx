import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi2";

import Header from "@/components/Header";
import Button from "@/components/Button";
import NotificationList from "@/components/notifications/NotificationList";

import { useGetNotifications } from "@/hooks/notifications/useGetNotifications";
import { useMarkNotificationAsRead } from "@/hooks/notifications/useMarkNotificationAsRead";
import { useDeleteNotification } from "@/hooks/notifications/useDeleteNotification";
import { useDeleteAllNotifications } from "@/hooks/notifications/useDeleteAllNotifications";

import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";
import { useNotificationStore } from "@/stores/notificationStore";

import { Notification } from "@/types/prismaTypes";

const getNotificationTargetUrl = (notification: Notification) => {
  const username =
    notification.recipient?.username || notification.sender?.username;

  switch (notification.type) {
    case "LIKE_POST":
      return `/${username}/post/${notification.like.post.id}`;
    case "LIKE_REPLY":
      return `/${username}/post/${notification.like.reply.postId}`;
    case "REPLY":
      return `/${username}/post/${notification.reply.post.id}`;
    case "FOLLOW":
      return `/profile/${notification.sender.username}`;
    default:
      return "/";
  }
};

const NotificationsPage = () => {
  const navigate = useNavigate();

  const { openModal: openConfirmModal } = useConfirmModalStore();
  const { hasNewNotification, markNotificationsSeen } = useNotificationStore();

  const [activeNotification, setActiveNotification] = useState<string | null>(
    null
  );

  const {
    data: notificationsData = [],
    isLoading,
    refetch
  } = useGetNotifications();

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: deleteAllNotifications } = useDeleteAllNotifications();

  useEffect(() => {
    if (hasNewNotification) {
      refetch();
      markNotificationsSeen();
    }
  }, [hasNewNotification, refetch, markNotificationsSeen]);

  const handleNotificationClick = (notification: Notification) => {
    setActiveNotification(notification.id);
    markAsRead(notification.id);
    const url = getNotificationTargetUrl(notification);
    navigate(url);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setActiveNotification(notificationId);
    markAsRead(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    openConfirmModal({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      onConfirm: async () => {
        await deleteNotification(notificationId);
      }
    });
  };

  const handleDeleteAll = () => {
    openConfirmModal({
      title: "Delete All Notifications",
      message: "Are you sure you want to delete all notifications?",
      onConfirm: () => deleteAllNotifications()
    });
  };

  const markAllAsRead = () => {
    notificationsData.forEach((notification: Notification) => {
      if (!notification.isRead) markAsRead(notification.id);
    });
  };

  const hasUnreadNotifications = notificationsData.some(
    (notification: Notification) => !notification.isRead
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <Header label="Notifications" />
        {notificationsData.length > 0 && (
          <div className="p-4 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleDeleteAll}>
              Delete all
            </Button>

            {hasUnreadNotifications && (
              <Button variant="primary" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-y-auto no-scrollbar p-4">
        {isLoading || notificationsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <HiOutlineBell className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
              No notifications yet
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              When you get notifications, they'll appear here
            </p>
          </div>
        ) : (
          <NotificationList
            notifications={notificationsData}
            isLoading={isLoading}
            activeNotification={activeNotification}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onClick={handleNotificationClick}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
