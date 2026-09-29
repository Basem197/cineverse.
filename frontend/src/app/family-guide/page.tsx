// Path: cineverse/frontend/src/app/family-guide/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Flame, Skull, Eye, MessageSquare, Wine, ArrowLeft, ArrowRight, Loader2, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getPosterUrl, DEFAULT_POSTER } from "@/utils/imageUtils";
import { translateFamilyMetric, translateTitleName } from "@/utils/translations";

interface FamilyGuideCardData {
  id: number;
  title: string;
  release_year: string;
  poster_path: string;
  age: string;
  overallVerdict: string;
  violence: string;
  fear: string;
  sexualContent: string;
  language: string;
  drugs: string;
  parentNote: string;
}

export default function FamilyGuidePage() {
  const { lang, dir, t } = useLanguage();
  const [guides, setGuides] = useState<FamilyGuideCardData[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: "all", label: t.tabAllAges },
    { key: "G", label: t.tabGeneral },
    { key: "+7", label: t.tabKids7 },
    { key: "+13", label: t.tabTeens13 },
    { key: "+16", label: t.tabGuidance16 },
    { key: "+18", label: t.tabAdults18 },
  ];

  useEffect(() => {
    async function loadGuides() {
      setLoading(true);
      try {
        const query = selectedAge !== "all" ? `?age=${encodeURIComponent(selectedAge)}` : "";
        const res = await fetch(`https://whole-tables-divide.loca.lt/cineverse/public/api/family-guides${query}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setGuides(json.data);
        } else {
          setGuides([]);
        }
      } catch (err) {
        console.error("فشل جلب دليل العائلة:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGuides();
  }, [selectedAge]);

  const getMetricBadgeStyle = (level: string) => {
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

  return (
    <main className="min-h-screen bg-[#07090e] text-white py-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* هيدر الصفحة */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.navFamilyGuide}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {t.familyGuideMainTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {t.familyGuideMainSub}
          </p>
        </div>

        {/* أزرار الفلترة حسب الفئة العمرية */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedAge(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedAge === tab.key
                  ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/15"
                  : "bg-[#0f141f] text-gray-300 border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* عرض بطاقات الأفلام وتقارير الرقابة */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs text-gray-400">{lang === "ar" ? "جاري تحميل الدليل..." : "Loading family guide..."}</span>
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-16 bg-[#0f141f] rounded-3xl border border-white/5 p-8 text-gray-400 text-xs">
            {lang === "ar" ? "لا توجد أعمال في هذا التصنيف حالياً." : "No titles found under this category."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((item) => (
              <div
                key={item.id}
                className="bg-[#0f141f] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-xl space-y-4"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={getPosterUrl(item.poster_path)}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                    }}
                    className="w-20 sm:w-24 aspect-[2/3] object-cover rounded-2xl bg-black/60 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-black font-black text-[11px]">
                        {item.age}
                      </span>
                      <span className="text-xs text-cyan-400 font-bold">
                        {translateFamilyMetric(item.overallVerdict, lang)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white truncate">
                      {translateTitleName(item.title, lang)}
                    </h3>

                    <span className="text-[11px] text-gray-400">
                      {t.releaseYearLabel} {item.release_year}
                    </span>
                  </div>
                </div>

                {/* شبكة المؤشرات الخمسة */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-gray-400">{t.violenceLabel}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold border mt-1 text-center ${getMetricBadgeStyle(item.violence)}`}>
                      {translateFamilyMetric(item.violence, lang)}
                    </span>
                  </div>

                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-gray-400">{t.fearLabel}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold border mt-1 text-center ${getMetricBadgeStyle(item.fear)}`}>
                      {translateFamilyMetric(item.fear, lang)}
                    </span>
                  </div>

                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-gray-400">{t.sensitiveScenesLabel}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold border mt-1 text-center ${getMetricBadgeStyle(item.sexualContent)}`}>
                      {translateFamilyMetric(item.sexualContent, lang)}
                    </span>
                  </div>

                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-gray-400">{t.profanityLabel}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold border mt-1 text-center ${getMetricBadgeStyle(item.language)}`}>
                      {translateFamilyMetric(item.language, lang)}
                    </span>
                  </div>

                  <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-gray-400">{t.drugsLabel}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold border mt-1 text-center ${getMetricBadgeStyle(item.drugs)}`}>
                      {translateFamilyMetric(item.drugs, lang)}
                    </span>
                  </div>
                </div>

                {/* ملاحظة الآباء */}
                <div className="bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl text-xs text-gray-300 leading-relaxed">
                  {translateFamilyMetric(item.parentNote, lang)}
                </div>

                {/* زر الانتقال لصفحة العمل */}
                <Link
                  href={`/title/${item.id}`}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 hover:text-amber-400 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>{t.familyCardCta}</span>
                  {dir === "rtl" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}