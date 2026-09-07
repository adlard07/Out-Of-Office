import type { Trip } from "./types";

export function checklistProgress(trip: Trip): { done: number; total: number; pct: number } {
  const items = trip.checklist.flatMap((s) => s.items);
  const done = items.filter((i) => i.done).length;
  const total = items.length || 1;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function packingProgress(trip: Trip): { done: number; total: number; pct: number } {
  const done = trip.packing.filter((i) => i.packed).length;
  const total = trip.packing.length || 1;
  return { done, total, pct: Math.round((done / total) * 100) };
}

/** Overall trip-readiness blends the prep checklist and the packing list. */
export function tripReadiness(trip: Trip): number {
  const c = checklistProgress(trip);
  const p = packingProgress(trip);
  return Math.round(c.pct * 0.7 + p.pct * 0.3);
}
