// Path: cineverse/frontend/src/types/index.ts

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Title {
  id: number;
  tmdb_id?: number | null;
  title: string;
  description: string | null;
  release_year: number | null;
  poster_path: string | null;
  backdrop_path: string | null;
  rating: string | number | null;
  created_at?: string;
}

export interface AvailabilityItem {
  provider_name: string;
  provider_logo: string | null;
  country_code: string;
  country_name: string;
  availability_type: "subscription" | "rent" | "buy" | "free" | "ads" | string;
  official_url: string;
  affiliate_url: string | null;
  verified_at: string | null;
}

export interface FamilyGuide {
  age_recommendation?: string;
  violence?: string;
  language?: string;
  sexual_content?: string;
  drugs?: string;
  fear?: string;
  parent_note?: string;
  overall_level?: string;
}

export interface Review {
  id: number;
  user_id: number;
  title_id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedTitles {
  data: Title[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}