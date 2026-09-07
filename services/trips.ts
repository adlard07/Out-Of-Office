import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  Activity,
  ItineraryIntake,
  PackingItem,
  Trip,
  TripSummary,
} from "@/lib/types";
import type {
  ApiBudgetSummary,
  ApiChecklistItem,
  ApiChecklistResponse,
  ApiExpense,
  ApiPackingItem,
  ApiTrip,
  ApiTripRead,
  ApiTripSummary,
  ApiTripUpdate,
} from "./dto";
import { mapPackingItem, mapTrip, mapTripSummary, toPlanTripRequest } from "./map";
import { CHECKLIST_SEED } from "@/data/checklistTemplate";

interface PlanDestination {
  name: string;
  country: string;
  id?: string;
}

/** `/api/v1/trips` — planning, reading and editing a trip. */
export const trips = {
  /**
   * POST /trips/plan. This is both "create trip" and "generate itinerary" — the
   * backend has no way to add an itinerary to an existing trip, so the two are one
   * call. The preparation checklist is seeded straight afterwards because a planned
   * trip starts with no checklist rows.
   */
  async plan(intake: ItineraryIntake, destination: PlanDestination): Promise<Trip> {
    const created = await apiPost<ApiTrip>("/trips/plan", toPlanTripRequest(intake, destination));
    await Promise.allSettled(
      CHECKLIST_SEED.map((item) =>
        apiPost<ApiChecklistItem>(`/trips/${created.id}/checklist`, item),
      ),
    );
    return trips.get(created.id);
  },

  async upcoming(signal?: AbortSignal): Promise<TripSummary[]> {
    const rows = await apiGet<ApiTripSummary[]>("/trips/upcoming", undefined, signal);
    return rows.map(mapTripSummary);
  },

  /** The screen needs trip + budget + checklist + expenses; fetch them together. */
  async get(id: string, signal?: AbortSignal): Promise<Trip> {
    const [trip, budget, checklist, expenseRows] = await Promise.all([
      apiGet<ApiTripRead>(`/trips/${id}`, undefined, signal),
      apiGet<ApiBudgetSummary>(`/trips/${id}/budget`, undefined, signal),
      apiGet<ApiChecklistResponse>(`/trips/${id}/checklist`, undefined, signal),
      apiGet<ApiExpense[]>(`/trips/${id}/expenses`, undefined, signal),
    ]);
    return mapTrip(trip, { budget, checklist: checklist.items, expenses: expenseRows });
  },

  update(id: string, patch: ApiTripUpdate): Promise<ApiTrip> {
    return apiPatch<ApiTrip>(`/trips/${id}`, patch);
  },

  remove(id: string): Promise<void> {
    return apiDelete(`/trips/${id}`);
  },

  /** POST /trips/{id}/itinerary/edit — plain-English rewrite of the whole plan. */
  editItinerary(id: string, instruction: string): Promise<ApiTrip> {
    return apiPost<ApiTrip>(`/trips/${id}/itinerary/edit`, { instruction });
  },

  setActivity(
    id: string,
    activityId: string,
    patch: { completed?: boolean; moveToDay?: number },
  ): Promise<ApiTrip> {
    return apiPatch<ApiTrip>(`/trips/${id}/itinerary/activities/${activityId}`, {
      ...(patch.completed !== undefined && { completed: patch.completed }),
      ...(patch.moveToDay !== undefined && { move_to_day: patch.moveToDay }),
    });
  },

  /** This DELETE answers with the updated trip rather than 204. */
  removeActivity(id: string, activityId: string): Promise<ApiTrip> {
    return apiDelete<ApiTrip>(`/trips/${id}/itinerary/activities/${activityId}`);
  },

  async generatePacking(id: string, weather?: string): Promise<PackingItem[]> {
    const rows = await apiPost<ApiPackingItem[]>(`/trips/${id}/packing/generate`, {
      weather: weather ?? null,
    });
    return rows.map(mapPackingItem);
  },

  async story(id: string, regenerate = false): Promise<string> {
    const response = await apiPost<{ story: string }>(`/trips/${id}/story`, undefined, {
      regenerate,
    });
    return response.story;
  },
};

/**
 * The backend has no "add activity" route, so a manual addition is phrased as an
 * instruction for the itinerary editor. Keeps one source of truth for the plan.
 */
export function addActivityInstruction(dayNumber: number, activity: Activity): string {
  const duration = activity.durationMins ? `about ${activity.durationMins} minutes` : "a short slot";
  return [
    `Add this to day ${dayNumber} and change nothing else:`,
    `"${activity.title}" at ${activity.time}`,
    activity.location ? `at ${activity.location}` : "",
    `(${activity.category}, ${duration}, roughly ${Math.round(activity.cost)} for two).`,
    activity.description ? `Notes: ${activity.description}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function replaceActivityInstruction(activity: Activity, cheaper: boolean): string {
  return cheaper
    ? `Replace "${activity.title}" with a noticeably cheaper alternative that keeps the same time slot and spirit. Change nothing else.`
    : `Replace "${activity.title}" with a different activity of similar cost in the same time slot. Change nothing else.`;
}
