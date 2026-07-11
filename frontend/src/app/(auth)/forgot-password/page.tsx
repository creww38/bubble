"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Mohon masukkan email");
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success("Link reset password telah dikirim ke email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim email");
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
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🔑</div>
                <h1 className="text-2xl font-bold gradient-text">Lupa Password?</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Masukkan email kamu, kami akan kirim link reset password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  fullWidth
                  size="lg"
                  loading={loading}
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Kirim Link Reset
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-xl font-bold mb-2">Email Terkirim!</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Silakan cek email kamu ({email}) untuk link reset password.
                Link berlaku selama 1 jam.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  Tidak menerima email?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSent(false)}
                >
                  Kirim Ulang
                </Button>
              </div>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Login
                </Link>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}