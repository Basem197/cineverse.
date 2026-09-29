// Path: cineverse/frontend/src/components/Providers.tsx
"use client";

import React from "react";
import { CountryProvider } from "@/context/CountryContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CountryProvider>{children}</CountryProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}