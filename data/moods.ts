import type { MoodOption } from "@/lib/types";

export const MOODS: MoodOption[] = [
  { id: "beach", label: "Beach & Relax", emoji: "🏝️", blurb: "Slow mornings, salt in our hair" },
  { id: "mountains", label: "Mountains", emoji: "🏔️", blurb: "Cold air, big views, hot chai" },
  { id: "adventure", label: "Adventure", emoji: "🧗", blurb: "Say yes to the scary thing" },
  { id: "romantic", label: "Romantic", emoji: "💞", blurb: "Just the two of us" },
  { id: "food", label: "Food", emoji: "🍜", blurb: "Plan the trip around dinner" },
  { id: "culture", label: "Culture", emoji: "🏛️", blurb: "Museums, streets, stories" },
  { id: "luxury", label: "Luxury Escape", emoji: "🥂", blurb: "Be a little extravagant" },
  { id: "roadtrip", label: "Road Trip", emoji: "🚗", blurb: "The playlist matters" },
  { id: "random", label: "Completely Random", emoji: "🎲", blurb: "Surprise us entirely" },
];

export const MOOD_LABEL: Record<string, string> = Object.fromEntries(
  MOODS.map((m) => [m.id, m.label]),
);
