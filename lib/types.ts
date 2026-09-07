/** Shared domain model for our private travel universe. */

export type TravelMood =
  | "beach"
  | "mountains"
  | "adventure"
  | "romantic"
  | "food"
  | "culture"
  | "luxury"
  | "roadtrip"
  | "random";

export interface MoodOption {
  id: TravelMood;
  label: string;
  emoji: string;
  blurb: string;
}

export interface AccommodationOption {
  name: string;
  style: string;
  pricePerNight: number;
  rating: number;
  image: string;
}

export interface TravelOption {
  mode: "flight" | "train" | "drive" | "ferry";
  label: string;
  duration: string;
  approxCost: number;
  note?: string;
}

export interface Experience {
  title: string;
  description: string;
  approxCost: number;
  tag: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  gallery: string[];
  tagline: string;
  whyItSuitsUs: string;
  whyWeWouldLoveIt: string;
  estimatedCostForTwo: number;
  recommendedDays: number;
  bestMonths: string[];
  vibeTags: string[];
  moods: TravelMood[];
  overview: string;
  experiences: Experience[];
  accommodation: AccommodationOption[];
  travelOptions: TravelOption[];
  itineraryPreview: string[];
}

export interface DiscoveryPreferences {
  budgetForTwo: number;
  days: number;
  month: string;
  mood: TravelMood;
  /** Free text describing the trip they want. Outweighs `mood` in the backend prompt. */
  notes: string;
}

/* ---------- Trips & itinerary ---------- */

export type ItineraryPace = "relaxed" | "balanced" | "packed";

export interface Activity {
  id: string;
  time: string; // "9:00 AM"
  title: string;
  description: string;
  location: string;
  durationMins: number;
  cost: number; // for two, INR
  category: BudgetCategory;
  completed?: boolean;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string; // "Ubud"
  summary: string;
  activities: Activity[];
}

export interface ItineraryIntake {
  destinationId: string;
  days: number;
  startDate: string; // ISO date, sent to POST /trips/plan
  endDate: string; // ISO date, derived from startDate + days
  maxBudget: number;
  pace: ItineraryPace;
  foodPreference: string;
  adventureLevel: number; // 0-100
  shopping: boolean;
  nightlife: boolean;
  mustDo: string[];
}

/* ---------- Budget ---------- */

export type BudgetCategory =
  | "flights"
  | "hotels"
  | "food"
  | "transport"
  | "activities"
  | "shopping"
  | "misc"
  | "buffer";

export interface BudgetLine {
  category: BudgetCategory;
  planned: number;
  actual: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: BudgetCategory;
  description: string;
  date: string; // ISO
  location?: string;
}

/* ---------- Checklist ---------- */

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

export interface PackingItem {
  id: string;
  label: string;
  qty?: string;
  packed: boolean;
  reason: string;
}

/* ---------- The trip aggregate ---------- */

export type TripStatus = "draft" | "upcoming" | "completed";

export interface Trip {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  heroImage: string;
  startDate: string; // ISO
  endDate: string; // ISO
  days: number;
  totalBudget: number;
  status: TripStatus;
  pace: ItineraryPace;
  itinerary: ItineraryDay[];
  budgetLines: BudgetLine[];
  expenses: Expense[];
  checklist: ChecklistSection[];
  packing: PackingItem[];
  story?: string;
}

/** Lightweight row from `GET /trips/upcoming` — enough for lists and the homepage. */
export interface TripSummary {
  id: string;
  destinationName: string;
  country: string;
  heroImage: string;
  startDate: string;
  endDate: string;
  days: number;
  totalBudget: number;
  status: TripStatus;
  actualSpend: number;
  preparationProgress: number;
  itinerarySummary: string[];
}

/* ---------- Memory book (past trips) ---------- */

export interface Memory {
  id: string;
  image: string;
  caption: string;
  span?: "tall" | "wide" | "normal";
}

export interface Adventure {
  id: string;
  destinationName: string;
  country: string;
  heroImage: string;
  startDate: string;
  endDate: string;
  days: number;
  actualSpend: number;
  placesVisited: string[];
  favouriteMemory: string;
  favouriteActivity: string;
  tripStory: string;
  expenseSummary: BudgetLine[];
  memories: Memory[];
}

/* ---------- Wheel ---------- */

export interface WheelEntry {
  id: string;
  name: string;
  country: string;
  image: string;
}

/* ---------- Travel fund ---------- */

/** A manual movement of money. Monthly contributions are derived, not stored. */
export type FundEntryKind = "deposit" | "withdrawal";

export interface FundEntry {
  id: string;
  month: string; // "YYYY-MM" the entry belongs to
  amount: number; // always positive; direction comes from `kind`
  kind: FundEntryKind;
  note?: string;
  createdAt: string; // ISO
}

/** Per-person monthly contribution, effective from a given month onward. */
export interface FundRate {
  fromMonth: string; // "YYYY-MM"
  perPerson: number;
}

export interface TravelFund {
  /** Display only — "saving together since". */
  since: string; // ISO date
  /** How many of us are contributing. */
  people: number;
  /** Per-person contribution history, ascending by `fromMonth`. */
  rates: FundRate[];
  /** The month the stated balance is accurate as of. */
  anchorMonth: string; // "YYYY-MM"
  /** Fund total at the end of `anchorMonth`. Monthly contributions accrue after it. */
  anchorBalance: number;
  /** Manual deposits, withdrawals and corrections. */
  entries: FundEntry[];
}
