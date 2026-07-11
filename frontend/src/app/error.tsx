"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="text-4xl font-bold gradient-text mb-4">Terjadi Kesalahan</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
        </p>
        <Button
          variant="gradient"
          onClick={reset}
          leftIcon={<RefreshCw className="h-5 w-5" />}
        >
          Coba Lagi
        </Button>
      </motion.div>
    </div>
  );
}