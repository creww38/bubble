"use client";

import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  aiChatOpen: boolean;
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  notificationCount: number;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleAIChat: () => void;
  setAIChatOpen: (open: boolean) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setNotificationCount: (count: number) => void;
  incrementNotifications: () => void;
  resetNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  aiChatOpen: false,
  modalOpen: false,
  modalContent: null,
  notificationCount: 0,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleAIChat: () => set((state) => ({ aiChatOpen: !state.aiChatOpen })),
  setAIChatOpen: (open) => set({ aiChatOpen: open }),
  
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
  
  setNotificationCount: (count) => set({ notificationCount: count }),
  incrementNotifications: () => set((state) => ({ notificationCount: state.notificationCount + 1 })),
  resetNotifications: () => set({ notificationCount: 0 }),
}));