import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(level: number): number {
  return level * level * 100;
}

export function xpProgressInLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const xpForCurrentLevel = (currentLevel - 1) * (currentLevel - 1) * 100;
  const xpForNext = xpForNextLevel(currentLevel);
  return Math.round(((xp - xpForCurrentLevel) / (xpForNext - xpForCurrentLevel)) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getBiasColor(biasType: string): string {
  const colors: Record<string, string> = {
    CONFIRMATION_BIAS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    ANCHORING_BIAS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    AVAILABILITY_BIAS: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    HALO_EFFECT: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    BANDWAGON_EFFECT: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    AUTHORITY_BIAS: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    FRAMING_EFFECT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    SURVIVORSHIP_BIAS: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    SELECTION_BIAS: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    FALSE_CONSENSUS: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
    HINDSIGHT_BIAS: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    OUTCOME_BIAS: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  };
  return colors[biasType] || 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
}

export function getBiasLabel(biasType: string): string {
  return biasType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}