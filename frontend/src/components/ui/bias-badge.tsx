"use client";

import * as React from "react";
import { cn, getBiasColor, getBiasLabel } from "@/lib/utils";
import { 
  AlertTriangle, Shield, Zap, Eye, Users, Star, Target, 
  TrendingUp, Filter, Brain, History, Award 
} from "lucide-react";

const biasIcons: Record<string, React.ComponentType<any>> = {
  CONFIRMATION_BIAS: Shield,
  ANCHORING_BIAS: Target,
  AVAILABILITY_BIAS: Zap,
  HALO_EFFECT: Star,
  BANDWAGON_EFFECT: Users,
  AUTHORITY_BIAS: Eye,
  FRAMING_EFFECT: AlertTriangle,
  SURVIVORSHIP_BIAS: TrendingUp,
  SELECTION_BIAS: Filter,
  FALSE_CONSENSUS: Users,
  HINDSIGHT_BIAS: History,
  OUTCOME_BIAS: Award,
};

interface BiasBadgeProps {
  type: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BiasBadge({ type, className, showIcon = true, size = "sm" }: BiasBadgeProps) {
  const Icon = biasIcons[type] || Brain;
  const colorClass = getBiasColor(type);
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(size === "lg" ? "h-4 w-4" : "h-3 w-3")} />}
      {getBiasLabel(type)}
    </span>
  );
}