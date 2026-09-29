// Path: cineverse/frontend/src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Play, 
  Info, 
  Flame, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Tv, 
  Users 
} from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { getTitles } from "@/services/api";
import { Title } from "@/types";

export default function HomePage() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);

  // عمل افتراضي لقسم الهيرو في حال تأخر الاستجابة
  const fallbackHero: Title = {
    id: 1,
    title: "Oppenheimer",
    release_year: 2023,
    rating: 8.9,
    poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80",
    description: "قصة الفيزيائي جيه. روبرت أوبنهايمر ومشروع مانهاتن السري لصناعة القنبلة الذرية، مع التداعيات السياسية والأخلاقية التي غيرت العالم.",
  };

  useEffect(() => {
    async function loadHomeData() {
      try {
        const res = await getTitles({ limit: 20 });
        let list: Title[] = [];

        // استخراج مصفوفة الأعمال بمرونة
        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        }

        if (list.length > 0) {
          setTitles(list);
        }
      } catch (err) {
        console.error("خطأ في تحميل بيانات الرئيسية:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  // اختيار عمل الهيرو: أول فيلم يحتوي على خلفية، أو الفيلم الافتراضي
  const featured = titles.length > 0 ? titles[0] : fallbackHero;
  
  // تجهيز رابط الخلفية
  const backdropUrl = featured.backdrop_path?.startsWith("http")
    ? featured.backdrop_path
    : featured.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
    : fallbackHero.backdrop_path!;

  // تقسيم الأعمال: الرائجة والأعلى تقييماً
  const trendingTitles = titles.length > 0 ? titles.slice(1, 9) : [];
  const topRatedTitles = [...titles]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-24" dir="rtl">
      
      {/* 1. قسم البانر السينمائي الرئيسي (Dynamic Hero) */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[720px] overflow-hidden">
        {/* صورة الخلفية */}
        <img
          src={backdropUrl}
          alt={featured.title}
          className="w-full h-full object-cover object-center filter brightness-50 scale-105 transition-all duration-700"
        />

        {/* تدرجات دمج سينمائية */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e]/90 via-[#07090e]/40 to-transparent" />

        {/* محتوى الهيرو */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 z-10">
          <div className="max-w-2xl space-y-4">
            
            {/* الشارة العلوية */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>العمل المميز اليوم في الشرق الأوسط</span>
            </div>

            {/* عنوان العمل */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              {featured.title}
            </h1>

            {/* تفاصيل التقييم والسنة */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{typeof featured.rating === "number" ? featured.rating.toFixed(1) : featured.rating} / 10</span>
              </span>

              {featured.release_year && (
                <span className="bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                  {featured.release_year}
                </span>
              )}

              <span className="text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                مرخص رقمياً
              </span>
            </div>

            {/* نبذة القصة */}
            <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed max-w-xl">
              {featured.description}
            </p>

            {/* أزرار الإجراءات السريعة */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/title/${featured.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>أين أشاهد العمل؟</span>
              </Link>

              <Link
                href={`/family-guide`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all backdrop-blur-md"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>دليل العائلة</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. شريط المزايا السريعة */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0f141f]/90 border border-white/10 p-5 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">منصات قانونية 100%</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">روابط مباشرة للمنصات المعتمدة بدون مواقع مقرصنة.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-t md:border-t-0 md:border-r border-white/10 pt-3 md:pt-0 md:pr-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">تغطية شاملة للمنطقة</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">شاهد، نتفليكس، OSN+، واتش إت، وبرايم فيديو.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-t md:border-t-0 md:border-r border-white/10 pt-3 md:pt-0 md:pr-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">فحص عائلي دقيق</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">تصنيفات عمرية ومؤشرات العنف والألفاظ قبل المشاهدة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. قسم الأعمال الأكثر رواجاً (Trending Now) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">الأكثر رواجاً في منطقتك</h2>
              <p className="text-xs text-gray-400 mt-0.5">الأعمال التي يتحدث عنها الجميع الآن وتتوفر رقمياً</p>
            </div>
          </div>

          <Link
            href="/titles"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>عرض الكتالوج بالكامل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center text-amber-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingTitles.map((title) => (
              <MovieCard key={title.id} title={title} />
            ))}
          </div>
        )}
      </section>

      {/* 4. قسم الأعلى تقييماً (Top Rated) */}
      {topRatedTitles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">الأعلى تقييماً نقدياً وجماهيرياً</h2>
                <p className="text-xs text-gray-400 mt-0.5">تحف سينمائية حاصلة على أعلى التقييمات</p>
              </div>
            </div>

            <Link
              href="/titles"
              className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>المزيد</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRatedTitles.map((title) => (
              <MovieCard key={title.id} title={title} />
            ))}
          </div>
        </section>
      )}

    </main>
  );
}