import type { TravelDataService, FlightQuote, HotelQuote, GeoPoint } from "./types";
import { getDestination } from "@/data/destinations";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const AIRLINES = ["IndiGo", "Singapore Airlines", "Malaysia Airlines", "Vistara", "Thai Airways", "Emirates"];

export const travelMock: TravelDataService = {
  async searchFlights(from, to, month): Promise<FlightQuote[]> {
    await wait(700);
    const seed = (from.length + to.length + month.length) % 5;
    return Array.from({ length: 4 }, (_, i) => ({
      id: `fl-${i}`,
      airline: AIRLINES[(seed + i) % AIRLINES.length],
      from,
      to,
      stops: i === 0 ? 0 : i === 3 ? 2 : 1,
      durationHours: 5 + i * 1.5 + seed * 0.5,
      priceForTwo: 24000 + i * 9000 + seed * 2000,
    }));
  },

  async searchHotels(destinationId): Promise<HotelQuote[]> {
    await wait(600);
    const d = getDestination(destinationId);
    if (!d) return [];
    return d.accommodation.map((a, i) => ({
      id: `ht-${i}`,
      name: a.name,
      area: d.region,
      rating: a.rating,
      pricePerNight: a.pricePerNight,
      image: a.image,
    }));
  },

  async geocode(query): Promise<GeoPoint | null> {
    await wait(200);
    // Deterministic pseudo-coordinates so a real map layer can be dropped in later.
    const h = [...query].reduce((s, c) => s + c.charCodeAt(0), 0);
    return { label: query, lat: (h % 140) - 70 + (h % 100) / 100, lng: (h % 340) - 170 };
  },
};
