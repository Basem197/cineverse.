// Path: cineverse/frontend/src/services/api.ts

import {
  ApiResponse,
  PaginatedTitles,
  Title,
  AvailabilityItem,
  FamilyGuide,
  Genre,
} from "@/types";

const API_BASE_URL = "http://127.0.0.1/cineverse/public/api";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cineverse_token")
      : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "فشل الاتصال بالخادم");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "حدث خطأ أثناء جلب البيانات من الخادم");
  }
}

// 1. جلب قائمة الأفلام مع دعم البحث والصفحات والتصنيف
export async function getTitles(params?: {
  search?: string;
  page?: number;
  limit?: number;
  genre_id?: number;
}): Promise<ApiResponse<PaginatedTitles>> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.genre_id) query.append("genre_id", params.genre_id.toString());

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return fetchApi<PaginatedTitles>(`/titles${queryString}`);
}

// 2. جلب تفاصيل فيلم ومراجعاته
export async function getTitleDetails(
  id: string | number
): Promise<ApiResponse<Title>> {
  return fetchApi<Title>(`/title/${id}`);
}

// 3. جلب منصات المشاهدة الرسمية حسب كود الدولة (EG, SA, AE...)
export async function getTitleAvailability(
  id: string | number,
  countryCode: string = "EG"
): Promise<ApiResponse<AvailabilityItem[]>> {
  return fetchApi<AvailabilityItem[]>(
    `/titles/${id}/availability?country=${countryCode}`
  );
}

// 4. جلب تقرير دليل الرقابة العائلية (Family Guide)
export async function getFamilyGuide(
  id: string | number
): Promise<ApiResponse<FamilyGuide>> {
  return fetchApi<FamilyGuide>(`/titles/${id}/family-guide`);
}

// 5. جلب كافة التصنيفات السينمائية
export async function getGenres(): Promise<ApiResponse<Genre[]>> {
  return fetchApi<Genre[]>(`/genres`);
}

// 6. تسجيل نقرة الرابط التسويقي (Affiliate Tracking) لحساب العمولات
export async function trackAffiliateClick(payload: {
  title_id?: number;
  provider_id?: number;
  country_id?: number;
}): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/affiliate/track`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}