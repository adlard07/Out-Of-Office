/**
 * Wire types — a 1:1 mirror of the backend's Pydantic schemas (`backend/app/schemas`).
 *
 * These stay snake_case and are never used by components directly; `services/map.ts`
 * converts them to the camelCase domain model in `lib/types.ts`.
 */

export type ApiBudgetCategory =
  | "flights"
  | "hotels"
  | "food"
  | "transport"
  | "activities"
  | "shopping"
  | "misc"
  | "buffer";

export type ApiTripStatus = "draft" | "upcoming" | "completed";
export type ApiPace = "relaxed" | "balanced" | "packed";
export type ApiChecklistCategory = "Documents" | "Bookings" | "Money" | "Packing";

/* ---------- destinations ---------- */

export interface ApiDiscoveryRequest {
  budget: number;
  duration_days: number;
  travel_month: string;
  travel_moods: string[];
  origin_city?: string | null;
  notes?: string | null;
}

export interface ApiDestination {
  id: string;
  name: string;
  country: string;
  short_description: string;
  why_us: string;
  estimated_total_cost: number;
  recommended_duration: number;
  best_months: string[];
  travel_vibes: string[];
  shortlisted: boolean;
  image_url: string | null;
  created_at: string;
}

export interface ApiSurpriseRequest {
  destination_ids?: string[];
  budget?: number | null;
  duration_days?: number | null;
}

export interface ApiSurpriseResponse {
  destination: ApiDestination;
  clues: string[];
}

/* ---------- trips ---------- */

export interface ApiActivity {
  id: string;
  start_time: string; // "14:00"
  title: string;
  description: string;
  estimated_cost: number;
  duration_minutes: number;
  location: string;
  category: ApiBudgetCategory;
  completed: boolean;
}

export interface ApiItineraryDay {
  day: number;
  date: string | null;
  title: string;
  activities: ApiActivity[];
}

export type ApiPlannedBudget = Record<ApiBudgetCategory, number>;

export interface ApiTripPreferences {
  pace: ApiPace;
  food_preferences: string;
  adventure_level: number;
  nightlife: boolean;
  shopping: boolean;
  must_do_activities: string[];
}

export interface ApiPackingItem {
  id: string;
  label: string;
  quantity: string | null;
  packed: boolean;
  reason: string;
}

export interface ApiTrip {
  id: string;
  destination: string;
  country: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  duration_days: number;
  total_budget: number;
  status: ApiTripStatus;
  itinerary: ApiItineraryDay[];
  planned_budget: ApiPlannedBudget;
  preferences: ApiTripPreferences;
  packing: ApiPackingItem[];
  story: string | null;
  favourite_memory: string | null;
  favourite_activity: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiTripRead extends ApiTrip {
  actual_spend: number;
  preparation_progress: number;
}

export interface ApiTripSummary {
  id: string;
  destination: string;
  country: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_budget: number;
  status: ApiTripStatus;
  actual_spend: number;
  preparation_progress: number;
  itinerary_summary: string[];
}

export interface ApiPlanTripRequest {
  destination: string;
  destination_id?: string | null;
  country: string;
  start_date: string;
  end_date: string;
  max_budget: number;
  pace: ApiPace;
  food_preferences: string;
  adventure_level: number;
  shopping_preference: boolean;
  nightlife_preference: boolean;
  must_do_activities: string[];
}

export interface ApiTripUpdate {
  status?: ApiTripStatus;
  total_budget?: number;
  start_date?: string;
  end_date?: string;
  favourite_memory?: string;
  favourite_activity?: string;
}

export interface ApiActivityUpdate {
  completed?: boolean;
  move_to_day?: number;
}

/* ---------- budget & expenses ---------- */

export interface ApiExpenseCreate {
  amount: number;
  category: ApiBudgetCategory;
  description: string;
  date: string;
  location?: string | null;
}

export interface ApiExpense extends ApiExpenseCreate {
  id: string;
  trip_id: string;
}

export interface ApiCategoryLine {
  category: ApiBudgetCategory;
  planned: number;
  actual: number;
  remaining: number;
}

export interface ApiBudgetSummary {
  total_budget: number;
  planned_spend: number;
  actual_spend: number;
  remaining_budget: number;
  category_breakdown: ApiCategoryLine[];
  planned_vs_actual: { planned: number; actual: number };
}

/* ---------- checklist ---------- */

export interface ApiChecklistItemCreate {
  category: ApiChecklistCategory;
  label: string;
}

export interface ApiChecklistItem extends ApiChecklistItemCreate {
  id: string;
  trip_id: string;
  completed: boolean;
}

export interface ApiChecklistResponse {
  items: ApiChecklistItem[];
  completion: { total: number; completed: number; percentage: number };
}

/* ---------- memories & adventures ---------- */

export interface ApiUploadUrlRequest {
  filename: string;
  content_type: string;
}

export interface ApiUploadUrlResponse {
  upload_url: string;
  /**
   * Storage key for the uploaded object. NOTE: the backend's routers currently build
   * this as `file_id` (Google Drive) while its schemas declare `s3_key` (S3) — the
   * memory routes are mid-migration and fail at runtime either way. This follows the
   * published OpenAPI schema; if the backend settles on Drive, rename this field and
   * its two uses in `services/memories.ts`.
   */
  s3_key: string;
}

export interface ApiMemoryCreate {
  s3_key: string;
  caption?: string | null;
  captured_at?: string | null;
  location?: string | null;
}

export interface ApiMemory extends ApiMemoryCreate {
  id: string;
  trip_id: string;
  image_url: string | null;
}

export interface ApiAdventure {
  id: string;
  destination: string;
  country: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  hero_image: string | null;
  total_expense: number;
  memory_count: number;
  places_visited: string[];
  favourite_memory: string | null;
  favourite_activity: string | null;
  trip_story: string | null;
  expense_summary: ApiCategoryLine[];
  memories: ApiMemory[];
}
