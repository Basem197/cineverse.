// Path: cineverse/frontend/src/app/platforms/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tv, ExternalLink, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getProviderLogoUrl, getFallbackLogo } from "@/utils/imageUtils";

interface ProviderItem {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  titles_count: number;
}

export default function PlatformsPage() {
  const { lang, dir, t } = useLanguage();
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      try {
        const res = await fetch("https://whole-tables-divide.loca.lt/cineverse/public/api/providers");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProviders(json.data);
        } else {
          setProviders([]);
        }
      } catch (err) {
        console.error("فشل جلب المنصات:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, []);

  return (
    <main className="min-h-screen bg-[#07090e] text-white py-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* هيدر الصفحة */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Tv className="w-4 h-4" />
            <span>{t.navPlatforms}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {t.platformsPageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            {t.platformsPageSub}
          </p>
        </div>

        {/* عرض المنصات */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs text-gray-400">{lang === "ar" ? "جاري تحميل المنصات..." : "Loading platforms..."}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {providers.map((p) => {
              const logo = getProviderLogoUrl(p.logo_url, p.name);

              return (
                <div
                  key={p.id}
                  className="bg-[#0f141f] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/10 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={logo}
                        alt={p.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getFallbackLogo(p.name);
                        }}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{p.name}</h3>
                      <span className="text-xs text-amber-400 font-bold">
                        {p.titles_count} {t.availableTitlesCount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/titles?search=${encodeURIComponent(p.name)}`}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-center transition-all"
                    >
                      {t.browsePlatformCatalog}
                    </Link>

                    {p.website_url && (
                      <a
                        href={p.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-md"
                        title={t.visitPlatformBtn}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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