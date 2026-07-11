"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users, BookOpen, TrendingUp, Activity, School,
  Shield, Database, Settings, BarChart3, PieChart
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { analyticsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await analyticsAPI.getDashboard();
      return data.data;
    },
  });

  const { data: commonBiases } = useQuery({
    queryKey: ['common-biases'],
    queryFn: async () => {
      const { data } = await analyticsAPI.getCommonBiases();
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

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Total Siswa", value: stats?.totalStudents || 0, icon: Users, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Total Guru", value: stats?.totalTeachers || 0, icon: School, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Total Simulasi", value: stats?.totalSimulations || 0, icon: BookOpen, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
    { label: "Interaksi", value: stats?.totalInteractions || 0, icon: Activity, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
    { label: "Akurasi Rata-rata", value: "78%", icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Kelola platform dan pantau aktivitas pengguna
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" leftIcon={<Settings className="h-4 w-4" />}>
              Pengaturan
            </Button>
            <Button variant="gradient" size="sm" leftIcon={<Database className="h-4 w-4" />}>
              Backup Database
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard padding="md" hover>
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-xl ${stat.bg} mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Tambah User", icon: Users, color: "bg-blue-500" },
                  { label: "Tambah Sekolah", icon: School, color: "bg-green-500" },
                  { label: "Tambah Simulasi", icon: BookOpen, color: "bg-purple-500" },
                  { label: "Tambah Quiz", icon: BarChart3, color: "bg-orange-500" },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${action.color} text-white rounded-xl p-4 text-center hover:opacity-90 transition`}
                  >
                    <action.icon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </GlassCard>

            {/* User Management */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Manajemen User
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-3 text-sm font-medium">Nama</th>
                      <th className="text-left p-3 text-sm font-medium">Email</th>
                      <th className="text-left p-3 text-sm font-medium">Role</th>
                      <th className="text-left p-3 text-sm font-medium">Status</th>
                      <th className="text-left p-3 text-sm font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Admin Utama", email: "admin@bubble.edu", role: "ADMIN", status: "Active" },
                      { name: "Budi Santoso", email: "budi@email.com", role: "TEACHER", status: "Active" },
                      { name: "Siti Nurhaliza", email: "siti@email.com", role: "STUDENT", status: "Active" },
                      { name: "Ahmad Rizki", email: "ahmad@email.com", role: "STUDENT", status: "Inactive" },
                    ].map((user, index) => (
                      <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="p-3 font-medium">{user.name}</td>
                        <td className="p-3 text-sm text-slate-600">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                            user.role === 'TEACHER' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 text-xs ${
                            user.status === 'Active' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon-sm">✏️</Button>
                            <Button variant="ghost" size="icon-sm">🗑️</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Common Biases */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-500" />
                Bias Paling Sering Muncul
              </h2>
              <div className="space-y-3">
                {commonBiases?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-8">#{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.biasType?.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${Math.min((item.count / (commonBiases?.[0]?.count || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Status Sistem
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Database", status: "Online", color: "text-green-500" },
                  { label: "Redis Cache", status: "Online", color: "text-green-500" },
                  { label: "Storage (R2)", status: "Online", color: "text-green-500" },
                  { label: "AI Service", status: "Operational", color: "text-green-500" },
                  { label: "Email Service", status: "Operational", color: "text-green-500" },
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{service.label}</span>
                    <span className={`text-xs font-medium ${service.color} flex items-center gap-1`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
              <div className="space-y-3">
                {[
                  { action: "User baru terdaftar", time: "2 menit lalu", user: "Siti Nurhaliza" },
                  { action: "Simulasi baru dibuat", time: "15 menit lalu", user: "Budi Santoso" },
                  { action: "Quiz diselesaikan", time: "1 jam lalu", user: "Ahmad Rizki" },
                  { action: "Badge diberikan", time: "2 jam lalu", user: "Dewi Kartika" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-slate-500">
                        {activity.user} · {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* System Settings Quick Links */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4">Pengaturan Cepat</h2>
              <div className="space-y-2">
                {[
                  { label: "Manajemen Role & Permission", icon: Shield },
                  { label: "Konfigurasi Email", icon: Mail },
                  { label: "Backup & Restore", icon: Database },
                  { label: "Log Aktivitas", icon: Activity },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition text-left"
                  >
                    <item.icon className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}