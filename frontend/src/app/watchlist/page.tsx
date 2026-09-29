// Path: cineverse/frontend/src/app/watchlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Bookmark, 
  Trash2, 
  Star, 
  Film, 
  PlayCircle, 
  Sparkles,
  ArrowLeft,
  CloudCheck
} from "lucide-react";
import { Title } from "@/types";
import { getWatchlist, toggleWatchlist } from "@/utils/watchlist";
import { useAuth } from "@/context/AuthContext";

export default function WatchlistPage() {
  const { user, syncWatchlistWithCloud } = useAuth();
  const [items, setItems] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = () => {
    setItems(getWatchlist());
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      syncWatchlistWithCloud(user.id).then(() => {
        loadItems();
      });
    } else {
      loadItems();
    }

    const handleUpdate = () => loadItems();
    window.addEventListener("watchlist_changed", handleUpdate);
    return () => window.removeEventListener("watchlist_changed", handleUpdate);
  }, [user]);

  const handleRemove = async (title: Title) => {
    toggleWatchlist(title);
    setItems((prev) => prev.filter((i) => i.id !== title.id));

    if (user) {
      try {
        await fetch("http://127.0.0.1/cineverse/public/api/user/watchlist/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, title_id: title.id }),
        });
      } catch (err) {
        console.error("فشل في حذف العمل من السحابة:", err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-24 pt-8" dir="rtl">
      
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* هيدر الصفحة */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <Bookmark className="w-3.5 h-3.5" />
              <span>قائمتي الشخصية للمشاهدة اللاحقة</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              الأعمال المحفوظة
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {user ? `مرحباً ${user.name}، قائمتك مزامنة سحابياً بحسابك` : "يتم حفظ قائمتك على هذا المتصفح (سجّل دخولك لحفظها سحابياً)"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 font-bold">
              إجمالي المحفوظات: <strong className="text-amber-400">{items.length}</strong>
            </span>
          </div>
        </div>

        {/* عرض المحتوى */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-amber-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">جاري تحميل قائمتك...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center bg-[#0f141f] rounded-3xl border border-white/5 p-8 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Film className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">قائمتك فارغة حالياً</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              تصفح الكتالوج واضغط على علامة "أضف لقائمتي" في أي عمل لتنظيمه في قائمة المشاهدة الخاصة بك.
            </p>
            <Link
              href="/titles"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/10"
            >
              <span>استكشف الكتالوج الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {items.map((item) => {
              const poster = item.poster_path?.startsWith("http")
                ? item.poster_path
                : item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

              return (
                <div
                  key={item.id}
                  className="bg-[#0f141f] rounded-2xl border border-white/10 overflow-hidden group hover:border-amber-400/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-black/50">
                    <img
                      src={poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* زر الحذف */}
                    <button
                      onClick={() => handleRemove(item)}
                      title="حذف من القائمة"
                      className="absolute top-2 left-2 p-2 rounded-xl bg-black/70 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* التقييم */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-amber-400 border border-white/10">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{Number(item.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {item.release_year || "حديث"}
                      </span>
                    </div>

                    <Link
                      href={`/title/${item.id}`}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-amber-500 text-gray-300 hover:text-black font-bold text-[11px] text-center transition-all flex items-center justify-center gap-1.5 border border-white/5"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>تفاصيل العرض</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}