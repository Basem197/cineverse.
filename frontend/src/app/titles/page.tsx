// Path: cineverse/frontend/src/app/titles/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Search, Filter, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Title } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { getPosterUrl, DEFAULT_POSTER } from "@/utils/imageUtils";

export default function TitlesPage() {
  const { lang, dir, t } = useLanguage();
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadTitles() {
      setLoading(true);
      try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
        const res = await fetch(`http://127.0.0.1/cineverse/public/api/titles${query}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTitles(json.data);
        } else {
          setTitles([]);
        }
      } catch (err) {
        console.error("فشل تحميل الأفلام:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadTitles, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-[#07090e] text-white py-10 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-7xl mx-auto">
        
        {/* الهيدر والبحث */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {lang === "ar" ? "كتالوج الأعمال السينمائية" : "Cinema & Series Catalog"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {lang === "ar" 
                ? "تصفح الأعمال واكتشف المنصات الرسمية المرخصة لمشاهدتها" 
                : "Browse titles and find verified official streaming providers"}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-[#0f141f] border border-white/10 rounded-xl py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 ${
                dir === "rtl" ? "pr-9 pl-4" : "pl-9 pr-4"
              }`}
            />
            <Search className={`w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 ${
              dir === "rtl" ? "right-3" : "left-3"
            }`} />
          </div>
        </div>

        {/* عرض شبكة الأفلام */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs text-gray-400">
              {lang === "ar" ? "جاري تحميل الكتالوج..." : "Loading catalog..."}
            </span>
          </div>
        ) : titles.length === 0 ? (
          <div className="text-center py-20 bg-[#0f141f] rounded-3xl border border-white/5 p-8">
            <p className="text-sm text-gray-400">
              {lang === "ar" ? "لم نجد أعمالاً تطابق بحثك." : "No titles found matching your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {titles.map((title) => {
              const poster = getPosterUrl(title.poster_path);

              return (
                <Link
                  key={title.id}
                  href={`/title/${title.id}`}
                  className="group bg-[#0f141f] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden bg-black/60 relative">
                    <img
                      src={poster}
                      alt={title.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{Number(title.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {title.title}
                      </h3>
                      <span className="text-[11px] text-gray-400">
                        {title.release_year || "Latest"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                      <span>{lang === "ar" ? "عرض التفاصيل" : "View details"}</span>
                      {dir === "rtl" ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}