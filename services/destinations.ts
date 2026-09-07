import { apiGet, apiPost } from "@/lib/api";
import type { Destination, DiscoveryPreferences } from "@/lib/types";
import type { ApiDestination, ApiSurpriseResponse } from "./dto";
import { fitScore, mapDestination, toDiscoveryRequest } from "./map";
import type { DestinationRecommendation, SurpriseResult } from "./types";

/** `/api/v1/destinations` — LLM discovery, the shortlist, and the wheel's surprise pick. */
export const destinations = {
  /** POST /destinations/discover — suggestions are generated *and* persisted server-side. */
  async discover(prefs: DiscoveryPreferences): Promise<DestinationRecommendation[]> {
    const rows = await apiPost<ApiDestination[]>("/destinations/discover", toDiscoveryRequest(prefs));
    return rows
      .map(mapDestination)
      .map((destination) => ({
        destination,
        matchScore: fitScore(destination, prefs),
        reason: destination.whyItSuitsUs,
        estimatedCostForTwo: destination.estimatedCostForTwo,
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  async shortlist(signal?: AbortSignal): Promise<Destination[]> {
    const rows = await apiGet<ApiDestination[]>("/destinations/shortlist", undefined, signal);
    return rows.map(mapDestination);
  },

  async setShortlisted(id: string, shortlisted: boolean): Promise<Destination> {
    const row = await apiPost<ApiDestination>(`/destinations/${id}/shortlist`, undefined, {
      shortlisted,
    });
    return mapDestination(row);
  },

  /** POST /destinations/surprise — a random pick from the given ids (or the shortlist) + 3 clues. */
  async surprise(destinationIds: string[] = []): Promise<SurpriseResult> {
    const result = await apiPost<ApiSurpriseResponse>("/destinations/surprise", {
      destination_ids: destinationIds,
    });
    return { destination: mapDestination(result.destination), clues: result.clues };
  },
};
