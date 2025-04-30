import { create } from "zustand";

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  openModal: (options: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
  closeModal: () => void;
}

export const useConfirmModalStore = create<ConfirmModalState>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  onConfirm: () => {},
  openModal: ({ title, message, onConfirm }) =>
    set({ isOpen: true, title, message, onConfirm }),
  closeModal: () => set({ isOpen: false })
}));
