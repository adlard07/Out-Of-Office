/**
 * Wire domain conversion.
 *
 * The backend owns the trip data; it does not own presentation. Anything it has no
 * column for — hero imagery, galleries, the curated experience/stay/travel copy —
 * is filled in from the local atlas (`data/destinations.ts`) when the destination
 * matches one we already have art for, and left empty otherwise. Components must
 * therefore treat those arrays as possibly empty.
 */
import type {
  Activity,
  Adventure,
  BudgetLine,
  ChecklistSection,
  Destination,
  DiscoveryPreferences,
  Expense,
  ItineraryDay,
  ItineraryIntake,
  Memory,
  PackingItem,
  TravelMood,
  Trip,
  TripSummary,
} from "@/lib/types";
import type {
  ApiActivity,
  ApiAdventure,
  ApiBudgetSummary,
  ApiCategoryLine,
  ApiChecklistItem,
  ApiDestination,
  ApiDiscoveryRequest,
  ApiExpense,
  ApiExpenseCreate,
  ApiItineraryDay,
  ApiMemory,
  ApiPackingItem,
  ApiPlanTripRequest,
  ApiTrip,
  ApiTripRead,
  ApiTripSummary,
} from "./dto";
import { DESTINATIONS } from "@/data/destinations";
import { CHECKLIST_CATEGORIES, CHECKLIST_SECTION_META } from "@/data/checklistTemplate";
import { fallbackPhoto } from "@/lib/images";
import { formatDay } from "@/lib/date";
import { MOODS } from "@/data/moods";

/* ---------------------------------------------------------------- *
 * Small conversions
 * ---------------------------------------------------------------- */

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TIME_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;

/** Backend "14:00" (or an LLM's "2:00 PM") becomes the UI's "2:00 PM". */
export function toDisplayTime(raw: string): string {
  const match = raw.trim().match(TIME_RE);
  if (!match) return raw;
  const [, rawHour, minutes, meridiem] = match;
  let hour = Number(rawHour);
  if (meridiem) return `${((hour + 11) % 12) + 1}:${minutes} ${meridiem.toUpperCase()}`;
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour}:${minutes} ${period}`;
}

/** The UI's "2:00 PM" becomes backend "14:00". */
export function toApiTime(display: string): string {
  const match = display.trim().match(TIME_RE);
  if (!match) return display;
  const [, rawHour, minutes, meridiem] = match;
  let hour = Number(rawHour);
  const period = meridiem?.toUpperCase();
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

const MOOD_IDS = new Set<string>(MOODS.map((m) => m.id));

function moodsFrom(vibes: string[]): TravelMood[] {
  const matched = vibes
    .map((v) => slugify(v))
    .filter((v) => MOOD_IDS.has(v) && v !== "random") as TravelMood[];
  return matched.length ? [...new Set(matched)] : ["random"];
}

/** The curated local entry for a destination name, when we happen to have one. */
export function localAtlasEntry(name: string): Destination | undefined {
  const slug = slugify(name);
  return DESTINATIONS.find((d) => slugify(d.name) === slug || d.id === slug);
}

export function heroImageFor(name: string, seed: string): string {
  return localAtlasEntry(name)?.image ?? fallbackPhoto(seed, 2000, 1200);
}

/* ---------------------------------------------------------------- *
 * Destinations
 * ---------------------------------------------------------------- */

export function toDiscoveryRequest(prefs: DiscoveryPreferences): ApiDiscoveryRequest {
  const moods =
    prefs.mood === "random"
      ? MOODS.filter((m) => m.id !== "random").map((m) => m.label)
      : [MOODS.find((m) => m.id === prefs.mood)?.label ?? prefs.mood];
  return {
    budget: prefs.budgetForTwo,
    duration_days: prefs.days,
    travel_month: prefs.month,
    travel_moods: moods,
    notes: prefs.notes.trim() || null,
  };
}

export function mapDestination(dto: ApiDestination): Destination {
  const local = localAtlasEntry(dto.name);
  return {
    id: dto.id,
    name: dto.name,
    country: dto.country,
    region: local?.region ?? dto.country,
    image: dto.image_url ?? local?.image ?? fallbackPhoto(dto.id),
    gallery: local?.gallery ?? [],
    tagline: dto.short_description,
    whyItSuitsUs: dto.why_us,
    whyWeWouldLoveIt: local?.whyWeWouldLoveIt ?? dto.short_description,
    estimatedCostForTwo: dto.estimated_total_cost,
    recommendedDays: dto.recommended_duration,
    bestMonths: dto.best_months,
    vibeTags: dto.travel_vibes,
    moods: moodsFrom(dto.travel_vibes),
    overview: local?.overview ?? dto.short_description,
    experiences: local?.experiences ?? [],
    accommodation: local?.accommodation ?? [],
    travelOptions: local?.travelOptions ?? [],
    itineraryPreview: local?.itineraryPreview ?? [],
  };
}

/**
 * How well a suggestion lines up with what was asked for. The backend returns the
 * reasoning but no number, so the badge is computed here — deterministically, from
 * the same four inputs the user set.
 */
export function fitScore(destination: Destination, prefs: DiscoveryPreferences): number {
  let score = 45;
  if (prefs.mood === "random" || destination.moods.includes(prefs.mood)) score += 25;

  const ratio = prefs.budgetForTwo / (destination.estimatedCostForTwo || prefs.budgetForTwo);
  score += ratio >= 1 ? 18 : ratio >= 0.8 ? 8 : -14;

  score += Math.max(0, 12 - Math.abs(destination.recommendedDays - prefs.days) * 3);

  const month = prefs.month.toLowerCase();
  if (destination.bestMonths.some((m) => m.toLowerCase() === month)) score += 14;

  return Math.max(6, Math.min(99, Math.round(score)));
}

/* ---------------------------------------------------------------- *
 * Itinerary
 * ---------------------------------------------------------------- */

export function mapActivity(dto: ApiActivity): Activity {
  return {
    id: dto.id,
    time: toDisplayTime(dto.start_time),
    title: dto.title,
    description: dto.description,
    location: dto.location,
    durationMins: dto.duration_minutes,
    cost: dto.estimated_cost,
    category: dto.category,
    completed: dto.completed,
  };
}

export function mapItineraryDay(dto: ApiItineraryDay): ItineraryDay {
  return {
    id: `day-${dto.day}`,
    dayNumber: dto.day,
    title: dto.title,
    summary: dto.date ? formatDay(dto.date) : "",
    activities: dto.activities.map(mapActivity),
  };
}

/* ---------------------------------------------------------------- *
 * Budget, checklist, packing
 * ---------------------------------------------------------------- */

export function mapBudgetLine(dto: ApiCategoryLine): BudgetLine {
  return { category: dto.category, planned: dto.planned, actual: dto.actual };
}

export function mapBudgetLines(summary: ApiBudgetSummary | null): BudgetLine[] {
  return (summary?.category_breakdown ?? []).map(mapBudgetLine);
}

export function mapExpense(dto: ApiExpense): Expense {
  return {
    id: dto.id,
    amount: dto.amount,
    category: dto.category,
    description: dto.description,
    date: dto.date,
    location: dto.location ?? undefined,
  };
}

export function toExpenseCreate(expense: Omit<Expense, "id">): ApiExpenseCreate {
  return {
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    date: expense.date,
    location: expense.location?.trim() ? expense.location : null,
  };
}

/** The flat backend list becomes the four display sections, empty ones dropped. */
export function mapChecklist(items: ApiChecklistItem[]): ChecklistSection[] {
  return CHECKLIST_CATEGORIES.map((category) => ({
    id: category,
    title: CHECKLIST_SECTION_META[category].title,
    icon: CHECKLIST_SECTION_META[category].icon,
    items: items
      .filter((item) => item.category === category)
      .map((item) => ({ id: item.id, label: item.label, done: item.completed })),
  })).filter((section) => section.items.length > 0);
}

export function mapPackingItem(dto: ApiPackingItem): PackingItem {
  return {
    id: dto.id,
    label: dto.label,
    qty: dto.quantity ?? undefined,
    packed: dto.packed,
    reason: dto.reason,
  };
}

/* ---------------------------------------------------------------- *
 * Trips
 * ---------------------------------------------------------------- */

export interface TripParts {
  budget?: ApiBudgetSummary | null;
  checklist?: ApiChecklistItem[];
  expenses?: ApiExpense[];
}

export function mapTrip(dto: ApiTrip | ApiTripRead, parts: TripParts = {}): Trip {
  return {
    id: dto.id,
    destinationId: slugify(dto.destination),
    destinationName: dto.destination,
    country: dto.country,
    heroImage: heroImageFor(dto.destination, dto.id),
    startDate: dto.start_date,
    endDate: dto.end_date,
    days: dto.duration_days,
    totalBudget: dto.total_budget,
    status: dto.status,
    pace: dto.preferences?.pace ?? "balanced",
    itinerary: (dto.itinerary ?? []).map(mapItineraryDay),
    budgetLines: mapBudgetLines(parts.budget ?? null),
    expenses: (parts.expenses ?? []).map(mapExpense),
    checklist: mapChecklist(parts.checklist ?? []),
    packing: (dto.packing ?? []).map(mapPackingItem),
    story: dto.story ?? undefined,
  };
}

/**
 * Endpoints that mutate the itinerary return the trip alone (no budget, checklist or
 * expenses). Keep what we already loaded rather than blanking the rest of the screen.
 */
export function mergeTrip(existing: Trip | undefined, dto: ApiTrip): Trip {
  const next = mapTrip(dto);
  if (!existing) return next;
  return {
    ...next,
    budgetLines: existing.budgetLines,
    expenses: existing.expenses,
    checklist: existing.checklist,
  };
}

export function mapTripSummary(dto: ApiTripSummary): TripSummary {
  return {
    id: dto.id,
    destinationName: dto.destination,
    country: dto.country,
    heroImage: heroImageFor(dto.destination, dto.id),
    startDate: dto.start_date,
    endDate: dto.end_date,
    days: dto.duration_days,
    totalBudget: dto.total_budget,
    status: dto.status,
    actualSpend: dto.actual_spend,
    preparationProgress: dto.preparation_progress,
    itinerarySummary: dto.itinerary_summary,
  };
}

export function toPlanTripRequest(
  intake: ItineraryIntake,
  destination: { name: string; country: string; id?: string },
): ApiPlanTripRequest {
  return {
    destination: destination.name,
    destination_id: destination.id ?? null,
    country: destination.country,
    start_date: intake.startDate,
    end_date: intake.endDate,
    max_budget: intake.maxBudget,
    pace: intake.pace,
    food_preferences: intake.foodPreference,
    adventure_level: intake.adventureLevel,
    shopping_preference: intake.shopping,
    nightlife_preference: intake.nightlife,
    must_do_activities: intake.mustDo,
  };
}

/* ---------------------------------------------------------------- *
 * Memories and adventures
 * ---------------------------------------------------------------- */

/** Vary the masonry tiles deterministically — the backend has no aspect metadata. */
function spanFor(index: number): Memory["span"] {
  if (index % 5 === 0) return "tall";
  if (index % 7 === 3) return "wide";
  return "normal";
}

export function mapMemory(dto: ApiMemory, index = 0): Memory {
  return {
    id: dto.id,
    image: dto.image_url ?? fallbackPhoto(dto.id),
    caption: dto.caption ?? "",
    span: spanFor(index),
  };
}

export function mapAdventure(dto: ApiAdventure): Adventure {
  return {
    id: dto.id,
    destinationName: dto.destination,
    country: dto.country,
    heroImage: dto.hero_image ?? heroImageFor(dto.destination, dto.id),
    startDate: dto.start_date,
    endDate: dto.end_date,
    days: dto.duration_days,
    actualSpend: dto.total_expense,
    placesVisited: dto.places_visited,
    favouriteMemory: dto.favourite_memory ?? "",
    favouriteActivity: dto.favourite_activity ?? "",
    tripStory: dto.trip_story ?? "",
    expenseSummary: dto.expense_summary.map(mapBudgetLine),
    memories: dto.memories.map(mapMemory),
  };
}
