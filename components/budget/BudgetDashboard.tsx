"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Trip } from "@/lib/types";
import { useStore } from "@/lib/store";
import { AddExpenseModal } from "./AddExpenseModal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { Segmented } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { budgetTotals, CATEGORY_META, CATEGORY_ORDER, lineDelta } from "@/lib/budget";
import { formatMoney } from "@/lib/currency";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/cn";

export function BudgetDashboard({ trip }: { trip: Trip }) {
  const { addExpense } = useStore();
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<"planned" | "actual">("planned");
  const totals = budgetTotals(trip);
  // The breakdown comes from GET /trips/{id}/budget; it is empty until that loads.
  const lines = CATEGORY_ORDER.map((c) => trip.budgetLines.find((l) => l.category === c)).filter(
    (line) => line !== undefined,
  );
  const maxLine = Math.max(...lines.map((l) => Math.max(l.planned, l.actual)), 1);
  const overallDelta = totals.actualSpend - totals.estimatedSpend;

  const stats = [
    { label: "Total Budget", value: totals.totalBudget, tone: "text-white" },
    { label: "Estimated Spend", value: totals.estimatedSpend, tone: "text-white" },
    { label: "Actual Spend", value: totals.actualSpend, tone: "text-gold-300" },
    { label: "Remaining Budget", value: totals.remaining, tone: totals.remaining < 0 ? "text-brand-300" : "text-white" },
  ];

  return (
    <div className="space-y-10">
      <Reveal>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <GlassCard key={s.label} className="p-5">
              <p className="text-xs uppercase tracking-wider text-white/40">{s.label}</p>
              <p className={cn("mt-1 font-display text-2xl sm:text-3xl", s.tone)}>
                <AnimatedCounter value={s.value} format={(n) => formatMoney(n, { compact: true })} />
              </p>
            </GlassCard>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <GlassCard className="p-6" strong>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-white">Budget allocated</h2>
              <p className="text-sm text-white/50">
                {formatMoney(totals.estimatedSpend)} of {formatMoney(totals.totalBudget)} planned across categories
              </p>
            </div>
            <span className="font-display text-3xl text-white">{totals.allocatedPct}%</span>
          </div>
          <ProgressBar value={totals.allocatedPct} className="mt-4" height={14} />
        </GlassCard>
      </Reveal>

      <Reveal>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-white">Planned vs actual</h2>
          <div className="flex items-center gap-3">
            <div className="w-52">
              <Segmented
                value={view}
                onChange={setView}
                options={[
                  { value: "planned", label: "Planned" },
                  { value: "actual", label: "Actual" },
                ]}
              />
            </div>
            <Button size="sm" onClick={() => setAdding(true)}>+ Add expense</Button>
          </div>
        </div>

        <div className="space-y-3">
          {lines.map((line) => {
            const meta = CATEGORY_META[line.category];
            const delta = lineDelta(line);
            const shown = view === "planned" ? line.planned : line.actual;
            return (
              <div key={line.category} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">
                    {meta.icon} {meta.label}
                  </span>
                  <span className="text-white/60">
                    Planned {formatMoney(line.planned, { compact: true })} · Actual{" "}
                    <span className={delta > 0 ? "text-brand-300" : delta < 0 ? "text-white" : "text-white/60"}>
                      {formatMoney(line.actual, { compact: true })}
                    </span>
                  </span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(line.planned / maxLine) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full opacity-70"
                      style={{ background: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(line.actual / maxLine) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
                {delta !== 0 && (
                  <p className="mt-2 text-xs text-white/45">
                    {delta > 0
                      ? `${formatMoney(delta)} over plan`
                      : `${formatMoney(-delta)} under plan`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={cn(
            "mt-4 rounded-2xl border p-4 text-sm",
            overallDelta > 0
              ? "border-brand-400/30 bg-brand-500/10 text-brand-100"
              : "border-white/20 bg-white/8 text-white/80",
          )}
        >
          {totals.actualSpend === 0
            ? "No spending logged yet — these are all estimates."
            : overallDelta > 0
              ? `Currently ${formatMoney(overallDelta)} over the estimate. Keep an eye on it.`
              : `We somehow stayed ${formatMoney(-overallDelta)} under the estimate. Well done us.`}
        </div>
      </Reveal>

      <Reveal>
        <div id="expenses" className="scroll-mt-24">
          <h2 className="mb-4 font-display text-2xl text-white">Logged expenses</h2>
          {trip.expenses.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-sm text-white/50">
              Nothing logged yet. Add expenses as you book things or while you travel.
            </div>
          ) : (
            <div className="glass divide-y divide-white/8 rounded-2xl">
              {trip.expenses.map((e) => {
                const meta = CATEGORY_META[e.category];
                return (
                  <div key={e.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {meta.icon} {e.description}
                      </p>
                      <p className="text-xs text-white/45">
                        {formatDay(e.date)} · {meta.label}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold text-white">{formatMoney(e.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Reveal>

      <AddExpenseModal open={adding} onClose={() => setAdding(false)} onAdd={(e) => void addExpense(trip.id, e)} />
    </div>
  );
}
