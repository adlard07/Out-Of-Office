import type { ApiChecklistCategory, ApiChecklistItemCreate } from "@/services/dto";

/**
 * The backend stores checklist items as a flat list under four fixed categories
 * (`ChecklistCategory` in `backend/app/schemas/common.py`). These are the display
 * details for each category and the starter items posted when a trip is created.
 */
export const CHECKLIST_CATEGORIES: ApiChecklistCategory[] = [
  "Documents",
  "Bookings",
  "Money",
  "Packing",
];

export const CHECKLIST_SECTION_META: Record<ApiChecklistCategory, { title: string; icon: string }> = {
  Documents: { title: "Documents", icon: "📄" },
  Bookings: { title: "Bookings", icon: "🧳" },
  Money: { title: "Money", icon: "💳" },
  Packing: { title: "Health & packing", icon: "🩺" },
};

/** Posted to `POST /trips/{id}/checklist` once, right after a trip is planned. */
export const CHECKLIST_SEED: ApiChecklistItemCreate[] = [
  { category: "Documents", label: "Passports valid 6+ months" },
  { category: "Documents", label: "Visa / visa-on-arrival confirmed" },
  { category: "Documents", label: "Travel insurance for two" },
  { category: "Documents", label: "Print + digital copies of everything" },
  { category: "Bookings", label: "Flights booked & seats chosen" },
  { category: "Bookings", label: "All hotels / stays confirmed" },
  { category: "Bookings", label: "Airport transfer arranged" },
  { category: "Bookings", label: "Key activities pre-booked" },
  { category: "Money", label: "Forex / local currency ordered" },
  { category: "Money", label: "Some cash for arrival" },
  { category: "Money", label: "International transactions enabled on cards" },
  { category: "Money", label: "Travel card topped up" },
  { category: "Packing", label: "Medicines + basic first aid" },
  { category: "Packing", label: "Any recommended vaccinations" },
  { category: "Packing", label: "eSIM / roaming sorted" },
  { category: "Packing", label: "Someone has our itinerary" },
];
