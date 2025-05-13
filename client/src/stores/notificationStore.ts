import { create } from "zustand";

interface NotificationState {
  hasUnread: boolean;
  unreadCount: number;
  setHasUnread: (value: boolean) => void;
  incrementUnreadCount: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  hasUnread: false,
  unreadCount: 0,
  setHasUnread: (value) => set({ hasUnread: value }),
  incrementUnreadCount: () =>
    set((state) => ({
      hasUnread: true,
      unreadCount: state.unreadCount + 1
    })),
  clearUnread: () => set({ hasUnread: false, unreadCount: 0 })
}));
