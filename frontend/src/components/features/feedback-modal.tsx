"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { BiasBadge } from "@/components/ui/bias-badge";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedback: {
    message: string;
    biasExplanation?: string;
    tips?: string[];
    correct?: boolean;
  } | null;
}

export function FeedbackModal({ open, onClose, feedback }: FeedbackModalProps) {
  if (!feedback) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${feedback.correct ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                  {feedback.correct ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-amber-600" />
                  )}
                </div>
              </div>

              {/* Message */}
              <h3 className="text-xl font-bold text-center mb-4">
                {feedback.correct ? 'Jawaban Tepat!' : 'Perlu Diperhatikan'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                {feedback.message}
              </p>

              {/* Bias Explanation */}
              {feedback.biasExplanation && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-sm">Penjelasan Bias</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feedback.biasExplanation}
                  </p>
                </div>
              )}

              {/* Tips */}
              {feedback.tips && feedback.tips.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className="font-semibold text-sm">💡 Tips Berpikir Kritis:</p>
                  <ul className="space-y-1">
                    {feedback.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-indigo-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button */}
              <Button
                variant="gradient"
                fullWidth
                onClick={onClose}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Lanjutkan
              </Button>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}