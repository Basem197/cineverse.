// Path: cineverse/frontend/src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Star, 
  Tv, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  Clock,
  Sparkles, 
  Loader2 
} from "lucide-react";
import { Title } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { 
  getPosterUrl, 
  getBackdropUrl, 
  getProviderLogoUrl, 
  DEFAULT_POSTER, 
  DEFAULT_BACKDROP 
} from "@/utils/imageUtils";
import { 
  translateTitleName, 
  translateTitleOverview, 
  translateProviderName 
} from "@/utils/translations";

export default function HomePage() {
  const { lang, dir, t } = useLanguage();
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);

  const platformNames = [
    "Shahid VIP", 
    "WATCH IT", 
    "Netflix", 
    "OSN+", 
    "Prime Video", 
    "Disney+"
  ];

  useEffect(() => {
    async function loadLatest() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1/cineverse/public/api/titles?limit=12`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTitles(json.data);
        } else {
          setTitles([]);
        }
      } catch (err) {
        console.error("فشل جلب الأفلام:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLatest();
  }, []);

  const featured = titles[0] || null;
  const trending = titles.slice(1, 9);
  const topRated = [...titles].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-20 overflow-hidden" dir={dir}>
      
      {/* 1. العمل المميز اليوم في الشرق الأوسط (Featured Hero Banner) */}
      {featured && (
        <section className="relative w-full min-h-[500px] lg:min-h-[560px] flex items-center border-b border-white/5 overflow-hidden">
          <img
            src={getBackdropUrl(featured.backdrop_path)}
            alt={featured.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_BACKDROP;
            }}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/75 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
            <div className="max-w-3xl space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.featuredTitleBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                {translateTitleName(featured.title, lang)}
              </h1>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {Number(featured.rating).toFixed(1)} / 10
                </span>
                <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300">
                  {featured.release_year || "2026"}
                </span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-1 rounded-lg">
                  {t.digitallyLicensed}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 max-w-2xl">
                {translateTitleOverview(featured.description, featured.title, lang)}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/title/${featured.id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <Tv className="w-4 h-4" />
                  <span>{t.whereToWatchCta}</span>
                </Link>

                <Link
                  href="/family-guide"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{t.navFamilyGuide}</span>
                </Link>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. شريط مميزات المنصة الرئيسية */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f141f] border border-white/10 flex items-start gap-3.5 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">{t.homeFeaturesLegalTitle}</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">{t.homeFeaturesLegalDesc}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f141f] border border-white/10 flex items-start gap-3.5 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">{t.homeFeaturesCoverageTitle}</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">{t.homeFeaturesCoverageDesc}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f141f] border border-white/10 flex items-start gap-3.5 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">{t.homeFeaturesFamilyTitle}</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">{t.homeFeaturesFamilyDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. الأكثر رواجاً في منطقتك (Trending) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{t.trendingSectionTitle}</h2>
            <p className="text-xs text-gray-400 mt-1">{t.trendingSectionSub}</p>
          </div>

          <Link
            href="/titles"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
          >
            <span>{t.viewAllCatalogBtn}</span>
            {dir === "rtl" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs text-gray-400">{lang === "ar" ? "جاري تحميل الأعمال..." : "Loading titles..."}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((item) => (
              <Link
                key={item.id}
                href={`/title/${item.id}`}
                className="group bg-[#0f141f] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col shadow-lg"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-black/60 relative">
                  <img
                    src={getPosterUrl(item.poster_path)}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{Number(item.rating).toFixed(1)}</span>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded">
                    {t.officialLicensed}
                  </span>
                </div>

                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {translateTitleName(item.title, lang)}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {translateTitleOverview(item.description, item.title, lang)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                    <span>{t.whereToWatchCard}</span>
                    {dir === "rtl" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. قسم مميزات المنصة (لماذا تختار CineVerse؟) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-3xl font-black text-white">
            {lang === "ar" ? "لماذا CineVerse؟" : "Why CineVerse?"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            {lang === "ar"
              ? "اكتشف ما يجعل CineVerse وجهتك لمشاهدة المحتوى بثقة."
              : "Discover what makes CineVerse your trusted destination for finding what to watch."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0f141f] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.homeFeaturesLegalTitle}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{t.homeFeaturesLegalDesc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0f141f] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.homeFeaturesFamilyTitle}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{t.homeFeaturesFamilyDesc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0f141f] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{lang === "ar" ? "تحديثات يومية" : "Daily Updates"}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {lang === "ar"
                ? "نضيف أحدث الأفلام والمسلسلات يوميًا."
                : "New movies and series are added daily."}
            </p>
          </div>
        </div>
      </section>

      {/* 5. قسم المنصات الرسمية المدعومة (بالشعارات المتجهة النقية والترجمة الفورية) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-3xl font-black text-white">{t.footerPlatformsTitle}</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            {lang === "ar"
              ? "استكشف منصات المشاهدة الرسمية المتاحة."
              : "Explore the official streaming platforms available."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {platformNames.map((name, idx) => (
            <div
              key={idx}
              className="bg-[#0f141f] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2.5 hover:border-amber-500/40 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-black/70 p-2 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src={getProviderLogoUrl("", name)}
                  alt={translateProviderName(name, lang)}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-bold text-white truncate max-w-full">
                {translateProviderName(name, lang)}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                {lang === "ar" ? "موثق" : "Verified"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. الأعلى تقييماً نقدياً وجماهيرياً (Top Rated) */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{t.topRatedSectionTitle}</h2>
            <p className="text-xs text-gray-400 mt-1">{t.topRatedSectionSub}</p>
          </div>

          <Link
            href="/titles"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
          >
            <span>{t.moreBtn}</span>
            {dir === "rtl" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {topRated.map((item) => (
            <Link
              key={item.id}
              href={`/title/${item.id}`}
              className="bg-[#0f141f] border border-white/10 rounded-2xl p-3 flex gap-3.5 hover:border-amber-500/40 transition-all group"
            >
              <img
                src={getPosterUrl(item.poster_path)}
                alt={item.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                }}
                className="w-16 h-24 object-cover rounded-xl shrink-0 bg-black/60 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold mb-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{Number(item.rating).toFixed(1)}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors truncate">
                    {translateTitleName(item.title, lang)}
                  </h4>
                  <span className="text-[10px] text-gray-400">{item.release_year || "2026"}</span>
                </div>
                <span className="text-[10px] font-bold text-amber-400">
                  {t.whereToWatchCard}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. بانر دليل العائلة */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-amber-500/15 via-[#0f141f] to-cyan-500/15 border border-white/15 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {lang === "ar" ? "دليل العائلة" : "Family Guide"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              {lang === "ar"
                ? "اكتشف تصنيفات العمر، المؤشرات العائلية، ومحتوى المشاهدة الآمن لكل الاعمار."
                : "Discover age ratings, family indicators, and safe viewing guidance for every age group."}
            </p>
          </div>

          <Link
            href="/family-guide"
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/10 shrink-0 active:scale-95"
          >
            {lang === "ar" ? "فتح الدليل" : "Open Guide"}
          </Link>
        </div>
      </section>

    </main>
  );
}