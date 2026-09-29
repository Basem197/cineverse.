// Path: cineverse/frontend/src/app/watchlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Star, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { Title } from "@/types";
import { getWatchlist, removeFromWatchlist } from "@/utils/watchlist";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getPosterUrl, DEFAULT_POSTER } from "@/utils/imageUtils";
import { translateTitleName } from "@/utils/translations";

export default function WatchlistPage() {
  const { user } = useAuth();
  const { lang, dir, t } = useLanguage();
  const [items, setItems] = useState<Title[]>([]);

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const res = await fetch(`http://127.0.0.1/cineverse/public/api/user/watchlist?user_id=${user.id}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setItems(json.data);
            return;
          }
        } catch (e) {
          console.error("فشل جلب قائمة السحابة:", e);
        }
      }
      setItems(getWatchlist());
    }

    loadData();
  }, [user]);

  const handleRemove = async (titleId: number) => {
    removeFromWatchlist(titleId);
    setItems((prev) => prev.filter((i) => i.id !== titleId));

    if (user) {
      try {
        await fetch("http://127.0.0.1/cineverse/public/api/user/watchlist/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, title_id: titleId }),
        });
      } catch (e) {
        console.error("خطأ مزامنة الحذف:", e);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white py-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ترويسة الصفحة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-amber-400" />
              <span>{t.watchlistHeaderTitle}</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {user 
                ? t.watchlistSubCloud.replace("{name}", user.name) 
                : t.watchlistSubLocal}
            </p>
          </div>

          <div className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {t.totalSavedLabel} {items.length}
          </div>
        </div>

        {/* عرض العناصر */}
        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#0f141f] rounded-3xl border border-white/5 p-8 max-w-lg mx-auto space-y-4">
            <Bookmark className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">{t.emptyWatchlistTitle}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{t.emptyWatchlistDesc}</p>
            <Link
              href="/titles"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
            >
              <span>{t.exploreCatalogBtn}</span>
              {dir === "rtl" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((title) => (
              <div
                key={title.id}
                className="bg-[#0f141f] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col group"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-black/60 relative">
                  <img
                    src={getPosterUrl(title.poster_path)}
                    alt={title.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{Number(title.rating).toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(title.id)}
                    className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-500 text-white transition-all cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-xs text-white truncate">
                      {translateTitleName(title.title, lang)}
                    </h3>
                    <span className="text-[10px] text-gray-400">
                      {title.release_year || "2026"}
                    </span>
                  </div>

                  <Link
                    href={`/title/${title.id}`}
                    className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-400 font-bold"
                  >
                    <span>{t.viewTitleDetails}</span>
                    {dir === "rtl" ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}