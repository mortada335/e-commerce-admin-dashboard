import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  isDarkMode: true,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleDarkMode: () => {
    set((s) => {
      const next = !s.isDarkMode;
      document.documentElement.classList.toggle("light", !next);
      return { isDarkMode: next };
    });
  },
}));
