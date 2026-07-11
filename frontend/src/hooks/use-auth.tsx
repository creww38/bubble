"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
  studentProfile?: any;
  teacherProfile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await authAPI.getProfile();
        const responseData = response.data;
        if (responseData && responseData.data) {
          setUser(responseData.data);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const responseData = response.data;
    if (responseData && responseData.data) {
      localStorage.setItem("accessToken", responseData.data.accessToken);
      localStorage.setItem("refreshToken", responseData.data.refreshToken);
      setUser(responseData.data.user);
    }
  };

  const register = async (registerData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) => {
    await authAPI.register(registerData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
  };

  const value: AuthContextType = {
    user: user,
    loading: loading,
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: user !== null,
    isAdmin: user?.roles?.includes("ADMIN") || false,
    isTeacher: user?.roles?.includes("TEACHER") || false,
    isStudent: user?.roles?.includes("STUDENT") || false,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}