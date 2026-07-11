"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative w-full max-w-[390px]">
        {/* Phone Frame */}
        <div className="relative rounded-[3rem] border-4 border-slate-800 dark:border-slate-600 bg-slate-900 dark:bg-slate-800 shadow-2xl overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-1/3 h-7 bg-black rounded-b-2xl" />
          
          {/* Status Bar */}
          <div className="relative z-10 flex justify-between items-center px-6 pt-2 pb-1 bg-white dark:bg-slate-900 text-xs font-medium">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-current" />
              <div className="w-1 h-3 rounded-sm bg-current" />
            </div>
          </div>

          {/* Content */}
          <div className="relative bg-white dark:bg-slate-900 min-h-[700px] max-h-[800px] overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-400 dark:bg-slate-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}