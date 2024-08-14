import { create } from "zustand";

export type NavigationState = {
  isOpen: boolean;
  toggle: (state?: "open" | "close") => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  isOpen: false,
  toggle: (open) => set((state) => ({ isOpen: open === "open" ? true : open === "close" ? false : !state.isOpen })),
}));
