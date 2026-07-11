"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export function useSimulation(id: string) {
  return useQuery({
    queryKey: ['simulation', id],
    queryFn: async () => {
      const { data } = await simulationsAPI.getById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useSimulations(params?: any) {
  return useQuery({
    queryKey: ['simulations', params],
    queryFn: async () => {
      const { data } = await simulationsAPI.getAll(params);
      return data.data;
    },
  });
}

export function usePostInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, interactionType }: { postId: string; interactionType: string }) => {
      const { data } = await simulationsAPI.interact(postId, interactionType);
      return data.data;
    },
    onSuccess: (data) => {
      if (data.pointsEarned > 0) {
        toast.success(`+${data.pointsEarned} XP earned!`, {
          icon: '🌟',
          duration: 3000,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['simulation'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save interaction');
    },
  });
}

export function useStudentProgress() {
  return useQuery({
    queryKey: ['student-progress'],
    queryFn: async () => {
      const { data } = await simulationsAPI.getProgress();
      return data.data;
    },
  });
}