import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { ChecklistSection } from "@/lib/types";
import type { ApiChecklistCategory, ApiChecklistItem, ApiChecklistResponse } from "./dto";
import { mapChecklist } from "./map";

/** `/api/v1/trips/{id}/checklist`. Items are flat server-side; sections are a view. */
export const checklist = {
  async get(tripId: string): Promise<ChecklistSection[]> {
    const response = await apiGet<ApiChecklistResponse>(`/trips/${tripId}/checklist`);
    return mapChecklist(response.items);
  },

  async items(tripId: string): Promise<ApiChecklistItem[]> {
    return (await apiGet<ApiChecklistResponse>(`/trips/${tripId}/checklist`)).items;
  },

  add(tripId: string, category: ApiChecklistCategory, label: string): Promise<ApiChecklistItem> {
    return apiPost<ApiChecklistItem>(`/trips/${tripId}/checklist`, { category, label });
  },

  setCompleted(tripId: string, itemId: string, completed: boolean): Promise<ApiChecklistItem> {
    return apiPatch<ApiChecklistItem>(`/trips/${tripId}/checklist/${itemId}`, { completed });
  },

  remove(tripId: string, itemId: string): Promise<void> {
    return apiDelete(`/trips/${tripId}/checklist/${itemId}`);
  },
};
