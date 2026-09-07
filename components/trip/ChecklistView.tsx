"use client";

import { motion } from "framer-motion";
import type { Trip } from "@/lib/types";
import { useStore } from "@/lib/store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { checklistProgress } from "@/lib/checklist";
import { cn } from "@/lib/cn";

export function ChecklistView({ trip }: { trip: Trip }) {
  const { toggleChecklistItem } = useStore();
  const progress = checklistProgress(trip);

  return (
    <div className="space-y-6">
      <GlassCard className="p-6" strong>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-white">Preparation</h3>
          <span className="font-display text-2xl text-white">{progress.pct}%</span>
        </div>
        <ProgressBar value={progress.pct} className="mt-3" height={12} />
        <p className="mt-2 text-xs text-white/45">
          {progress.done} of {progress.total} done · feeds trip-readiness
        </p>
      </GlassCard>

      <div className="grid gap-5 sm:grid-cols-2">
        {trip.checklist.map((section) => {
          const done = section.items.filter((i) => i.done).length;
          return (
            <div key={section.id} className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-white">
                  {section.icon} {section.title}
                </h4>
                <span className="text-xs text-white/40">{done}/{section.items.length}</span>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => void toggleChecklistItem(trip.id, item.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-white/5"
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px]",
                          item.done
                            ? "border-emerald-400 bg-emerald-400 text-night-950"
                            : "border-white/25",
                        )}
                      >
                        {item.done && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            ✓
                          </motion.span>
                        )}
                      </span>
                      <span className={cn("text-white/80", item.done && "text-white/40 line-through")}>
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
