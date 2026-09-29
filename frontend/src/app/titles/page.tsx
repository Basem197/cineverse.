// Path: cineverse/frontend/src/app/titles/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Search, Clapperboard, Filter, Sparkles } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { getTitles, getGenres } from "@/services/api";
import { Title, Genre } from "@/types";

export default function TitlesCatalogPage() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fallbackGenres: Genre[] = [
    { id: 0, name: "الكل", slug: "all" },
    { id: 28, name: "حركة وأكشن", slug: "action" },
    { id: 53, name: "إثارة وتشويق", slug: "thriller" },
    { id: 878, name: "خيال علمي", slug: "sci-fi" },
    { id: 18, name: "دراما", slug: "drama" },
    { id: 80, name: "جريمة وغموض", slug: "crime" },
  ];

  const fallbackTitles: Title[] = [
    {
      id: 1,
      title: "Oppenheimer",
      release_year: 2023,
      rating: 8.9,
      poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      description: "سيرة صانع القنبلة الذرية روبرت أوبنهايمر والصراع الأخلاقي والنفسي.",
    },
    {
      id: 2,
      title: "Interstellar",
      release_year: 2014,
      rating: 8.7,
      poster_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
      description: "رحلة ملحمية عبر الثقوب الدودية في الفضاء لإنقاذ مصير البشرية.",
    },
    {
      id: 3,
      title: "The Batman",
      release_year: 2022,
      rating: 7.9,
      poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
      description: "فارس الظلام يتعقب قاتلاً متسلسلاً يكشف فساد مدينة غوثام.",
    },
  ];

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const [titlesRes, genresRes] = await Promise.allSettled([
          getTitles({ limit: 60 }),
          getGenres(),
        ]);

        // استخراج مصفوفة الأفلام من الاستجابة بمرونة أياً كان شكل التغليف
        if (titlesRes.status === "fulfilled") {
          const raw: any = titlesRes.value;
          let list: Title[] = [];

          if (Array.isArray(raw)) {
            list = raw;
          } else if (Array.isArray(raw?.data)) {
            list = raw.data;
          } else if (Array.isArray(raw?.data?.data)) {
            list = raw.data.data;
          } else if (Array.isArray(raw?.data?.data?.data)) {
            list = raw.data.data.data;
          }

          if (list.length > 0) {
            setTitles(list);
          } else {
            setTitles(fallbackTitles);
          }
        }

        // استخراج التصنيفات
        if (genresRes.status === "fulfilled") {
          const genreResponse: any = genresRes.value;
          const rawGenres = genreResponse?.data?.data || genreResponse?.data || genreResponse;
          if (Array.isArray(rawGenres) && rawGenres.length > 0) {
            setGenres([{ id: 0, name: "الكل", slug: "all" }, ...rawGenres]);
          } else {
            setGenres(fallbackGenres);
          }
        }
      } catch (err) {
        console.error("خطأ أثناء جلب الكتالوج:", err);
        setTitles(fallbackTitles);
        setGenres(fallbackGenres);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  // فلترة الأفلام حسب البحث
  const filteredTitles = titles.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-24 pt-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* عنوان الصفحة والهيدر */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>دليل الأعمال السينمائية المرخصة</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              استكشاف وتصفية الأعمال
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              مكتبة الأفلام المحدثة حياً من قاعدة البيانات مع المنصات الرسمية لكل عمل
            </p>
          </div>

          {/* شريط البحث المباشر */}
          <div className="w-full md:w-96 flex items-center bg-[#0f141f] border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-xl focus-within:border-amber-400/50 transition-all">
            <Search className="w-4 h-4 text-gray-400 ml-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم في الكتالوج..."
              className="w-full bg-transparent text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* أزرار فلترة التصنيفات */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 pl-3 border-l border-white/10 shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>التصنيف:</span>
          </div>
          {genres.map((genre) => {
            const isSelected = (selectedGenre === null && genre.id === 0) || selectedGenre === genre.id;
            return (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id === 0 ? null : genre.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-[#0f141f] text-gray-300 hover:bg-white/5 border border-white/5"
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>

        {/* شبكة الأعمال السينمائية */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-amber-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">جاري سحب الأفلام الحية من قاعدة البيانات...</span>
          </div>
        ) : filteredTitles.length === 0 ? (
          <div className="py-20 text-center bg-[#0f141f] rounded-3xl border border-white/5 p-8">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">لم نجد نتائج مطابقة لبحثك</h3>
            <p className="text-xs text-gray-400">جرب كتابة اسم مختلف أو تصفية تصنيف آخر.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTitles.map((title) => (
              <MovieCard key={title.id} title={title} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}