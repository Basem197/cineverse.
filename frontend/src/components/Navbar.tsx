// Path: cineverse/frontend/src/components/Navbar.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Film, 
  Search, 
  Globe, 
  Menu, 
  X, 
  User as UserIcon, 
  Star,
  Loader2,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Languages
} from "lucide-react";
import { getWatchlist } from "@/utils/watchlist";
import { useCountry, SUPPORTED_COUNTRIES } from "@/context/CountryContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Title } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { country, setCountry } = useCountry();
  const { lang, setLang, t, dir } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  const [searchResults, setSearchResults] = useState<Title[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlist().length);
    };

    updateCount();
    window.addEventListener("watchlist_changed", updateCount);
    return () => window.removeEventListener("watchlist_changed", updateCount);
  }, []);

  useEffect(() => {
    if (searchVal.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1/cineverse/public/api/titles?search=${encodeURIComponent(searchVal.trim())}&limit=5`
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSearchResults(json.data);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("خطأ في البحث اللحظي:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchVal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setShowDropdown(false);
      router.push(`/titles?search=${encodeURIComponent(searchVal.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: t.navHome },
    { href: "/titles", label: t.navCatalog },
    { href: "/platforms", label: t.navPlatforms },
    { href: "/family-guide", label: t.navFamilyGuide },
    { 
      href: "/watchlist", 
      label: t.navWatchlist, 
      badge: watchlistCount > 0 ? watchlistCount : null 
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#07090e]/85 backdrop-blur-xl border-b border-white/10 text-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. الشعار وروابط التنقل */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/10">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
                CINE<span className="text-amber-400">VERSE</span>
              </span>
              <span className="text-[9px] text-gray-400 -mt-1 font-semibold flex items-center gap-1">
                <span>{t.brandTag}</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black leading-none">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 2. شريط البحث اللحظي */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xs lg:max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchVal}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-[#0f141f] border border-white/10 rounded-xl py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/60 transition-all ${
                dir === "rtl" ? "pr-9 pl-4" : "pl-9 pr-4"
              }`}
            />
            {searchLoading ? (
              <Loader2 className={`w-4 h-4 text-amber-400 absolute top-1/2 -translate-y-1/2 animate-spin ${
                dir === "rtl" ? "right-3" : "left-3"
              }`} />
            ) : (
              <Search className={`w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 ${
                dir === "rtl" ? "right-3" : "left-3"
              }`} />
            )}
          </form>

          {showDropdown && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-[#0f141f] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">
                  {lang === "ar" ? `لم نجد أعمالاً تطابق "${searchVal}"` : `No matches found for "${searchVal}"`}
                </div>
              ) : (
                <div>
                  <div className="p-2 border-b border-white/5 text-[10px] font-bold text-gray-400 px-3 flex justify-between items-center">
                    <span>{t.searchSuggestions}</span>
                    <span className="text-amber-400">{searchResults.length}</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {searchResults.map((item) => {
                      const poster = item.poster_path?.startsWith("http")
                        ? item.poster_path
                        : `https://image.tmdb.org/t/p/w200${item.poster_path}`;

                      return (
                        <Link
                          key={item.id}
                          href={`/title/${item.id}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchVal("");
                          }}
                          className="flex items-center gap-3 p-2.5 hover:bg-white/5 transition-colors group"
                        >
                          <img
                            src={poster}
                            alt={item.title}
                            className="w-9 h-13 object-cover rounded-lg bg-black/50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                              <span>{item.release_year || "Latest"}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-amber-400">
                                <Star className="w-2.5 h-2.5 fill-amber-400" />
                                {Number(item.rating).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          {dir === "rtl" ? (
                            <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-400 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-400 translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold text-center border-t border-white/5 transition-colors block"
                  >
                    {t.searchAll} ({searchVal})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. عناصر التحكم (محدد اللغة + الدولة + الحساب) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* زر تبديل اللغة الفوري (AR / EN) */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-extrabold text-amber-400 transition-all active:scale-95 cursor-pointer"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          {/* محدد الدولة */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0f141f] border border-white/10 px-2.5 py-1.5 rounded-xl text-xs text-gray-300">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0f141f] text-white">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* حالة الحساب */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-amber-400">
                <UserIcon className="w-3.5 h-3.5" />
                <span>{user.name}</span>
              </span>
              <button
                onClick={logout}
                title={t.logout}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10 active:scale-95"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.login}</span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* قائمة الموبايل */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07090e] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-[#0f141f] border border-white/10 rounded-xl py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 ${
                dir === "rtl" ? "pr-9 pl-4" : "pl-9 pr-4"
              }`}
            />
            <Search className={`w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 ${
              dir === "rtl" ? "right-3" : "left-3"
            }`} />
          </form>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>{t.streamingRegion}</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-[#0f141f] border border-white/10 text-amber-400 font-bold px-2 py-1 rounded-lg focus:outline-none"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0f141f] text-white">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}