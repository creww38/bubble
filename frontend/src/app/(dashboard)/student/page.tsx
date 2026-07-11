"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp, Star, Target, Zap, BookOpen, Brain,
  Trophy, Award, Clock, ArrowRight, Flame
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { XPProgressBar } from "@/components/ui/xp-progress-bar";
import { gamificationAPI, simulationsAPI, analyticsAPI } from "@/lib/api";
import { formatXP } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['student-progress'],
    queryFn: async () => {
      const { data } = await gamificationAPI.getProgress();
      return data.data;
    },
  });

  const { data: badges } = useQuery({
    queryKey: ['student-badges'],
    queryFn: async () => {
      const { data } = await gamificationAPI.getBadges();
      return data.data;
    },
  });

  const { data: simProgress } = useQuery({
    queryKey: ['sim-progress'],
    queryFn: async () => {
      const { data } = await simulationsAPI.getProgress();
      return data.data;
    },
  });

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total XP",
      value: formatXP(progress?.xp || 0),
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      label: "Level",
      value: progress?.level || 1,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Akurasi",
      value: `${simProgress?.accuracy || 0}%`,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Streak",
      value: `${progress?.streak || 0} hari`,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const recentSimulations = [
    { id: "1", title: "Instagram Bias Detection", type: "INSTAGRAM", difficulty: 1 },
    { id: "2", title: "Twitter News Analysis", type: "TWITTER", difficulty: 2 },
    { id: "3", title: "WhatsApp Chain Message", type: "WHATSAPP", difficulty: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text">
            Selamat Datang! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Lanjutkan perjalanan belajarmu hari ini
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard padding="md">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP Progress */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  Progress XP
                </h2>
                <span className="text-sm text-slate-500">
                  Level {progress?.level || 1}
                </span>
              </div>
              <XPProgressBar
                currentXP={progress?.xp || 0}
                level={progress?.level || 1}
              />
            </GlassCard>

            {/* Recent Simulations */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Simulasi Tersedia
              </h2>
              <div className="space-y-3">
                {recentSimulations.map((sim, index) => (
                  <motion.div
                    key={sim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/instagram/${sim.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                          {sim.title.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{sim.title}</p>
                          <p className="text-xs text-slate-500">
                            Difficulty: {"⭐".repeat(sim.difficulty)}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/simulations">
                  <Button variant="outline" fullWidth size="sm">
                    Lihat Semua Simulasi
                  </Button>
                </Link>
              </div>
            </GlassCard>

            {/* Learning Stats */}
            {simProgress && (
              <GlassCard>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Statistik Pembelajaran
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{simProgress.totalInteractions || 0}</p>
                    <p className="text-xs text-slate-500">Total Interaksi</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{simProgress.correctInteractions || 0}</p>
                    <p className="text-xs text-slate-500">Jawaban Benar</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{simProgress.accuracy || 0}%</p>
                    <p className="text-xs text-slate-500">Akurasi</p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Badge
              </h2>
              {badges && badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {badges.map((badge: any) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.1 }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl mb-1">
                        🏆
                      </div>
                      <p className="text-xs font-medium">{badge.name}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  Selesaikan tantangan untuk mendapatkan badge
                </p>
              )}
            </GlassCard>

            {/* Daily Challenge */}
            <GlassCard glow className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Tantangan Harian
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Identifikasi 3 berita misinformasi hari ini dan dapatkan 50 XP!
              </p>
              <Button variant="gradient" fullWidth size="sm">
                Mulai Tantangan
              </Button>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Ringkasan
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Level Saat Ini</span>
                  <span className="font-semibold">{progress?.level || 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">XP Dibutuhkan</span>
                  <span className="font-semibold">{formatXP(progress?.xpToNextLevel || 100)} XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Skor</span>
                  <span className="font-semibold">{progress?.totalScore || 0}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}