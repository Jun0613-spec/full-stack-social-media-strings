import { create } from "zustand";

interface ReplyModalState {
  isOpen: boolean;
  postId: string | null;
  openModal: (postId: string) => void;
  closeModal: () => void;
}

export const useReplyModalStore = create<ReplyModalState>((set) => ({
  isOpen: false,
  postId: null,
  openModal: (postId) => set({ isOpen: true, postId }),
  closeModal: () => set({ isOpen: false, postId: null })
}));
