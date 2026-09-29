// Path: cineverse/frontend/src/components/Footer.tsx
import Link from "next/link";
import { Film, ShieldCheck, Heart, Globe, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#05070a] border-t border-white/10 text-gray-400 text-xs" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* العمود 1: الشعار والتعريف */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                CINE<span className="text-amber-400">VERSE</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              دليلك الذكي لاكتشاف أين تُعرض الأفلام والمسلسلات في الشرق الأوسط بشكل قانوني ورسمي، مع دعم حقوق الملكية الفكرية وتوجيه الرقابة العائلية.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>منصة مرخصة وموثوقة 100%</span>
            </div>
          </div>

          {/* العمود 2: تصفح سريع */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>استكشاف</span>
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">الصفحة الرئيسية</Link></li>
              <li><Link href="/titles" className="hover:text-amber-400 transition-colors">مكتبة الأعمال السينمائية</Link></li>
              <li><Link href="/platforms" className="hover:text-amber-400 transition-colors">المنصات الرقمية المعتمدة</Link></li>
              <li><Link href="/family-guide" className="hover:text-amber-400 transition-colors">دليل المشاهدة العائلية</Link></li>
            </ul>
          </div>

          {/* العمود 3: المنصات الشريكة */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">المنصات المدعومة</h4>
            <ul className="space-y-2.5 text-[11px]">
              <li><span className="hover:text-gray-200">Shahid VIP (شاهد)</span></li>
              <li><span className="hover:text-gray-200">WATCH IT (واتش إت)</span></li>
              <li><span className="hover:text-gray-200">Netflix (نتفليكس)</span></li>
              <li><span className="hover:text-gray-200">OSN+ (أو إس إن)</span></li>
              <li><span className="hover:text-gray-200">Amazon Prime Video</span></li>
            </ul>
          </div>

          {/* العمود 4: الشفافية القانونية (Affiliate & Copyright) */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">الشفافية والأمان</h4>
            <p className="text-[11px] leading-relaxed text-gray-500 mb-3">
              CineVerse لا يستضيف أو يبث أي مواد مقرصنة أو محمية بحقوق الطبع والنشر. نوفر فقط روابط مباشرة وتوجيهية إلى المنصات المرخصة رسمياً في منطقتك الجغرافية.
            </p>
            <p className="text-[10px] text-gray-500">
              قد تتضمن بعض الروابط معرفات تسويقية (Affiliate) لدعم استمرار وتطوير المنصة دون تحميل المستخدم أي تكاليف إضافية.
            </p>
          </div>

        </div>

        {/* الشريط السفلي للحقوق */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © 2026 <strong className="text-gray-300">CineVerse</strong>. جميع الحقوق محفوظة.
          </div>
          <div className="flex items-center gap-1">
            <span>صُنع بشغف سينمائي</span>
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />
            <span>لجمهور السينما في الشرق الأوسط</span>
          </div>
        </div>

      </div>
    </footer>
  );
}