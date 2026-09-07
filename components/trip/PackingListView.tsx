"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Trip } from "@/lib/types";
import { useStore } from "@/lib/store";
import { ApiError, trips as tripsApi } from "@/services";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { packingProgress } from "@/lib/checklist";
import { cn } from "@/lib/cn";

export function PackingListView({ trip }: { trip: Trip }) {
  const { setPacking, togglePackingItem } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progress = packingProgress(trip);

  /**
   * The backend generates the list from the trip's own itinerary and stores it on the
   * trip, replacing whatever was there. Ticked boxes stay on this device — there is no
   * route to save them.
   */
  async function generate() {
    setLoading(true);
    setError(null);
    try {
      setPacking(trip.id, await tripsApi.generatePacking(trip.id));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.detail : "Could not build a packing list.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="packing" className="scroll-mt-24 space-y-6">
      <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-6" strong>
        <div>
          <h3 className="font-display text-xl text-white">Packing list</h3>
          <p className="text-sm text-white/50">
            Written by the planner from {trip.destinationName}, {trip.days} days and your itinerary.
          </p>
          <div className="mt-3 w-64 max-w-full">
            <ProgressBar value={progress.pct} gradient="linear-gradient(90deg,#43d6a0,#3fbaf8)" />
          </div>
          <p className="mt-1 text-xs text-white/40">{progress.done} of {progress.total} packed</p>
        </div>
        <div className="text-right">
          <Button variant="glass" size="sm" onClick={generate} disabled={loading}>
            {loading ? "Thinking…" : trip.packing.length ? "Regenerate list" : "Generate list"}
          </Button>
          {error && <p className="mt-2 max-w-48 text-xs text-brand-300">{error}</p>}
        </div>
      </GlassCard>

      {trip.packing.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-sm text-white/50">
          No packing list yet. Generate one, then check things off as they go in the bag.
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {trip.packing.map((item) => (
            <button
              key={item.id}
              onClick={() => togglePackingItem(trip.id, item.id)}
              className={cn(
                "glass flex items-start gap-3 rounded-2xl p-4 text-left transition hover:bg-white/10",
                item.packed && "opacity-55",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px]",
                  item.packed ? "border-emerald-400 bg-emerald-400 text-night-950" : "border-white/25",
                )}
              >
                {item.packed && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    ✓
                  </motion.span>
                )}
              </span>
              <span>
                <span className={cn("block text-sm text-white/85", item.packed && "line-through")}>
                  {item.label}
                </span>
                <span className="block text-xs text-white/40">{item.reason}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
