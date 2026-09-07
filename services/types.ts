import type { Destination } from "@/lib/types";

/**
 * Result shapes shared between the API clients and the UI.
 *
 * The trip/destination services in this folder now talk to the real backend
 * (`services/*.ts` + `lib/api.ts`). What remains mocked is flights/hotels/geocoding,
 * which the backend has no endpoints for — see `travel.mock.ts`.
 */

export interface DestinationRecommendation {
  destination: Destination;
  matchScore: number; // 0-100, computed client-side from the search preferences
  reason: string; // the backend's own "why this suits you" note
  estimatedCostForTwo: number;
}

export interface SurpriseResult {
  destination: Destination;
  clues: string[];
}

export interface ItineraryEditResult {
  message: string;
  changed: string[]; // activity ids that appeared or changed
  budgetWarning?: string;
}

/* ---- Travel data services (flights / hotels / maps) — still mocked ---- */

export interface FlightQuote {
  id: string;
  airline: string;
  from: string;
  to: string;
  stops: number;
  durationHours: number;
  priceForTwo: number;
}

export interface HotelQuote {
  id: string;
  name: string;
  area: string;
  rating: number;
  pricePerNight: number;
  image: string;
}

export interface GeoPoint {
  label: string;
  lat: number;
  lng: number;
}

export interface TravelDataService {
  searchFlights(from: string, to: string, month: string): Promise<FlightQuote[]>;
  searchHotels(destinationId: string): Promise<HotelQuote[]>;
  geocode(query: string): Promise<GeoPoint | null>;
}
