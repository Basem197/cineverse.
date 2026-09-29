// Path: cineverse/frontend/src/context/CountryContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  { code: "EG", name: "مصر", flag: "🇪🇬" },
  { code: "SA", name: "السعودية", flag: "🇸🇦" },
  { code: "AE", name: "الإمارات", flag: "🇦🇪" },
];

interface CountryContextType {
  country: string;
  setCountry: (code: string) => void;
  countryInfo: CountryInfo;
}

const CountryContext = createContext<CountryContextType>({
  country: "EG",
  setCountry: () => {},
  countryInfo: SUPPORTED_COUNTRIES[0],
});

const STORAGE_KEY = "cineverse_user_country";

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<string>("EG");

  // استرجاع الدولة المحفوظة للمستخدم
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_COUNTRIES.some((c) => c.code === saved)) {
        setCountryState(saved);
      }
    } catch {}
  }, []);

  const setCountry = (newCountry: string) => {
    setCountryState(newCountry);
    try {
      localStorage.setItem(STORAGE_KEY, newCountry);
    } catch {}
  };

  const currentCountryInfo =
    SUPPORTED_COUNTRIES.find((c) => c.code === country) || SUPPORTED_COUNTRIES[0];

  return (
    <CountryContext.Provider
      value={{
        country,
        setCountry,
        countryInfo: currentCountryInfo,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}