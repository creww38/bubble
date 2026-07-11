"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Brain, Shield, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "Simulasi Interaktif",
      description: "Belajar melalui simulasi media sosial, chat, dan portal berita yang realistis",
      color: "text-indigo-500",
    },
    {
      icon: Shield,
      title: "Deteksi Bias",
      description: "Kenali 12 jenis bias kognitif dalam informasi sehari-hari",
      color: "text-purple-500",
    },
    {
      icon: BookOpen,
      title: "AI Mentor",
      description: "Dapatkan bimbingan personal dengan metode Socratic dari AI",
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Gamifikasi",
      description: "Kumpulkan XP, naik level, dan dapatkan badge pencapaian",
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              Platform Pembelajaran Digital
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              🫧 BUBBLE
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Bias Understanding Based Blended Learning Environment
            </p>
            
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Platform interaktif untuk meningkatkan literasi digital dan kemampuan 
              berpikir kritis melalui simulasi media digital yang realistis
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  variant="default"
                  size="xl"
                  className="bg-white text-indigo-600 hover:bg-white/90 shadow-xl"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Mulai Belajar Gratis
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  Sudah Punya Akun
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Platform lengkap untuk mengembangkan kemampuan berpikir kritis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="text-center h-full">
                  <div className={`p-4 rounded-full inline-flex ${feature.color} bg-white/50 dark:bg-slate-700/50 mb-4`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Meningkatkan Kemampuan Berpikir Kritis?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Bergabung dengan ribuan siswa yang sudah menggunakan BUBBLE
            </p>
            <Link href="/register">
              <Button
                variant="default"
                size="xl"
                className="bg-white text-indigo-600 hover:bg-white/90"
              >
                Daftar Sekarang - Gratis!
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-white text-center">
        <p className="text-slate-400">
          © 2026 BUBBLE Platform. Dibuat untuk Pendidikan Indonesia.
        </p>
      </footer>
    </div>
  );
}