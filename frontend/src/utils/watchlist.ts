// Path: cineverse/frontend/src/utils/watchlist.ts
import { Title } from "@/types";

const STORAGE_KEY = "cineverse_watchlist";

export function getWatchlist(): Title[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isInWatchlist(id: number): boolean {
  const list = getWatchlist();
  return list.some((item) => item.id === id);
}

export function toggleWatchlist(title: Title): boolean {
  if (typeof window === "undefined") return false;
  const list = getWatchlist();
  const exists = list.some((item) => item.id === title.id);

  let updated: Title[];
  if (exists) {
    updated = list.filter((item) => item.id !== title.id);
  } else {
    updated = [title, ...list];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // إطلاق حدث عام لتحديث العداد في الواجهة لحظياً
  window.dispatchEvent(new Event("watchlist_changed"));
  return !exists;
}

export function removeFromWatchlist(id: number): void {
  if (typeof window === "undefined") return;
  const list = getWatchlist();
  const updated = list.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("watchlist_changed"));
}