import type { BudgetCategory, BudgetLine, Trip } from "./types";

export const CATEGORY_META: Record<BudgetCategory, { label: string; icon: string; color: string }> = {
  flights: { label: "Flights", icon: "✈️", color: "#f83f63" },
  hotels: { label: "Hotels", icon: "🏨", color: "#eec06a" },
  food: { label: "Food", icon: "🍽️", color: "#7c5cff" },
  transport: { label: "Local Transport", icon: "🚕", color: "#3fbaf8" },
  activities: { label: "Activities", icon: "🎟️", color: "#43d6a0" },
  shopping: { label: "Shopping", icon: "🛍️", color: "#ff8a5c" },
  misc: { label: "Miscellaneous", icon: "✨", color: "#c084fc" },
  buffer: { label: "Emergency Buffer", icon: "🛟", color: "#94a3b8" },
};

export const CATEGORY_ORDER: BudgetCategory[] = [
  "flights",
  "hotels",
  "food",
  "transport",
  "activities",
  "shopping",
  "misc",
  "buffer",
];

export interface BudgetTotals {
  totalBudget: number;
  estimatedSpend: number;
  actualSpend: number;
  remaining: number;
  allocatedPct: number;
}

export function budgetTotals(trip: Trip): BudgetTotals {
  const estimatedSpend = trip.budgetLines.reduce((s, l) => s + l.planned, 0);
  const actualSpend = trip.budgetLines.reduce((s, l) => s + l.actual, 0);
  return {
    totalBudget: trip.totalBudget,
    estimatedSpend,
    actualSpend,
    remaining: trip.totalBudget - Math.max(estimatedSpend, actualSpend),
    allocatedPct: Math.min(100, Math.round((estimatedSpend / trip.totalBudget) * 100)),
  };
}

export function lineDelta(line: BudgetLine): number {
  return line.actual - line.planned;
}

export function itineraryEstimate(trip: Trip): number {
  return trip.itinerary.flatMap((d) => d.activities).reduce((s, a) => s + a.cost, 0);
}
