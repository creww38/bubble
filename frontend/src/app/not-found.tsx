"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-9xl mb-6">🫧</div>
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
          Halaman tidak ditemukan
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="gradient" leftIcon={<Home className="h-5 w-5" />}>
              Kembali ke Beranda
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Kembali
          </Button>
        </div>
      </motion.div>
    </div>
  );
}