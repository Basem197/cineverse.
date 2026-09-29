// Path: cineverse/frontend/src/components/MovieCard.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Play, Bookmark } from "lucide-react";
import { Title } from "@/types";
import { isInWatchlist, toggleWatchlist } from "@/utils/watchlist";

interface MovieCardProps {
  title: Title;
}

export default function MovieCard({ title }: MovieCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(title.id));

    const handleUpdate = () => {
      setSaved(isInWatchlist(title.id));
    };

    window.addEventListener("watchlist_changed", handleUpdate);
    return () => window.removeEventListener("watchlist_changed", handleUpdate);
  }, [title.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleWatchlist(title);
    setSaved(newState);
  };

  const posterUrl = title.poster_path?.startsWith("http")
    ? title.poster_path
    : title.poster_path
    ? `https://image.tmdb.org/t/p/w500${title.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="group relative bg-[#0f141f] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* الحاوية البصرية للبوستر */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/50">
          <img
            src={posterUrl}
            alt={title.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* تدرج داكن خفيف فوق البوستر */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f141f] via-transparent to-transparent opacity-80" />

          {/* زر إضافة إلى قائمتي */}
          <button
            onClick={handleBookmark}
            title={saved ? "إزالة من قائمتي" : "أضف إلى قائمتي"}
            className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md border transition-all active:scale-90 ${
              saved
                ? "bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/30"
                : "bg-black/60 border-white/15 text-white hover:text-amber-400 hover:bg-black/80"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-black" : ""}`} />
          </button>

          {/* شارة التقييم */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{typeof title.rating === "number" ? title.rating.toFixed(1) : title.rating}</span>
          </div>
        </div>

        {/* معلومات العمل */}
        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
            <span>{title.release_year || "غير محدد"}</span>
            <span className="text-emerald-400 font-medium">مرخص رسمي</span>
          </div>

          <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
            {title.title}
          </h3>

          <p className="text-[11px] text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
            {title.description || "استكشف أين يتوفر هذا العمل القانوني في منطقتك الجغرافية."}
          </p>
        </div>
      </div>

      {/* زر الانتقال لصفحة أين تشاهد */}
      <div className="p-4 pt-0">
        <Link
          href={`/title/${title.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500 text-gray-200 hover:text-black text-xs font-bold transition-all border border-white/10 hover:border-amber-400"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>أين تشاهد العمل؟</span>
        </Link>
      </div>
    </div>
  );
}