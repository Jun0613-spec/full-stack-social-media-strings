import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: "",
      setQuery: (query: string) => set({ query })
    }),
    { name: "search-storage" }
  )
);
