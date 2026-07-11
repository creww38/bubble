"use client";

import { create } from 'zustand';

interface GamificationState {
  xp: number;
  level: number;
  totalScore: number;
  streak: number;
  badges: any[];
  dailyChallengeCompleted: boolean;
  leaderboard: any[];

  setProgress: (data: any) => void;
  addXP: (amount: number) => void;
  setBadges: (badges: any[]) => void;
  setLeaderboard: (data: any[]) => void;
  completeDailyChallenge: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  xp: 0,
  level: 1,
  totalScore: 0,
  streak: 0,
  badges: [],
  dailyChallengeCompleted: false,
  leaderboard: [],

  setProgress: (data) =>
    set({
      xp: data.xp || 0,
      level: data.level || 1,
      totalScore: data.totalScore || 0,
      streak: data.streak || 0,
    }),

  addXP: (amount) =>
    set((state) => ({
      xp: state.xp + amount,
    })),

  setBadges: (badges) => set({ badges }),
  
  setLeaderboard: (leaderboard) => set({ leaderboard }),

  completeDailyChallenge: () => set({ dailyChallengeCompleted: true }),
}));