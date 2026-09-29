// Path: cineverse/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineVerse | دليلك الرسمي للأفلام ومنصات البث الرقمي",
  description: "اكتشف أين تشاهد الأفلام والمسلسلات بشكل قانوني، مع تقارير الفحص والرقابة العائلية الشاملة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): import("react").JSX.Element {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} bg-[#07090e] text-white min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-black`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}