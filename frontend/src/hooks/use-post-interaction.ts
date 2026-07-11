"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { simulationsAPI } from "@/lib/api";
import toast from "react-hot-toast";

export function usePostInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      interactionType,
    }: {
      postId: string;
      interactionType: string;
    }) => {
      const { data } = await simulationsAPI.interact(postId, interactionType);
      return data.data;
    },
    onSuccess: (data: any) => {
      if (data && data.pointsEarned > 0) {
        toast.success("+" + data.pointsEarned + " XP!", {
          icon: "🌟",
          duration: 3000,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["simulation"] });
      queryClient.invalidateQueries({ queryKey: ["student-progress"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal menyimpan interaksi";
      toast.error(message);
    },
  });
}