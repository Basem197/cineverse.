// Path: cineverse/frontend/src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  MousePointerClick, 
  Film, 
  Tv, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Lock, 
  KeyRound, 
  LogOut, 
  ShieldAlert, 
  ArrowLeft 
} from "lucide-react";

interface AdminStats {
  total_titles: number;
  total_clicks: number;
  total_providers: number;
  top_providers: { name: string; clicks_count: number }[];
  top_titles: { title: string; clicks_count: number }[];
  recent_clicks: {
    id: number;
    title: string;
    provider_name: string;
    user_ip: string;
    clicked_at: string;
  }[];
}

const STORAGE_AUTH_KEY = "cineverse_admin_pin";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  // جلب الإحصائيات باستخدام الـ PIN المحفوظ
  const fetchStatsWithToken = async (token: string): Promise<boolean> => {
    setLoadingStats(true);
    try {
      const res = await fetch("https://whole-tables-divide.loca.lt/cineverse/public/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setStats(json.data);
        setIsAuthenticated(true);
        sessionStorage.setItem(STORAGE_AUTH_KEY, token);
        return true;
      } else {
        sessionStorage.removeItem(STORAGE_AUTH_KEY);
        setIsAuthenticated(false);
        setAuthError(json.message || "رمز PIN غير صحيح");
        return false;
      }
    } catch {
      setAuthError("تعذر الاتصال بالخادم للتحقق من الصلاحيات");
      return false;
    } finally {
      setLoadingStats(false);
    }
  };

  // فحص الجلسة عند فتح الصفحة
  useEffect(() => {
    const savedPin = sessionStorage.getItem(STORAGE_AUTH_KEY);
    if (savedPin) {
      fetchStatsWithToken(savedPin).finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // معالجة تسجيل الدخول بالـ PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!pinInput.trim()) {
      setAuthError("يرجى كتابة رمز الدخول");
      return;
    }
    const success = await fetchStatsWithToken(pinInput.trim());
    if (success) {
      setPinInput("");
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_AUTH_KEY);
    setIsAuthenticated(false);
    setStats(null);
    setPinInput("");
    setAuthError(null);
  };

  // مزامنة TMDB
  const handleSyncTMDB = async () => {
    const token = sessionStorage.getItem(STORAGE_AUTH_KEY);
    if (!token) return;

    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("https://whole-tables-divide.loca.lt/cineverse/public/api/admin/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setSyncMsg("تمت المزامنة مع TMDB بنجاح وتحديث كافة قواعد البيانات!");
        fetchStatsWithToken(token);
      } else {
        setSyncMsg(json.message || "حدث خطأ أثناء المزامنة");
      }
    } catch {
      setSyncMsg("تعذر إتمام عملية المزامنة");
    } finally {
      setSyncing(false);
    }
  };

  // شاشة الفحص الأولي
  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400">جاري التحقق من أمان الجلسة...</span>
        </div>
      </main>
    );
  }

  // 1. شاشة القفل وإدخال الـ PIN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#0f141f] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-6 shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white">منطقة الإدارة المحمية</h1>
            <p className="text-xs text-gray-400 mt-1">
              أدخل رمز المرور السري (PIN) للوصول لإحصائيات الأرباح والمزامنة
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="رمز PIN (الافتراضي: 7799)"
                  autoFocus
                  className="w-full bg-black/40 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-center text-sm font-bold tracking-widest text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingStats}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {loadingStats ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <span>فتح لوحة التحكم</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[10px] text-gray-500">
              CineVerse Secure Enterprise Dashboard
            </span>
          </div>
        </div>
      </main>
    );
  }

  // 2. لوحة التحكم بعد التحقق بنجاح
  return (
    <main className="min-h-screen bg-[#07090e] text-white pb-24 pt-8" dir="rtl">
      
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* هيدر اللوحة مع زر تسجيل الخروج */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>جلسة أدمن موثقة ومحمية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              إحصائيات المنصة والأرباح
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              متابعة نقرات الإحالة (Affiliate Clicks) واستيراد أحدث الأفلام والمنصات
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncTMDB}
              disabled={syncing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/10 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "جاري المزامنة مع TMDB..." : "مزامنة الأفلام والمنصات"}</span>
            </button>

            <button
              onClick={handleLogout}
              title="تسجيل الخروج وقفل اللوحة"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>قفل اللوحة</span>
            </button>
          </div>
        </div>

        {/* رسالة إشعار المزامنة */}
        {syncMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncMsg}</span>
          </div>
        )}

        {/* كروت الأرقام الرئيسية */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold">إجمالي نقرات الإحالة</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <MousePointerClick className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {stats?.total_clicks ?? 0}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              نقرة مسجلة لروابط الاشتراك والشراء الرسمية
            </p>
          </div>

          <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold">إجمالي الأعمال السينمائية</span>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Film className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {stats?.total_titles ?? 0}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              عمل مسجل في قاعدة البيانات ومفحوص عائلياً
            </p>
          </div>

          <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold">المنصات المرخصة المغطاة</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Tv className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {stats?.total_providers ?? 0}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              منصة رسمية نشطة في الشرق الأوسط
            </p>
          </div>

        </div>

        {/* قسم الأكثر جذباً للنقرات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-white font-bold text-base mb-6 border-b border-white/5 pb-4">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>أكثر المنصات تحويلاً للمشاهدين</span>
            </div>

            <div className="space-y-4">
              {stats?.top_providers && stats.top_providers.length > 0 ? (
                stats.top_providers.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {p.name}
                    </span>
                    <span className="font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl">
                      {p.clicks_count} نقرة
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 text-center py-6">لا توجد نقرات مسجلة حتى الآن</div>
              )}
            </div>
          </div>

          <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-white font-bold text-base mb-6 border-b border-white/5 pb-4">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>أكثر الأعمال طلباً للمشاهدة</span>
            </div>

            <div className="space-y-4">
              {stats?.top_titles && stats.top_titles.length > 0 ? (
                stats.top_titles.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs">
                      <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{t.title}</span>
                    </span>
                    <span className="font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl shrink-0">
                      {t.clicks_count} نقرة
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 text-center py-6">لا توجد نقرات مسجلة حتى الآن</div>
              )}
            </div>
          </div>

        </div>

        {/* سجل التحويلات والنقرات الأحدث */}
        <div className="bg-[#0f141f] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>سجل التحويلات والنقرات الأحدث</span>
            </div>
            <button
              onClick={() => {
                const token = sessionStorage.getItem(STORAGE_AUTH_KEY);
                if (token) fetchStatsWithToken(token);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              تحديث السجل
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-400">
                  <th className="pb-3 pr-2">العمل المطلوب</th>
                  <th className="pb-3 px-2">المنصة المحوّل إليها</th>
                  <th className="pb-3 px-2">IP الزائر</th>
                  <th className="pb-3 pl-2">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recent_clicks && stats.recent_clicks.length > 0 ? (
                  stats.recent_clicks.map((row) => (
                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 pr-2 font-bold text-white truncate max-w-xs">{row.title}</td>
                      <td className="py-3.5 px-2 text-amber-400 font-semibold">{row.provider_name}</td>
                      <td className="py-3.5 px-2 text-gray-400 font-mono text-[11px]">{row.user_ip}</td>
                      <td className="py-3.5 pl-2 text-gray-400 font-mono text-[11px]">
                        {new Date(row.clicked_at).toLocaleString("ar-EG")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      لم يتم تسجيل أي نقرات حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}