"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "p-0",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = false, glow = false, padding = "md", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/20",
          "bg-white/30 dark:bg-slate-800/30",
          "backdrop-blur-xl backdrop-saturate-150",
          "shadow-lg shadow-black/5 dark:shadow-black/20",
          paddingMap[padding],
          hover && "glass-hover cursor-pointer",
          glow && "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-indigo-500/20 before:to-purple-500/20 before:blur-xl",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { scale: 1.02 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };