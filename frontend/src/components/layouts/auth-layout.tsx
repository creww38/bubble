"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-8xl mb-6">🫧</div>
            <h1 className="text-4xl font-bold mb-4">BUBBLE</h1>
            <p className="text-xl opacity-90 mb-8">
              Bias Understanding Based<br />Blended Learning Environment
            </p>
            <p className="text-lg opacity-80 max-w-md mx-auto">
              Platform interaktif untuk meningkatkan literasi digital dan 
              kemampuan berpikir kritis
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">🫧</span>
            <h1 className="text-2xl font-bold gradient-text mt-2">BUBBLE</h1>
          </div>

          {title && (
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400 mb-6">{subtitle}</p>
          )}

          {children}
        </motion.div>
      </div>
    </div>
  );
}