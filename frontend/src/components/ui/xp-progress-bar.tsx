"use client";

import * as React from "react";
import { cn, formatXP, xpProgressInLevel, xpForNextLevel } from "@/lib/utils";
import { Zap } from "lucide-react";

interface XPProgressBarProps {
  currentXP: number;
  level: number;
  className?: string;
  showDetails?: boolean;
}

export function XPProgressBar({ currentXP, level, className, showDetails = true }: XPProgressBarProps) {
  const progress = Math.min(xpProgressInLevel(currentXP), 100);
  const xpNeeded = xpForNextLevel(level);

  return (
    <div className={cn("space-y-2", className)}>
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">Level {level}</span>
          </div>
          <span className="text-slate-500 dark:text-slate-400">
            {formatXP(currentXP)} / {formatXP(xpNeeded)} XP
          </span>
        </div>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
      {showDetails && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
          {progress}% menuju Level {level + 1}
        </p>
      )}
    </div>
  );
}