// Path: cineverse/frontend/src/utils/imageUtils.ts

export function getProviderLogoUrl(rawLogo: string | null | undefined, providerName: string = ""): string {
  if (!rawLogo || rawLogo.trim() === "") {
    return getFallbackLogo(providerName);
  }

  if (rawLogo.startsWith("http://") || rawLogo.startsWith("https://")) {
    return rawLogo;
  }

  if (rawLogo.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w200${rawLogo}`;
  }

  return `https://image.tmdb.org/t/p/w200/${rawLogo}`;
}

export function getFallbackLogo(name: string): string {
  const cleanName = encodeURIComponent(name || "TV");
  return `https://ui-avatars.com/api/?name=${cleanName}&background=0f141f&color=f59e0b&bold=true&length=2&size=128`;
}