// Path: cineverse/frontend/src/components/FamilyGuideCard.tsx
"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Users, AlertTriangle, Eye, Flame, Skull, Wine, MessageSquare, CheckCircle2 } from "lucide-react";
import { FamilyGuide } from "@/types";
import { getFamilyGuide } from "@/services/api";

interface FamilyGuideCardProps {
  titleId: number;
}

interface MetricItem {
  key: string;
  label: string;
  value: string;
  icon: any;
}

export default function FamilyGuideCard({ titleId }: FamilyGuideCardProps) {
  const [guide, setGuide] = useState<FamilyGuide | null>(null);
  const [loading, setLoading] = useState(true);

  // بيانات افتراضية سينمائية ذكية في حال لم يتوفر التقرير بعد
  const fallbackGuide: FamilyGuide = {
    age_recommendation: "+16",
    overall_level: "إشراف عائلي مطلوب",
    violence: "متوسط",
    sexual_content: "خفيف",
    language: "متوسط",
    drugs: "منعدم",
    fear: "شديد",
    parent_note: "يحتوي العمل على مشاهد إثارة وحروب نفسية وتوتر مكثف. يُنصح بمرافقة الوالدين لمن هم دون 16 عاماً لاحتوائه على مفاهيم معقدة وتوتر درامي عالٍ.",
  };

  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await getFamilyGuide(titleId);
        if (res.data) {
          setGuide(res.data);
        } else {
          setGuide(fallbackGuide);
        }
      } catch {
        setGuide(fallbackGuide);
      } finally {
        setLoading(false);
      }
    }
    loadGuide();
  }, [titleId]);

  const getSeverityBadge = (level: string = "منعدم") => {
    switch (level) {
      case "منعدم":
      case "لا يوجد":
        return { label: "منعدم", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", progress: "w-1/12 bg-emerald-500" };
      case "خفيف":
        return { label: "خفيف", style: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", progress: "w-3/12 bg-cyan-500" };
      case "متوسط":
        return { label: "متوسط", style: "bg-amber-500/10 text-amber-400 border-amber-500/20", progress: "w-6/12 bg-amber-500" };
      case "شديد":
      case "مكثف":
        return { label: "شديد", style: "bg-orange-500/10 text-orange-400 border-orange-500/20", progress: "w-9/12 bg-orange-500" };
      case "حرج":
      case "غير مناسب":
        return { label: "حرج", style: "bg-rose-500/10 text-rose-400 border-rose-500/20", progress: "w-full bg-rose-500" };
      default:
        return { label: level, style: "bg-white/10 text-gray-300 border-white/10", progress: "w-1/2 bg-gray-400" };
    }
  };

  const metrics: MetricItem[] = [
    { key: "violence", label: "العنف والحركة", value: guide?.violence || "متوسط", icon: Flame },
    { key: "fear", label: "الرعب والتوتر النفسي", value: guide?.fear || "شديد", icon: Skull },
    { key: "sexual_content", label: "المشاهد الحساسة", value: guide?.sexual_content || "خفيف", icon: Eye },
    { key: "language", label: "الألفاظ والحوارات", value: guide?.language || "متوسط", icon: MessageSquare },
    { key: "drugs", label: "المشروبات والمخدرات", value: guide?.drugs || "منعدم", icon: Wine },
  ];

  if (loading) {
    return (
      <div className="w-full bg-[#0f141f] rounded-3xl p-8 border border-white/10 flex items-center justify-center text-gray-400 text-xs">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin ml-3" />
        جاري تحميل تقرير الفحص العائلي...
      </div>
    );
  }

  const ageTag = guide?.age_recommendation || "+13";

  return (
    <div className="w-full bg-[#0f141f] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden" dir="rtl">
      
      {/* خلفية جمالية خفيفة */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* الرأس: شارة العمر والتقييم الإجمالي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>دليل الرقابة والمشاهدة العائلية</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              فحص تفصيلي للمحتوى لضمان ملائمته لجميع أفراد الأسرة
            </p>
          </div>
        </div>

        {/* كبسولة العمر الموصى به */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="block text-[10px] text-gray-400 uppercase font-semibold">العمر الموصى به</span>
            <span className="text-xs text-amber-400 font-bold">{guide?.overall_level || "إشراف عائلي"}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
            {ageTag}
          </div>
        </div>
      </div>

      {/* المؤشرات التقييمية الخمسة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map((item) => {
          const badge = getSeverityBadge(item.value);
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${badge.style}`}>
                  {badge.label}
                </span>
              </div>

              {/* شريط مقياس الشدة */}
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${badge.progress}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ملاحظة وتوصية الوالدين */}
      {guide?.parent_note && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-400 mb-1">ملاحظة الرقابة للوالدين:</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {guide.parent_note}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}