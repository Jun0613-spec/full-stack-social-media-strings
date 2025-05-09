import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Button from "@/components/Button";
import NotificationList from "@/components/notifications/NotificationList";

import { useGetNotifications } from "@/hooks/notifications/useGetNotifications";
import { useMarkNotificationAsRead } from "@/hooks/notifications/useMarkNotificationAsRead";
import { useDeleteNotification } from "@/hooks/notifications/useDeleteNotification";

import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";

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

  const [activeNotification, setActiveNotification] = useState<string | null>(
    null
  );

  const { data: notificationsData, isLoading } = useGetNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = notificationsData?.notifications ?? [];

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
      onConfirm: () => deleteNotification(notificationId)
    });
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) markAsRead(n.id);
    });
  };

  const hasUnreadNotifications = notifications.some((n) => !n.isRead);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <Header label="Notifications" />
        {hasUnreadNotifications && (
          <div className="p-4 flex items-center justify-end">
            <Button variant="primary" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-y-auto no-scrollbar p-4">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          activeNotification={activeNotification}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onClick={handleNotificationClick}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
