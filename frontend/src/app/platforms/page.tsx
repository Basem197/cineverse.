// Path: cineverse/frontend/src/app/platforms/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Tv, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Film, 
  Flame, 
  HelpCircle,
  ArrowLeft 
} from "lucide-react";

interface ProviderData {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  titles_count: number;
}

export default function PlatformsPage() {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(true);

  // ميزات إضافية لكل منصة لإثراء التجربة
  const providerDetails: Record<string, { desc: string; plan: string; tag: string }> = {
    "Shahid VIP": {
      desc: "المنصة الأولى عربياً للإنتاجات الأصلية ومسلسلات رمضان الحصرية وعروض السينما الأولى.",
      plan: "تبدأ من 49 ج.م / شهر",
      tag: "الأقوى عربياً",
    },
    "Netflix": {
      desc: "أكبر مكتبة إنتاجات عالمية ووثائقيات بدقة 4K مع دعم الصوت المحيطي باللغة العربية.",
      plan: "تبدأ من 100 ج.م / شهر",
      tag: "المكتبة العالمية",
    },
    "OSN+": {
      desc: "البيت الحصري لأقوى إنتاجات HBO ومسلسلات الفانتازيا العالمية وأفلام باراماونت.",
      plan: "تبدأ من 75 ج.م / شهر",
      tag: "إنتاجات HBO الحصرية",
    },
    "WATCH IT": {
      desc: "المنصة الرائدة للأعمال المصرية الكلاسيكية والدراما الحصرية والبرامج الرياضية.",
      plan: "تبدأ من 40 ج.م / شهر",
      tag: "الدراما المصرية",
    },
    "Amazon Prime Video": {
      desc: "سلسلة من أضخم الإنتاجات الأصلية العالمية وبطولات السينما الحائزة على جوائز.",
      plan: "تبدأ من 29 ج.م / شهر",
      tag: "قيمة ممتازة",
    },
  };

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1/cineverse/public/api/providers");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProviders(json.data);
        }
      } catch (err) {
        console.error("فشل في تحميل قائمة المنصات:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  const handleProviderVisit = (providerId: number, url: string) => {
    try {
      fetch("http://127.0.0.1/cineverse/public/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title_id: null,
          provider_id: providerId,
        }),
      });
    } catch {}

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-24 pt-8" dir="rtl">
      
      {/* توهج سينمائي بالخلفية */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* هيدر الصفحة */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>دليل منصات البث الرسمية والقانونية</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            أين تشترك لمشاهدة سينما بأعلى جودة؟
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            مقارنة مباشرة بين منصات البث الرقمي المعتمدة في منطقة الشرق الأوسط وشمال أفريقيا، لمساعدتك في اختيار الاشتراك المناسب لمفضلاتك السينمائية.
          </p>
        </div>

        {/* شبكة بطاقات المنصات */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-amber-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">جاري إحصاء المنصات الرسمية...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {providers.map((p) => {
              const details = providerDetails[p.name] || {
                desc: "منصة بث رسمي مرخصة توفر أحدث الأفلام والمسلسلات في الشرق الأوسط.",
                plan: "باقات اشتراك شهرية وسنوية",
                tag: "رسمي ومعتمد",
              };

              return (
                <div
                  key={p.id}
                  className="bg-[#0f141f] border border-white/10 rounded-3xl p-6 hover:border-amber-400/40 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* الرأس: اللوجو والشارة */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/10 p-3 flex items-center justify-center">
                        <img
                          src={p.logo_url}
                          alt={p.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        {details.tag}
                      </span>
                    </div>

                    {/* الاسم والوصف */}
                    <h3 className="text-xl font-black text-white mb-2">{p.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">
                      {details.desc}
                    </p>

                    {/* إحصائيات الأعمال والأسعار */}
                    <div className="space-y-2.5 mb-6 pt-4 border-t border-white/5 text-xs">
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Film className="w-3.5 h-3.5 text-amber-400" />
                          الأعمال المرصودة في المنصة:
                        </span>
                        <span className="font-bold text-amber-400">{p.titles_count} عمل</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-300">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          متوسط سعر الاشتراك:
                        </span>
                        <span className="font-bold text-white">{details.plan}</span>
                      </div>
                    </div>
                  </div>

                  {/* زر التوجيه للمنصة */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleProviderVisit(p.id, p.website_url)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10 active:scale-95"
                    >
                      <span>الانتقال للمنصة والاشتراك</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* قسم الشفافية والأسئلة الشائعة */}
        <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6 sm:p-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              لماذا نعتمد فقط على المنصات الرسمية؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                أعلى جودة صوت وصورة بدون تقطيع
              </h4>
              <p className="text-gray-400">
                مشاهدة بدقة 4K HDR مع تقنيات Dolby Atmos وبدون إعلانات مزعجة أو ملفات خبيثة قد تضر أجهزتك.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                دعم صناع السينما وحقوق الملكية
              </h4>
              <p className="text-gray-400">
                اشتراكك القانوني يساهم مباشرة في تمويل أعمال جديدة ودعم المؤلفين والمخرجين وفرق العمل لإنتاج أعمال أفضل.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}