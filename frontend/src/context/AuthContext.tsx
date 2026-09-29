// Path: cineverse/frontend/src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Title } from "@/types";
import { getWatchlist } from "@/utils/watchlist";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  syncWatchlistWithCloud: (userId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  syncWatchlistWithCloud: async () => {},
});

const USER_STORAGE_KEY = "cineverse_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // استعادة جلسة المستخدم من المتصفح
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // مزامنة القائمة المحلية مع السحابة
  const syncWatchlistWithCloud = async (userId: number) => {
    try {
      // 1. جلب قائمة المشاهدة من السيرفر
      const res = await fetch(`http://127.0.0.1/cineverse/public/api/user/watchlist?user_id=${userId}`);
      const json = await res.json();
      
      if (json.success && Array.isArray(json.data)) {
        const cloudItems: Title[] = json.data;
        const localItems: Title[] = getWatchlist();

        // دمج السحابي مع المحلي بدون تكرار
        const mergedMap = new Map<number, Title>();
        cloudItems.forEach((item) => mergedMap.set(item.id, item));
        localItems.forEach((item) => {
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
            // رفع العنصر المحلي الذي لم يكن في السحابة
            fetch("http://127.0.0.1/cineverse/public/api/user/watchlist/toggle", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: userId, title_id: item.id }),
            }).catch(() => {});
          }
        });

        const mergedList = Array.from(mergedMap.values());
        localStorage.setItem("cineverse_watchlist", JSON.stringify(mergedList));
      }
    } catch (e) {
      console.error("خطأ أثناء مزامنة المفضلة السحابية:", e);
    }
  };

  const login = async (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch {}
    await syncWatchlistWithCloud(userData.id);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, syncWatchlistWithCloud }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}