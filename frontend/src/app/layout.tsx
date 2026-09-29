// Path: cineverse/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CountryProvider } from "@/context/CountryContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CineVerse | الدليل القانوني للمنصات الرقمية",
  description: "دليلك لاكتشاف أين تعرض الأفلام والمسلسلات في الشرق الأوسط بشكل قانوني ورسمي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var _origFetch = window.fetch;
                window.fetch = function(url, opts) {
                  opts = opts || {};
                  opts.headers = opts.headers || {};
                  if (typeof opts.headers.set === 'function') {
                    opts.headers.set('Bypass-Tunnel-Reminder', 'true');
                  } else {
                    opts.headers['Bypass-Tunnel-Reminder'] = 'true';
                  }
                  return _origFetch(url, opts);
                };
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#07090e] text-white antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            <CountryProvider>
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </CountryProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}