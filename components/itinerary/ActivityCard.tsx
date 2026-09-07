"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Activity } from "@/lib/types";
import { CATEGORY_META } from "@/lib/budget";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/cn";

interface ActivityCardProps {
  activity: Activity;
  dayCount: number;
  dayNumber: number;
  highlight?: boolean;
  onToggleComplete: () => void;
  onRemove: () => void;
  onReplace: () => void;
  onFindCheaper: () => void;
  onMove: (dir: -1 | 1) => void;
  onMoveToDay: (day: number) => void;
  busy?: boolean;
}

export function ActivityCard({
  activity: a,
  dayCount,
  dayNumber,
  highlight,
  onToggleComplete,
  onRemove,
  onReplace,
  onFindCheaper,
  onMove,
  onMoveToDay,
  busy,
}: ActivityCardProps) {
  const [open, setOpen] = useState(false);
  const meta = CATEGORY_META[a.category];
  const hrs = Math.floor(a.durationMins / 60);
  const mins = a.durationMins % 60;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: highlight ? "0 0 0 2px rgba(255,255,255,0.8)" : "0 0 0 0px transparent",
      }}
      transition={{ duration: 0.35 }}
      className={cn(
        "glass rounded-2xl p-4",
        a.completed && "opacity-60",
        busy && "animate-pulse",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleComplete}
          aria-label="Mark completed"
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
            a.completed ? "border-white bg-white text-night-950" : "border-white/30",
          )}
        >
          {a.completed ? "✓" : ""}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-brand-200">{a.time}</span>
            <h4 className={cn("font-medium text-white", a.completed && "line-through")}>{a.title}</h4>
          </div>
          <p className="mt-1 text-sm text-white/60">{a.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
            <span>{meta.icon} {meta.label}</span>
            <span>📍 {a.location}</span>
            <span>⏱ {hrs ? `${hrs}h ` : ""}{mins ? `${mins}m` : hrs ? "" : "—"}</span>
            <span className="font-semibold text-white/70">
              {a.cost === 0 ? "Free" : formatMoney(a.cost)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 rounded-full px-2 py-1 text-xs text-white/50 hover:bg-white/10 hover:text-white"
        >
          {open ? "Close" : "Edit"}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3"
        >
          <button onClick={onReplace} className="rounded-full bg-white/8 px-3 py-1.5 text-xs text-white hover:bg-white/15">
            Replace
          </button>
          <button onClick={onFindCheaper} className="rounded-full bg-white/8 px-3 py-1.5 text-xs text-white hover:bg-white/15">
            Find cheaper
          </button>
          <button onClick={() => onMove(-1)} className="rounded-full bg-white/8 px-2.5 py-1.5 text-xs text-white hover:bg-white/15">
            ↑
          </button>
          <button onClick={() => onMove(1)} className="rounded-full bg-white/8 px-2.5 py-1.5 text-xs text-white hover:bg-white/15">
            ↓
          </button>
          {dayCount > 1 && (
            <select
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v) onMoveToDay(v);
              }}
              value=""
              className="rounded-full bg-white/8 px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value="" className="bg-night-900">Move to day…</option>
              {Array.from({ length: dayCount }, (_, i) => i + 1)
                .filter((d) => d !== dayNumber)
                .map((d) => (
                  <option key={d} value={d} className="bg-night-900">
                    Day {d}
                  </option>
                ))}
            </select>
          )}
          <button
            onClick={onRemove}
            className="ml-auto rounded-full bg-brand-500/15 px-3 py-1.5 text-xs text-brand-200 hover:bg-brand-500/25"
          >
            Remove
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
