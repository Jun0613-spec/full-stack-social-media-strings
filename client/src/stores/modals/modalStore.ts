import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const createModalStore = () =>
  create<ModalState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false })
  }));

export const usePostModalStore = createModalStore();
export const useEditUserModalStore = createModalStore();
