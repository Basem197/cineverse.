// Path: cineverse/frontend/src/app/family-guide/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Flame, 
  Skull, 
  Eye, 
  MessageSquare, 
  Wine, 
  AlertTriangle, 
  PlayCircle, 
  Sparkles 
} from "lucide-react";

interface GuideItem {
  id: number;
  title: string;
  release_year: number;
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

export default function FamilyGuideHubPage() {
  const [guideCatalog, setGuideCatalog] = useState<GuideItem[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const ageFilters = [
    { id: "all", label: "جميع الأعمار" },
    { id: "G", label: "للجميع (G)" },
    { id: "+7", label: "أطفال (+7)" },
    { id: "+13", label: "يافعين (+13)" },
    { id: "+16", label: "إشراف عائلي (+16)" },
    { id: "+18", label: "كبار فقط (+18)" },
  ];

  useEffect(() => {
    async function fetchGuides() {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1/cineverse/public/api/family-guides");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setGuideCatalog(json.data);
        }
      } catch (err) {
        console.error("فشل في تحميل دليل العائلة:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGuides();
  }, []);

  const filteredItems = guideCatalog.filter((item) => {
    const matchesAge = selectedAge === "all" || item.age === selectedAge;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAge && matchesSearch;
  });

  const getMetricStyle = (level: string) => {
    switch (level) {
      case "منعدم":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "خفيف":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "متوسط":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "شديد":
      case "حرج":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-gray-300 bg-white/5 border-white/10";
    }
  };

  const getAgeBadgeColor = (age: string) => {
    switch (age) {
      case "G":
      case "+7":
        return "bg-emerald-500 text-black";
      case "+13":
        return "bg-cyan-500 text-black";
      case "+16":
        return "bg-amber-500 text-black";
      case "+18":
        return "bg-rose-500 text-white";
      default:
        return "bg-amber-500 text-black";
    }
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-24 pt-8" dir="rtl">
      
      {/* توهج سينمائي خلفي */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* هيدر الصفحة */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>نظام الفحص العائلي والرقابة الأبوية الذكي</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              دليل المشاهدة الآمنة للأسرة
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
              تقارير رقابية موثوقة ومفصلة لجميع أعمال الكتالوج، لمساعدة أولياء الأمور في اتخاذ القرار المناسب لكل فئة عمرية.
            </p>
          </div>

          {/* خانة البحث */}
          <div className="w-full md:w-80 flex items-center bg-[#0f141f] border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-xl focus-within:border-amber-400/50 transition-all">
            <Search className="w-4 h-4 text-gray-400 ml-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في دليل العائلة..."
              className="w-full bg-transparent text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* فلاتر الفئات العمرية */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {ageFilters.map((filter) => {
            const isSelected = selectedAge === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedAge(filter.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-[#0f141f] text-gray-300 hover:bg-white/5 border border-white/5"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* شبكة الأعمال */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-amber-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">جاري سحب تقارير الرقابة العائلية من قاعدة البيانات...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-[#0f141f] rounded-3xl border border-white/5 p-8">
            <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">لا توجد أعمال مطابقة لبحثك</h3>
            <p className="text-xs text-gray-400">جرب اختيار تصنيف عمري آخر أو اسم فيلم مختلف.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredItems.map((item) => {
              const posterUrl = item.poster_path?.startsWith("http")
                ? item.poster_path
                : item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

              return (
                <div
                  key={item.id}
                  className="bg-[#0f141f] rounded-3xl p-6 border border-white/10 hover:border-amber-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* الرأس: البوستر ومعلومات العمر */}
                    <div className="flex items-start gap-4 mb-5">
                      <img
                        src={posterUrl}
                        alt={item.title}
                        className="w-20 sm:w-24 aspect-[2/3] object-cover rounded-2xl border border-white/10 shrink-0 bg-black/50"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-lg font-black text-white">{item.title}</h3>
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${getAgeBadgeColor(item.age)}`}>
                            {item.age}
                          </span>
                        </div>

                        <p className="text-xs text-amber-400 font-semibold mb-2">
                          {item.overallVerdict}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          <span>سنة الإنتاج: {item.release_year || "حديث"}</span>
                        </p>
                      </div>
                    </div>

                    {/* شبكة المؤشرات الخمسة */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-[11px]">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Flame className="w-3 h-3 text-amber-400" />
                          العنف:
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold border ${getMetricStyle(item.violence)}`}>
                          {item.violence}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-[11px]">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Skull className="w-3 h-3 text-amber-400" />
                          الرعب:
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold border ${getMetricStyle(item.fear)}`}>
                          {item.fear}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-[11px]">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Eye className="w-3 h-3 text-amber-400" />
                          المشاهد:
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold border ${getMetricStyle(item.sexualContent)}`}>
                          {item.sexualContent}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-[11px]">
                        <span className="flex items-center gap-1 text-gray-400">
                          <MessageSquare className="w-3 h-3 text-amber-400" />
                          الألفاظ:
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold border ${getMetricStyle(item.language)}`}>
                          {item.language}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-[11px]">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Wine className="w-3 h-3 text-amber-400" />
                          المخدرات:
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold border ${getMetricStyle(item.drugs)}`}>
                          {item.drugs}
                        </span>
                      </div>
                    </div>

                    {/* ملاحظة الوالدين */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5 mb-5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        {item.parentNote}
                      </p>
                    </div>
                  </div>

                  {/* زر الانتقال المباشر لصفحة العمل */}
                  <Link
                    href={`/title/${item.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500 text-gray-200 hover:text-black font-bold text-xs transition-all border border-white/10 hover:border-amber-400"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>تفاصيل العمل ومنصات العرض الرسمية</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}