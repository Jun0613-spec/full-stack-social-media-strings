import { create } from "zustand";

interface EditPostModalState {
  isOpen: boolean;
  postId: string | null;
  initialText: string | null;
  openModal: (postId: string, text: string) => void;
  closeModal: () => void;
}

export const useEditPostModalStore = create<EditPostModalState>((set) => ({
  isOpen: false,
  postId: null,
  initialText: "",
  openModal: (postId, initialText) =>
    set({ isOpen: true, postId, initialText }),
  closeModal: () => set({ isOpen: false, postId: null, initialText: "" })
}));
