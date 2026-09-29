// Path: cineverse/frontend/src/components/TitleDetailsClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Bookmark, 
  ArrowRight, 
  ArrowLeft,
  Globe, 
  Flame, 
  Skull, 
  Eye, 
  MessageSquare, 
  Wine, 
  AlertTriangle,
  Tv
} from "lucide-react";
import { Title } from "@/types";
import { isInWatchlist, toggleWatchlist } from "@/utils/watchlist";
import { useCountry, SUPPORTED_COUNTRIES } from "@/context/CountryContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getProviderLogoUrl, getFallbackLogo } from "@/utils/imageUtils";

interface AvailabilityItem {
  provider_name: string;
  provider_logo: string;
  country_code: string;
  country_name: string;
  availability_type: string;
  official_url: string;
  affiliate_url: string | null;
  verified_at: string;
}

interface FamilyGuideData {
  age_recommendation: string;
  overall_level: string;
  violence: string;
  sexual_content: string;
  language: string;
  fear: string;
  drugs: string;
  parent_note: string;
}

export default function TitleDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { country: selectedCountry, setCountry: setSelectedCountry } = useCountry();
  const { t, dir, lang } = useLanguage();

  const [title, setTitle] = useState<Title | null>(null);
  const [availabilities, setAvailabilities] = useState<AvailabilityItem[]>([]);
  const [familyGuide, setFamilyGuide] = useState<FamilyGuideData | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // جلب تفاصيل العمل
  useEffect(() => {
    if (!id) return;

    async function fetchTitleDetails() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1/cineverse/public/api/title/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setTitle(json.data);
          setSaved(isInWatchlist(Number(id)));
        }
      } catch (err) {
        console.error("خطأ أثناء جلب تفاصيل العمل:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTitleDetails();
  }, [id]);

  // جلب منصات المشاهدة بحسب الدولة
  useEffect(() => {
    if (!id) return;

    async function fetchAvailability() {
      try {
        const res = await fetch(
          `http://127.0.0.1/cineverse/public/api/titles/${id}/availability?country=${selectedCountry}`
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAvailabilities(json.data);
        } else {
          setAvailabilities([]);
        }
      } catch (err) {
        console.error("خطأ أثناء جلب توفر المنصات:", err);
        setAvailabilities([]);
      }
    }

    fetchAvailability();
  }, [id, selectedCountry]);

  // جلب تقرير الرقابة الأبوية
  useEffect(() => {
    if (!id) return;

    async function fetchGuide() {
      try {
        const res = await fetch(`http://127.0.0.1/cineverse/public/api/titles/${id}/family-guide`);
        const json = await res.json();
        if (json.success && json.data) {
          setFamilyGuide(json.data);
        }
      } catch (err) {
        console.error("خطأ أثناء جلب دليل العائلة:", err);
      }
    }

    fetchGuide();
  }, [id]);

  // تبديل وحفظ العمل في المفضلة (محلياً وسحابياً)
  const handleBookmark = async () => {
    if (!title) return;
    const newState = toggleWatchlist(title);
    setSaved(newState);

    if (user) {
      try {
        await fetch("http://127.0.0.1/cineverse/public/api/user/watchlist/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            title_id: title.id,
          }),
        });
      } catch (e) {
        console.error("فشل مزامنة القائمة السحابية:", e);
      }
    }
  };

  // تتبع النقرات والتحويل لرابط المنصة
  const handleAffiliateClick = async (affUrl: string, officialUrl: string) => {
    try {
      fetch("http://127.0.0.1/cineverse/public/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title_id: Number(id),
          provider_id: null,
        }),
      });
    } catch {}

    window.open(affUrl || officialUrl, "_blank", "noopener,noreferrer");
  };

  const getMetricStyle = (level: string) => {
    switch (level) {
      case "منعدم":
      case "None":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "خفيف":
      case "Mild":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "متوسط":
      case "Moderate":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "شديد":
      case "حرج":
      case "Severe":
      case "Critical":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-gray-300 bg-white/5 border-white/10";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center" dir={dir}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400">{lang === "ar" ? "جاري تحميل بيانات العمل..." : "Loading title..."}</span>
        </div>
      </main>
    );
  }

  if (!title) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4" dir={dir}>
        <h2 className="text-xl font-bold mb-2">{lang === "ar" ? "العمل السينمائي غير موجود" : "Title Not Found"}</h2>
        <Link
          href="/titles"
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
        >
          {t.exploreCatalog}
        </Link>
      </main>
    );
  }

  const backdropUrl = title.backdrop_path?.startsWith("http")
    ? title.backdrop_path
    : title.backdrop_path
    ? `https://image.tmdb.org/t/p/original${title.backdrop_path}`
    : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80";

  const posterUrl = title.poster_path?.startsWith("http")
    ? title.poster_path
    : title.poster_path
    ? `https://image.tmdb.org/t/p/w500${title.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-24" dir={dir}>
      
      {/* 1. البانر السينمائي */}
      <section className="relative w-full h-[55vh] min-h-[420px] max-h-[580px] overflow-hidden">
        <img
          src={backdropUrl}
          alt={title.title}
          className="w-full h-full object-cover object-center filter brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/70 to-transparent" />

        <div className={`absolute top-6 z-20 ${dir === "rtl" ? "right-6" : "left-6"}`}>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
          >
            {dir === "rtl" ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t.back}</span>
          </button>
        </div>
      </section>

      {/* 2. بطاقة وتفاصيل العمل */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-10">
        
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          
          <div className="w-48 sm:w-60 md:w-72 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-black/60">
            <img
              src={posterUrl}
              alt={title.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 pt-2 md:pt-12">
            
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-xs backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{Number(title.rating).toFixed(1)} / 10</span>
              </span>

              {title.release_year && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs text-gray-300">
                  {title.release_year}
                </span>
              )}

              {familyGuide?.age_recommendation && (
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold px-3 py-1 rounded-xl text-xs">
                  {familyGuide.age_recommendation}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {title.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
              {title.description || t.noOverview}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                  saved
                    ? "bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/20"
                    : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-black" : ""}`} />
                <span>{saved ? t.inWatchlist : t.addToWatchlist}</span>
              </button>
            </div>

          </div>
        </div>

        {/* 3. منصات البث المعتمدة مع معالجة الصور البديلة */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.whereToWatch}</h2>
                <p className="text-xs text-gray-400">{t.legalStreamingSub}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0f141f] border border-white/10 px-3 py-1.5 rounded-xl text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-transparent text-gray-200 focus:outline-none cursor-pointer"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0f141f] text-white">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {availabilities.length === 0 ? (
            <div className="bg-[#0f141f] rounded-2xl p-6 border border-white/5 text-center text-gray-400 text-xs">
              <p>{t.notAvailableInCountry}</p>
              <p className="text-[11px] text-gray-500 mt-1">{t.autoUpdateDaily}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availabilities.map((item, idx) => {
                const logoSrc = getProviderLogoUrl(item.provider_logo, item.provider_name);

                return (
                  <div
                    key={idx}
                    className="bg-[#0f141f] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-amber-500/40 transition-all shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={logoSrc}
                          alt={item.provider_name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getFallbackLogo(item.provider_name);
                          }}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.provider_name}</h4>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-semibold">
                          {item.availability_type === "subscription" ? t.subscription : t.rentBuy}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAffiliateClick(item.affiliate_url || item.official_url, item.official_url)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>{t.watchNow}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. تقرير الرقابة العائلية */}
        {familyGuide && (
          <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.familyGuideTitle}</h3>
                  <p className="text-xs text-gray-400">{familyGuide.overall_level}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl bg-amber-500 text-black font-black text-xs">
                {familyGuide.age_recommendation}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                <span className="flex items-center gap-1 text-gray-400">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {t.violence}:
                </span>
                <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${getMetricStyle(familyGuide.violence)}`}>
                  {familyGuide.violence}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                <span className="flex items-center gap-1 text-gray-400">
                  <Skull className="w-3.5 h-3.5 text-amber-400" />
                  {t.fear}:
                </span>
                <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${getMetricStyle(familyGuide.fear)}`}>
                  {familyGuide.fear}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                <span className="flex items-center gap-1 text-gray-400">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  {t.sexualContent}:
                </span>
                <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${getMetricStyle(familyGuide.sexual_content)}`}>
                  {familyGuide.sexual_content}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                <span className="flex items-center gap-1 text-gray-400">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  {t.languageMetric}:
                </span>
                <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${getMetricStyle(familyGuide.language)}`}>
                  {familyGuide.language}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                <span className="flex items-center gap-1 text-gray-400">
                  <Wine className="w-3.5 h-3.5 text-amber-400" />
                  {t.drugs}:
                </span>
                <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${getMetricStyle(familyGuide.drugs)}`}>
                  {familyGuide.drugs}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 leading-relaxed">
                {familyGuide.parent_note}
              </p>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}