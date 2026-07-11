"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, TrendingUp, Award, Target } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { analyticsAPI } from "@/lib/api";

export default function TeacherDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: async () => {
      const { data } = await analyticsAPI.getTeacherDashboard();
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text">Dashboard Guru</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Pantau progress dan aktivitas siswa
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Siswa", value: dashboard?.overview?.totalStudents || 0, icon: Users, color: "text-blue-500" },
            { label: "Rata-rata XP", value: dashboard?.overview?.averageXP || 0, icon: TrendingUp, color: "text-green-500" },
            { label: "Rata-rata Akurasi", value: `${dashboard?.overview?.averageAccuracy || 0}%`, icon: Target, color: "text-purple-500" },
            { label: "Kelas Aktif", value: dashboard?.classes?.length || 0, icon: BookOpen, color: "text-orange-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard padding="md">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Students List */}
        <GlassCard>
          <h2 className="text-lg font-semibold mb-4">Daftar Siswa</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3 text-sm font-medium">Nama</th>
                  <th className="text-left p-3 text-sm font-medium">XP</th>
                  <th className="text-left p-3 text-sm font-medium">Level</th>
                  <th className="text-left p-3 text-sm font-medium">Akurasi</th>
                  <th className="text-left p-3 text-sm font-medium">Interaksi</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.students?.map((student: any, index: number) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-3 font-medium">{student.fullName}</td>
                    <td className="p-3">{student.xp}</td>
                    <td className="p-3">{student.level}</td>
                    <td className="p-3">{student.accuracy}%</td>
                    <td className="p-3">{student.interactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}