// Path: cineverse/frontend/src/app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";

  // الصفحات الثابتة الأساسية
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/titles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/platforms`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/family-guide`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // سحب قائمة الأفلام ديناميكياً لتوليد روابطها في الـ Sitemap
  try {
    const res = await fetch("http://127.0.0.1/cineverse/public/api/titles?limit=500", {
      next: { revalidate: 3600 },
    });
    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {
      const dynamicRoutes: MetadataRoute.Sitemap = json.data.map((title: { id: number }) => ({
        url: `${baseUrl}/title/${title.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      return [...staticRoutes, ...dynamicRoutes];
    }
  } catch (err) {
    console.error("فشل في توليد خريطة الموقع للأفلام:", err);
  }

  return staticRoutes;
}