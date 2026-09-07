"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Activity, ItineraryDay } from "@/lib/types";
import { ActivityCard } from "./ActivityCard";
import { AddActivityModal } from "./AddActivityModal";
import { formatMoney } from "@/lib/currency";

interface DayTimelineProps {
  day: ItineraryDay;
  dayCount: number;
  highlightIds: string[];
  busyId: string | null;
  onToggleComplete: (id: string) => void;
  onRemove: (id: string) => void;
  onReplace: (id: string) => void;
  onFindCheaper: (id: string) => void;
  onMove: (dayNumber: number, id: string, dir: -1 | 1) => void;
  onMoveToDay: (id: string, day: number) => void;
  onAdd: (dayNumber: number, a: Activity) => void;
}

export function DayTimeline({
  day,
  dayCount,
  highlightIds,
  busyId,
  onToggleComplete,
  onRemove,
  onReplace,
  onFindCheaper,
  onMove,
  onMoveToDay,
  onAdd,
}: DayTimelineProps) {
  const [adding, setAdding] = useState(false);
  const dayCost = day.activities.reduce((s, a) => s + a.cost, 0);
  const doneCount = day.activities.filter((a) => a.completed).length;

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      className="relative"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
            Day {day.dayNumber}
          </p>
          <h3 className="font-display text-2xl text-white">{day.title}</h3>
          <p className="mt-0.5 text-sm text-white/50">{day.summary}</p>
        </div>
        <div className="shrink-0 text-right text-xs text-white/45">
          <p className="font-semibold text-white/70">{formatMoney(dayCost, { compact: true })}</p>
          <p>{doneCount}/{day.activities.length} done</p>
        </div>
      </div>

      <div className="space-y-2.5 border-l border-white/10 pl-4 sm:pl-5">
        {day.activities.map((a) => (
          <ActivityCard
            key={a.id}
            activity={a}
            dayCount={dayCount}
            dayNumber={day.dayNumber}
            highlight={highlightIds.includes(a.id)}
            busy={busyId === a.id}
            onToggleComplete={() => onToggleComplete(a.id)}
            onRemove={() => onRemove(a.id)}
            onReplace={() => onReplace(a.id)}
            onFindCheaper={() => onFindCheaper(a.id)}
            onMove={(dir) => onMove(day.dayNumber, a.id, dir)}
            onMoveToDay={(d) => onMoveToDay(a.id, d)}
          />
        ))}
        {day.activities.length === 0 && (
          <p className="py-4 text-sm text-white/40">A completely open day. Bold choice.</p>
        )}
        <button
          onClick={() => setAdding(true)}
          className="w-full rounded-2xl border border-dashed border-white/15 py-2.5 text-sm text-white/50 transition hover:border-white/30 hover:text-white"
        >
          + Add something to this day
        </button>
      </div>

      <AddActivityModal
        open={adding}
        onClose={() => setAdding(false)}
        dayNumber={day.dayNumber}
        onAdd={(a) => onAdd(day.dayNumber, a)}
      />
    </motion.section>
  );
}
