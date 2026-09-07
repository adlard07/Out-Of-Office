import { apiGet } from "@/lib/api";
import type { Adventure } from "@/lib/types";
import type { ApiAdventure } from "./dto";
import { mapAdventure } from "./map";

/** `/api/v1/adventures` — the memory book, built from trips with status "completed". */
export const adventures = {
  async list(signal?: AbortSignal): Promise<Adventure[]> {
    const rows = await apiGet<ApiAdventure[]>("/adventures", undefined, signal);
    return rows.map(mapAdventure);
  },

  async get(id: string, signal?: AbortSignal): Promise<Adventure> {
    return mapAdventure(await apiGet<ApiAdventure>(`/adventures/${id}`, undefined, signal));
  },
};
