// Path: cineverse/frontend/src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/auth/"],
      },
    ],
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}