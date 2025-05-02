import { create } from "zustand";

import { User } from "@/types/prismaTypes";

interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  currentUser: null,
  isLoading: true,
  setUser: (user) =>
    set(() => ({
      isLoggedIn: !!user,
      currentUser: user,
      isLoading: false
    })),
  logout: () =>
    set({
      isLoggedIn: false,
      currentUser: null,
      isLoading: false
    })
}));
