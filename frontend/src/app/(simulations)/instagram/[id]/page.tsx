"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, Bookmark, Flag, Search, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { BiasBadge } from "@/components/ui/bias-badge";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { useSimulation } from "@/hooks/use-simulation";
import { usePostInteraction } from "@/hooks/use-post-interaction";
import { FeedbackModal } from "@/components/features/feedback-modal";
import { cn, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrls: string[];
  biasType: string;
  isMisinformation: boolean;
  postedAt: string;
}

export default function InstagramSimulationPage({ params }: { params: { id: string } }) {
  const { data: simulation, isLoading } = useSimulation(params.id);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const interactMutation = usePostInteraction();

  const posts: Post[] = simulation?.posts || [];

  const handleInteraction = async (postId: string, action: string) => {
    try {
      const result = await interactMutation.mutateAsync({
        postId,
        interactionType: action,
      });

      setFeedback(result.feedback);
      setShowFeedback(true);

      if (result.isCorrect) {
        toast.success(`+${result.pointsEarned} XP!`, {
          icon: "🌟",
        });
      } else {
        toast.error("Coba lagi!", {
          icon: "💪",
        });
      }
    } catch (error) {
      toast.error("Gagal menyimpan interaksi");
    }
  };

  const nextPost = () => {
    setShowFeedback(false);
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentPost = posts[currentPostIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {simulation?.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Post {currentPostIndex + 1} dari {posts.length}
            </p>
          </div>
          <BiasBadge type={currentPost?.biasType || "UNKNOWN"} />
        </div>

        {/* Phone Frame */}
        <PhoneFrame>
          <div className="bg-white dark:bg-slate-900 h-full overflow-y-auto">
            {/* Instagram Header */}
            <GlassCard className="sticky top-0 z-10 px-4 py-3 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="font-semibold text-sm">InstaSim</span>
              </div>
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-slate-600" />
                <MessageCircle className="w-5 h-5 text-slate-600" />
              </div>
            </GlassCard>

            {/* Posts */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPost?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {currentPost?.authorName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{currentPost?.authorName}</p>
                    <p className="text-xs text-slate-500">{formatDate(currentPost?.postedAt)}</p>
                  </div>
                </div>

                {/* Post Image */}
                {currentPost?.mediaUrls?.[0] && (
                  <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={currentPost.mediaUrls[0]}
                      alt="Post content"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4">
                      <Heart className="w-6 h-6 text-slate-600 hover:text-red-500 cursor-pointer transition-colors" />
                      <MessageCircle className="w-6 h-6 text-slate-600 hover:text-blue-500 cursor-pointer transition-colors" />
                      <Share2 className="w-6 h-6 text-slate-600 hover:text-green-500 cursor-pointer transition-colors" />
                    </div>
                    <Bookmark className="w-6 h-6 text-slate-600 hover:text-yellow-500 cursor-pointer transition-colors" />
                  </div>

                  {/* Post Content */}
                  <p className="text-sm mb-4">
                    <span className="font-semibold">{currentPost?.authorName}</span>{" "}
                    {currentPost?.content}
                  </p>

                  {/* Learning Actions */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                      Apa yang akan kamu lakukan?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInteraction(currentPost.id, "BELIEVE")}
                        className="justify-start"
                      >
                        <Heart className="w-4 h-4 mr-2 text-green-500" />
                        Percaya
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInteraction(currentPost.id, "DISBELIEVE")}
                        className="justify-start"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
                        Tidak Percaya
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInteraction(currentPost.id, "FACT_CHECK")}
                        className="justify-start"
                      >
                        <Search className="w-4 h-4 mr-2 text-blue-500" />
                        Fact Check
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInteraction(currentPost.id, "REPORT")}
                        className="justify-start"
                      >
                        <Flag className="w-4 h-4 mr-2 text-orange-500" />
                        Laporkan
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="p-4 flex justify-between">
              <Button
                variant="ghost"
                disabled={currentPostIndex === 0}
                onClick={() => {
                  setShowFeedback(false);
                  setCurrentPostIndex(currentPostIndex - 1);
                }}
              >
                ← Sebelumnya
              </Button>
              <Button
                variant="gradient"
                disabled={currentPostIndex === posts.length - 1}
                onClick={nextPost}
              >
                Selanjutnya →
              </Button>
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        feedback={feedback}
      />
    </div>
  );
}