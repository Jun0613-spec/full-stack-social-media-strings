import { create } from "zustand";

interface NotificationState {
  hasNewNotification: boolean;
  setHasNewNotification: (value: boolean) => void;
  markNotificationsSeen: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  hasNewNotification: false,

  setHasNewNotification: (value) => set({ hasNewNotification: value }),

  markNotificationsSeen: () => set({ hasNewNotification: false })
}));
