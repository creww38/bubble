"use client";

import { create } from 'zustand';

interface SimulationState {
  currentPostIndex: number;
  totalPosts: number;
  interactions: Record<string, string>;
  feedback: any;
  showFeedback: boolean;
  isLoading: boolean;
  
  setCurrentPostIndex: (index: number) => void;
  nextPost: () => void;
  prevPost: () => void;
  addInteraction: (postId: string, type: string) => void;
  setFeedback: (feedback: any) => void;
  setShowFeedback: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  currentPostIndex: 0,
  totalPosts: 0,
  interactions: {},
  feedback: null,
  showFeedback: false,
  isLoading: false,

  setCurrentPostIndex: (index) => set({ currentPostIndex: index }),

  nextPost: () => {
    const { currentPostIndex, totalPosts } = get();
    if (currentPostIndex < totalPosts - 1) {
      set({ currentPostIndex: currentPostIndex + 1, showFeedback: false });
    }
  },

  prevPost: () => {
    const { currentPostIndex } = get();
    if (currentPostIndex > 0) {
      set({ currentPostIndex: currentPostIndex - 1, showFeedback: false });
    }
  },

  addInteraction: (postId, type) =>
    set((state) => ({
      interactions: { ...state.interactions, [postId]: type },
    })),

  setFeedback: (feedback) => set({ feedback }),
  setShowFeedback: (show) => set({ showFeedback: show }),
  setLoading: (loading) => set({ isLoading: loading }),

  reset: () =>
    set({
      currentPostIndex: 0,
      totalPosts: 0,
      interactions: {},
      feedback: null,
      showFeedback: false,
      isLoading: false,
    }),
}));