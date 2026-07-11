"use client";

import { useQuery } from "@tanstack/react-query";
import { gamificationAPI } from "@/lib/api";

export function useStudentProfile() {
  const { data: progress, isLoading } = useQuery({
    queryKey: ["gamification-progress"],
    queryFn: async () => {
      const { data } = await gamificationAPI.getProgress();
      return data.data;
    },
  });

  const { data: badges } = useQuery({
    queryKey: ["gamification-badges"],
    queryFn: async () => {
      const { data } = await gamificationAPI.getBadges();
      return data.data;
    },
  });

  return {
    xp: progress?.xp || 0,
    level: progress?.level || 1,
    totalScore: progress?.totalScore || 0,
    streak: progress?.streak || 0,
    badges: badges || [],
    isLoading,
  };
}