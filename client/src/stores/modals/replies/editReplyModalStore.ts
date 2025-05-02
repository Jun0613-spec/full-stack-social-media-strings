import { create } from "zustand";

interface EditReplyModalState {
  isOpen: boolean;
  postId: string | null;
  replyId: string | null;
  initialText: string | null;
  openModal: (replyId: string, text: string, postId: string) => void;
  closeModal: () => void;
}

export const useEditReplyModalStore = create<EditReplyModalState>((set) => ({
  isOpen: false,
  postId: null,
  replyId: null,
  initialText: "",
  openModal: (replyId, initialText, postId) =>
    set({ isOpen: true, replyId, postId, initialText }),
  closeModal: () => set({ isOpen: false, replyId: null, initialText: "" })
}));
