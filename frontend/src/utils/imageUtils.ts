// Path: cineverse/frontend/src/utils/imageUtils.ts

export const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

export const DEFAULT_BACKDROP =
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80";

export function getPosterUrl(path?: string | null): string {
  if (!path || path.trim() === "") return DEFAULT_POSTER;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/w500${clean}`;
}

export function getBackdropUrl(path?: string | null): string {
  if (!path || path.trim() === "") return DEFAULT_BACKDROP;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/original${clean}`;
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// شعارات المنصات الرسمية المعتمدة بتنسيق متجهي نقي لا ينكسر
export function getBrandLogoSvg(name: string): string {
  const n = (name || "").toLowerCase();

  // 1. Shahid VIP (شاهد)
  if (n.includes("shahid") || n.includes("شاهد")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#081421"/>
        <circle cx="60" cy="46" r="22" fill="none" stroke="#00df89" stroke-width="6" stroke-dasharray="100 35"/>
        <polygon points="56,36 69,46 56,56" fill="#ffffff"/>
        <text x="60" y="88" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#ffffff" letter-spacing="1.5">SHAHID</text>
        <text x="60" y="104" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#00df89" letter-spacing="3">VIP</text>
      </svg>
    `);
  }

  // 2. WATCH IT (واتش إت)
  if (n.includes("watch") || n.includes("واتش")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#0a0a0c"/>
        <rect x="22" y="24" width="76" height="40" rx="10" fill="#f59e0b"/>
        <polygon points="54,34 68,44 54,54" fill="#000000"/>
        <text x="60" y="86" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#ffffff" letter-spacing="1">WATCH</text>
        <text x="60" y="104" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#f59e0b" letter-spacing="2">IT</text>
      </svg>
    `);
  }

  // 3. Netflix (نتفليكس)
  if (n.includes("netflix") || n.includes("نتفليكس") || n.includes("نتفلكس")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#000000"/>
        <path d="M38 25 h14 v70 h-14 z" fill="#b81d24"/>
        <path d="M68 25 h14 v70 h-14 z" fill="#b81d24"/>
        <path d="M38 25 L52 25 L82 95 L68 95 Z" fill="#e50914"/>
      </svg>
    `);
  }

  // 4. OSN+ (أو إس إن)
  if (n.includes("osn") || n.includes("او اس ان") || n.includes("أو إس إن")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="osnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff1a53"/>
            <stop offset="100%" stop-color="#cc0029"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="26" fill="#0d0d12"/>
        <text x="48" y="68" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="url(#osnGrad)" letter-spacing="-1">osn</text>
        <text x="88" y="52" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="30" fill="#ffffff">+</text>
        <rect x="30" y="86" width="60" height="4" rx="2" fill="url(#osnGrad)"/>
      </svg>
    `);
  }

  // 5. Amazon Prime Video (أمازون برايم)
  if (n.includes("prime") || n.includes("amazon") || n.includes("أمازون") || n.includes("برايم")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#0f172a"/>
        <text x="60" y="52" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff" letter-spacing="0.5">prime</text>
        <text x="60" y="72" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#00a8e1" letter-spacing="1">video</text>
        <path d="M35 86 Q60 98 85 86" fill="none" stroke="#00a8e1" stroke-width="4" stroke-linecap="round"/>
        <polygon points="85,86 77,83 81,93" fill="#00a8e1"/>
      </svg>
    `);
  }

  // 6. Disney+ (ديزني بلس)
  if (n.includes("disney") || n.includes("ديزني")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#040714"/>
        <path d="M22 62 Q60 22 98 62" fill="none" stroke="#1fd5f5" stroke-width="4" stroke-linecap="round"/>
        <text x="50" y="75" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#ffffff">Disney</text>
        <text x="90" y="75" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#1fd5f5">+</text>
      </svg>
    `);
  }

  // 7. Apple TV+ (أبل تي في)
  if (n.includes("apple") || n.includes("أبل") || n.includes("ابل")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#000000"/>
        <circle cx="60" cy="40" r="14" fill="#ffffff"/>
        <text x="60" y="78" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff">tv</text>
        <text x="82" y="74" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#888888">+</text>
      </svg>
    `);
  }

  // 8. TOD (تود)
  if (n.includes("tod") || n.includes("تود")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#120726"/>
        <text x="60" y="72" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#00f0ff" letter-spacing="1">TOD</text>
      </svg>
    `);
  }

  // 9. Starzplay (ستارزبلاي)
  if (n.includes("starz") || n.includes("ستارز")) {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <rect width="120" height="120" rx="26" fill="#09090b"/>
        <polygon points="60,25 64,37 77,37 66,45 70,57 60,49 50,57 54,45 43,37 56,37" fill="#f97316"/>
        <text x="60" y="80" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#ffffff" letter-spacing="1">STARZPLAY</text>
      </svg>
    `);
  }

  // بديل افتراضي أنيق لأي منصة أخرى
  const initials = (name || "TV").replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() || "TV";
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#0f141f"/>
      <rect x="6" y="6" width="108" height="108" rx="20" fill="none" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.3"/>
      <text x="60" y="70" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#f59e0b">${initials}</text>
    </svg>
  `);
}

export function getProviderLogoUrl(rawLogo: string | null | undefined, providerName: string = ""): string {
  // استخدام الشعار المتجهي الرسمي فوراً
  if (!rawLogo || rawLogo.trim() === "" || rawLogo.includes("ui-avatars")) {
    return getBrandLogoSvg(providerName);
  }
  if (rawLogo.startsWith("http://") || rawLogo.startsWith("https://")) {
    return rawLogo;
  }
  const clean = rawLogo.startsWith("/") ? rawLogo : `/${rawLogo}`;
  return `https://image.tmdb.org/t/p/w500${clean}`;
}

export function getFallbackLogo(name: string): string {
  return getBrandLogoSvg(name);
}