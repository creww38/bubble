"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, Brain, Award, BarChart3,
  Users, Settings, LogOut, Menu, X, Sun, Moon,
  MessageCircle, Bell, ChevronLeft, ChevronRight,
  User, GraduationCap, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useThemeStore } from "@/stores/theme-store";
import { useUIStore } from "@/stores/ui-store";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { user, logout, isStudent, isTeacher, isAdmin } = useAuth();
  const { theme, setTheme } = useThemeStore();
  const { sidebarOpen, setSidebarOpen, notificationCount } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    ...(isStudent ? [
      { name: "Dashboard", href: "/student", icon: Home },
      { name: "Simulasi", href: "/simulations", icon: BookOpen },
      { name: "Quiz", href: "/quiz", icon: Brain },
      { name: "Pencapaian", href: "/achievements", icon: Award },
      { name: "AI Mentor", href: "/ai-mentor", icon: MessageCircle },
    ] : []),
    ...(isTeacher ? [
      { name: "Dashboard", href: "/teacher", icon: Home },
      { name: "Kelas Saya", href: "/classes", icon: Users },
      { name: "Materi", href: "/materials", icon: BookOpen },
      { name: "Analitik", href: "/analytics", icon: BarChart3 },
    ] : []),
    ...(isAdmin ? [
      { name: "Dashboard", href: "/admin", icon: Shield },
      { name: "Manajemen User", href: "/admin/users", icon: Users },
      { name: "Sekolah", href: "/admin/schools", icon: GraduationCap },
      { name: "Sistem", href: "/admin/system", icon: Settings },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar Toggle */}
            <button
              className="hidden lg:block p-2 rounded-lg hover:bg-white/20"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🫧</span>
              <span className="font-bold text-lg gradient-text hidden sm:block">BUBBLE</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-white/20"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-white/20 relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.fullName || 'User'}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-white/20 text-slate-500"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] glass border-r border-white/20 overflow-hidden"
            >
              <nav className="p-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium"
                            : "text-slate-600 dark:text-slate-400 hover:bg-white/20"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* User Info at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="lg:hidden fixed inset-0 z-40"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
              <div className="relative w-72 h-full glass border-r border-white/20 p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl">🫧</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          pathname === item.href
                            ? "bg-indigo-500/20 text-indigo-600"
                            : "text-slate-600 hover:bg-white/20"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}