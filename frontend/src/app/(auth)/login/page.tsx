"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Mohon isi semua field");
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login berhasil!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard padding="lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🫧</div>
            <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Login ke akun BUBBLE kamu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Ingat saya</span>
              </label>
              <Link href="/forgot-password" className="text-indigo-600 hover:underline">
                Lupa Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="gradient"
              fullWidth
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Login
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}