// Path: cineverse/frontend/src/components/Footer.tsx
"use client";

import Link from "next/link";
import { Film, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, dir } = useLanguage();

  return (
    <footer className="w-full bg-[#04060a] border-t border-white/10 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto" dir={dir}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* النبذة والشعار */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-wider text-white">
              CINE<span className="text-amber-400">VERSE</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            {t.footerTagline}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.footerBadge}</span>
          </div>
        </div>

        {/* روابط سريعة */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wide">{t.footerNavTitle}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-amber-400 transition-colors">{t.navHome}</Link></li>
            <li><Link href="/titles" className="hover:text-amber-400 transition-colors">{t.navCatalog}</Link></li>
            <li><Link href="/platforms" className="hover:text-amber-400 transition-colors">{t.navPlatforms}</Link></li>
            <li><Link href="/family-guide" className="hover:text-amber-400 transition-colors">{t.navFamilyGuide}</Link></li>
          </ul>
        </div>

        {/* المنصات المعتمدة */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wide">{t.footerPlatformsTitle}</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white">Shahid VIP (شاهد)</span></li>
            <li><span className="hover:text-white">WATCH IT (واتش إت)</span></li>
            <li><span className="hover:text-white">Netflix (نتفليكس)</span></li>
            <li><span className="hover:text-white">OSN+ (أو إس إن)</span></li>
            <li><span className="hover:text-white">Amazon Prime Video</span></li>
          </ul>
        </div>

        {/* الشفافية والأمان */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wide">{t.footerSafetyTitle}</h4>
          <p className="text-xs leading-relaxed text-gray-400">
            {t.footerSafetyText}
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {t.footerAffiliateNotice}
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>{t.footerCopyright}</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-gray-400 cursor-pointer">DMCA Notice</span>
        </div>
      </div>
    </footer>
  );
}