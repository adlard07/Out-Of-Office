"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Activity, ItineraryDay, Trip } from "@/lib/types";
import { useStore } from "@/lib/store";
import {
  ApiError,
  addActivityInstruction,
  replaceActivityInstruction,
  trips as tripsApi,
} from "@/services";
import { DayTimeline } from "./DayTimeline";
import { AssistantPanel, type AssistantMessage } from "./AssistantPanel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { itineraryEstimate } from "@/lib/budget";
import { formatMoney } from "@/lib/currency";
import { mapItineraryDay } from "@/services/map";

function allActivities(days: ItineraryDay[]): Activity[] {
  return days.flatMap((d) => d.activities);
}

/** Which activities the backend actually changed, for the highlight flash. */
function changedActivityIds(before: ItineraryDay[], after: ItineraryDay[]): string[] {
  const previous = new Map(allActivities(before).map((a) => [a.id, a]));
  return allActivities(after)
    .filter((a) => {
      const old = previous.get(a.id);
      return !old || old.title !== a.title || old.cost !== a.cost || old.time !== a.time;
    })
    .map((a) => a.id);
}

function describe(cause: unknown): string {
  if (cause instanceof ApiError) return cause.detail;
  return cause instanceof Error ? cause.message : "That change did not go through.";
}

export function ItineraryBoard({ trip }: { trip: Trip }) {
  const { applyTripDto } = useStore();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [log, setLog] = useState<AssistantMessage[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  const days = trip.itinerary;
  const estimate = itineraryEstimate(trip);
  const overBudget = estimate > trip.totalBudget;
  const pct = Math.min(100, Math.round((estimate / (trip.totalBudget || 1)) * 100));

  function flashHighlight(ids: string[]) {
    if (!ids.length) return;
    setHighlightIds(ids);
    setTimeout(() => setHighlightIds([]), 2600);
  }

  const findActivity = (id: string): Activity | undefined =>
    allActivities(days).find((a) => a.id === id);

  function budgetCheck(next: ItineraryDay[], totalBudget: number) {
    const total = allActivities(next).reduce((sum, a) => sum + a.cost, 0);
    setWarning(
      total > totalBudget
        ? `This itinerary is ${formatMoney(total - totalBudget)} over budget.`
        : null,
    );
  }

  /**
   * The backend has one editing route: a natural-language rewrite of the whole plan
   * (`POST /trips/{id}/itinerary/edit`). Replacing, adding and reordering are all
   * phrased as instructions for it, so every change is persisted rather than local.
   */
  async function runEdit(instruction: string, opts: { activityId?: string; say?: string } = {}) {
    const before = trip.itinerary;
    if (opts.activityId) setBusyId(opts.activityId);
    else setAssistantBusy(true);

    try {
      const dto = await tripsApi.editItinerary(trip.id, instruction);
      applyTripDto(dto);
      const nextDays = dto.itinerary.map(mapItineraryDay);
      flashHighlight(changedActivityIds(before, nextDays));
      budgetCheck(nextDays, dto.total_budget);
      setLog((l) => [...l, { role: "ai", text: opts.say ?? "Done — the plan is updated." }]);
    } catch (cause) {
      setLog((l) => [...l, { role: "ai", text: describe(cause) }]);
    } finally {
      setBusyId(null);
      setAssistantBusy(false);
    }
  }

  /** Completing, moving between days and deleting have their own precise routes. */
  async function patchActivity(
    id: string,
    patch: { completed?: boolean; moveToDay?: number },
  ) {
    setBusyId(id);
    try {
      applyTripDto(await tripsApi.setActivity(trip.id, id, patch));
    } catch (cause) {
      setLog((l) => [...l, { role: "ai", text: describe(cause) }]);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteActivity(id: string) {
    setBusyId(id);
    try {
      applyTripDto(await tripsApi.removeActivity(trip.id, id));
    } catch (cause) {
      setLog((l) => [...l, { role: "ai", text: describe(cause) }]);
    } finally {
      setBusyId(null);
    }
  }

  function replace(id: string, cheaper: boolean) {
    const activity = findActivity(id);
    if (!activity) return;
    return runEdit(replaceActivityInstruction(activity, cheaper), {
      activityId: id,
      say: cheaper
        ? `Looked for a cheaper stand-in for "${activity.title}".`
        : `Swapped "${activity.title}" for something different.`,
    });
  }

  /** Swapping two neighbours means swapping their start times — the editor does it. */
  function shift(dayNumber: number, id: string, dir: -1 | 1) {
    const day = days.find((d) => d.dayNumber === dayNumber);
    if (!day) return;
    const index = day.activities.findIndex((a) => a.id === id);
    const neighbour = day.activities[index + dir];
    if (index < 0 || !neighbour) return;
    return runEdit(
      `On day ${dayNumber}, swap the start times of "${day.activities[index].title}" and "${neighbour.title}". Change nothing else.`,
      { activityId: id, say: `Moved "${day.activities[index].title}" ${dir < 0 ? "earlier" : "later"}.` },
    );
  }

  function runCommand(text: string) {
    setLog((l) => [...l, { role: "you", text }]);
    return runEdit(text);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-10">
        {/* Budget bar */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Itinerary cost vs budget</span>
            <span className={overBudget ? "font-semibold text-brand-300" : "font-semibold text-white"}>
              {formatMoney(estimate)} / {formatMoney(trip.totalBudget)}
            </span>
          </div>
          <ProgressBar
            value={pct}
            className="mt-2"
            gradient={overBudget ? "#9a9a9a" : "#ffffff"}
          />
        </div>

        <AnimatePresence>
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-400/30 bg-brand-500/10 p-4"
            >
              <p className="text-sm text-brand-100">⚠️ {warning}</p>
              <button
                onClick={() => {
                  const priciest = allActivities(days)
                    .filter((a) => a.category !== "food")
                    .sort((a, b) => b.cost - a.cost)[0];
                  if (priciest) void replace(priciest.id, true);
                }}
                className="rounded-full bg-white px-4 py-2 text-xs font-medium text-night-950 hover:bg-white/90"
              >
                Find cheaper alternative
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {days.map((day) => (
          <DayTimeline
            key={day.id}
            day={day}
            dayCount={days.length}
            highlightIds={highlightIds}
            busyId={busyId}
            onToggleComplete={(id) =>
              void patchActivity(id, { completed: !findActivity(id)?.completed })
            }
            onRemove={(id) => void deleteActivity(id)}
            onReplace={(id) => void replace(id, false)}
            onFindCheaper={(id) => void replace(id, true)}
            onMove={(dayNumber, id, dir) => void shift(dayNumber, id, dir)}
            onMoveToDay={(id, target) => void patchActivity(id, { moveToDay: target })}
            onAdd={(dayNumber, activity) =>
              void runEdit(addActivityInstruction(dayNumber, activity), {
                say: `Added "${activity.title}" to day ${dayNumber}.`,
              })
            }
          />
        ))}
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <AssistantPanel onCommand={runCommand} busy={assistantBusy} log={log} />
      </div>
    </div>
  );
}
