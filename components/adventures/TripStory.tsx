"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Adventure } from "@/lib/types";
import { ApiError, trips as tripsApi } from "@/services";

export function TripStory({ adventure }: { adventure: Adventure }) {
  const [story, setStory] = useState(adventure.tripStory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** An adventure id *is* the trip id, so the story route works straight off it. */
  async function regenerate() {
    setLoading(true);
    setError(null);
    try {
      setStory(await tripsApi.story(adventure.id, true));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.detail : "Could not rewrite the story.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-2xl text-white">
          <span>✍️</span> Our trip story
        </h3>
        <button
          onClick={regenerate}
          disabled={loading}
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:text-white disabled:opacity-40"
        >
          {loading ? "Writing…" : "Rewrite it"}
        </button>
      </div>
      <motion.p
        key={story || "empty"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 font-display text-lg leading-relaxed text-white/80"
      >
        {story || "No story yet — hit rewrite and the planner will write one from this trip."}
      </motion.p>
      {error && <p className="mt-3 text-xs text-brand-300">{error}</p>}
      <p className="mt-3 text-xs text-white/35">
        Written by the planner from the itinerary, photo captions and trip notes.
      </p>
    </div>
  );
}
