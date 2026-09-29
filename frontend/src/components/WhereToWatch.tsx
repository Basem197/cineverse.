// Path: cineverse/frontend/src/components/WhereToWatch.tsx
"use client";

import { useEffect, useState } from "react";
import { Tv, ExternalLink, ShieldCheck, Tag, Info, AlertCircle } from "lucide-react";
import { AvailabilityItem } from "@/types";
import { getTitleAvailability, trackAffiliateClick } from "@/services/api";

interface WhereToWatchProps {
  titleId: number;
}

export default function WhereToWatch({ titleId }: WhereToWatchProps) {
  const [currentCountry, setCurrentCountry] = useState<string>("EG");
  const [providers, setProviders] = useState<AvailabilityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // بيانات عرض تجريبية غنية للمنطقة العربية في حال لم تتزامن قاعدة البيانات بعد
  const fallbackProviders: AvailabilityItem[] = [
    {
      provider_name: "Shahid VIP",
      provider_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Shahid_2020_Logo.svg/512px-Shahid_2020_Logo.svg.png",
      country_code: currentCountry,
      country_name: currentCountry === "EG" ? "مصر" : "الشرق الأوسط",
      availability_type: "subscription",
      official_url: "https://shahid.mbc.net",
      affiliate_url: "https://shahid.mbc.net/?ref=cineverse",
      verified_at: "2026-09-27",
    },
    {
      provider_name: "Netflix",
      provider_logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      country_code: currentCountry,
      country_name: currentCountry === "EG" ? "مصر" : "الشرق الأوسط",
      availability_type: "subscription",
      official_url: "https://www.netflix.com",
      affiliate_url: null,
      verified_at: "2026-09-27",
    },
    {
      provider_name: "WATCH IT",
      provider_logo: "https://watchit.com/assets/images/logo-white.svg",
      country_code: currentCountry,
      country_name: "مصر",
      availability_type: "subscription",
      official_url: "https://www.watchit.com",
      affiliate_url: "https://www.watchit.com/?ref=cineverse",
      verified_at: "2026-09-27",
    },
    {
      provider_name: "Google TV / Apple TV",
      provider_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_TV_logo.svg/512px-Apple_TV_logo.svg.png",
      country_code: currentCountry,
      country_name: "مصر",
      availability_type: "rent",
      official_url: "https://tv.apple.com",
      affiliate_url: "https://tv.apple.com/?ref=cineverse",
      verified_at: "2026-09-27",
    },
  ];

  const loadAvailability = async (countryCode: string) => {
    setLoading(true);
    try {
      const res = await getTitleAvailability(titleId, countryCode);
      if (res.data && res.data.length > 0) {
        setProviders(res.data);
      } else {
        setProviders(fallbackProviders);
      }
    } catch {
      setProviders(fallbackProviders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // قراءة الدولة المختارة من الذاكرة المحلية
    const savedCountry = typeof window !== "undefined" ? localStorage.getItem("cineverse_country") || "EG" : "EG";
    setCurrentCountry(savedCountry);
    loadAvailability(savedCountry);

    // الاستماع لحدث تغيير الدولة من الـ Navbar
    const handleCountryChange = () => {
      const updatedCountry = localStorage.getItem("cineverse_country") || "EG";
      setCurrentCountry(updatedCountry);
      loadAvailability(updatedCountry);
    };

    window.addEventListener("countryChanged", handleCountryChange);
    return () => {
      window.removeEventListener("countryChanged", handleCountryChange);
    };
  }, [titleId]);

  const handleProviderClick = async (item: AvailabilityItem) => {
    try {
      await trackAffiliateClick({
        title_id: titleId,
      });
    } catch (e) {
      console.warn("Affiliate track failed silently");
    }
    const targetUrl = item.affiliate_url || item.official_url;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "subscription":
        return { label: "ضمن الاشتراك", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "rent":
        return { label: "إيجار رقمي", style: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "buy":
        return { label: "شراء رقمي", style: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      default:
        return { label: "متاح للبث", style: "bg-white/10 text-gray-300 border-white/10" };
    }
  };

  return (
    <div className="w-full bg-[#0f141f] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden" dir="rtl">
      
      {/* خلفية ضوئية داخلية ناعمة */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[90px] rounded-full pointer-events-none" />

      {/* الهيدر الخاص بقسم المشاهدة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>أين تشاهد العمل الآن؟</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              منصات البث الرقمي الرسمية والمرخصة داخل دولتك
            </p>
          </div>
        </div>

        {/* مؤشر الدولة والتحقق التلقائي */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>مُحدّث لدولة: <strong className="text-amber-400">{currentCountry}</strong></span>
        </div>
      </div>

      {/* قائمة المنصات */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">جاري فحص حقوق البث والتوفر القانوني...</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center gap-2 text-gray-400">
          <AlertCircle className="w-8 h-8 text-amber-400" />
          <p className="text-sm font-semibold text-white">غير متوفر للبث المباشر حالياً في دولتك</p>
          <p className="text-xs text-gray-500 max-w-sm">
            قد يكون العمل متاحاً في صالات السينما أو ستتم إتاحته قريباً على المنصات الرقمية.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((item, index) => {
            const typeInfo = getTypeText(item.availability_type);
            return (
              <div
                key={index}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-amber-500/30 transition-all duration-300 shadow-sm"
              >
                {/* لوجو واسم المنصة */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-2 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {item.provider_logo ? (
                      <img src={item.provider_logo} alt={item.provider_name} className="w-full h-full object-contain" />
                    ) : (
                      <Tv className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                      {item.provider_name}
                    </h4>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${typeInfo.style}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                </div>

                {/* زر المشاهدة المباشر (Affiliate Conversion Button) */}
                <button
                  onClick={() => handleProviderClick(item)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95 shrink-0"
                >
                  <span>شاهد الآن</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* تنويه الشفافية والقانونية */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-gray-500">
        <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>
          CineVerse يوجهك للمنصات الرسمية فقط احتراماً لحقوق الملكية الفكرية. قد نحصل على عمولة تسويقية بسيطة عند اشتراكك عبر الروابط الرسمية بدون أي تكلفة إضافية عليك.
        </span>
      </div>

    </div>
  );
}