"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { useFund, useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { FundSettingsModal } from "./FundSettingsModal";
import { AddFundEntryModal } from "./AddFundEntryModal";
import { formatMoney } from "@/lib/currency";
import { addMonths, currentMonthKey, monthLabel } from "@/lib/fund";
import type { FundEntryKind } from "@/lib/types";

function FundBalance({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: prev.current === 0 ? 1.5 : 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <>{formatMoney(Math.round(display))}</>;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 font-display text-xl text-white">{value}</p>
      {sub && <p className="text-xs text-white/45">{sub}</p>}
    </div>
  );
}

export function FundHero() {
  const { fund, stats } = useFund();
  const { tripSummaries } = useStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [entryKind, setEntryKind] = useState<FundEntryKind | null>(null);

  const goal = tripSummaries[0];
  const goalPct = goal ? Math.min(100, Math.round((stats.balance / goal.totalBudget) * 100)) : 0;
  const sinceLabel = new Date(fund.since).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <section>
      <GlassCard strong className="overflow-hidden p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-300">
              Our travel fund
            </p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 font-display text-5xl leading-none text-white sm:text-7xl"
            >
              <FundBalance value={stats.balance} />
            </motion.p>
            <p className="mt-3 text-white/55">
              Saving together since {sinceLabel} · {stats.monthsSaving} months in
            </p>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="glass rounded-full px-4 py-2 text-sm text-white/80 transition hover:bg-white/12"
          >
            ⚙︎ Change amount
          </button>
        </div>

        {/* Next auto contribution */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold-400/20 bg-gold-400/10 px-4 py-3">
          <span className="text-lg">📅</span>
          <p className="text-sm text-white/80">
            Next contribution{" "}
            <span className="font-semibold text-white">+{formatMoney(stats.monthlyTotal)}</span> lands
            automatically on 1 {monthLabel(stats.nextMonth).split(" ")[0]}.
          </p>
        </div>

        {/* Goal tie-in */}
        {goal && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Towards {goal.destinationName}&apos;s {formatMoney(goal.totalBudget, { compact: true })} budget</span>
              <span className="font-semibold text-white">{goalPct}%</span>
            </div>
            <ProgressBar value={goalPct} className="mt-2" />
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Every month" value={formatMoney(stats.monthlyTotal)} sub="added on the 1st" />
          <Stat
            label="Each of us"
            value={formatMoney(stats.perPerson)}
            sub={`${stats.people} contributing`}
          />
          <Stat label="Paid in" value={formatMoney(stats.totalPaidIn, { compact: true })} sub="all time" />
          <Stat
            label={stats.totalTakenOut > 0 ? "Taken out" : "This year"}
            value={
              stats.totalTakenOut > 0
                ? formatMoney(stats.totalTakenOut, { compact: true })
                : formatMoney(stats.contributedThisYear, { compact: true })
            }
            sub={stats.totalTakenOut > 0 ? "for trips" : "saved in " + new Date().getFullYear()}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="md" onClick={() => setEntryKind("deposit")}>+ Add money</Button>
          <Button size="md" variant="glass" onClick={() => setEntryKind("withdrawal")}>
            Record a withdrawal
          </Button>
        </div>

        <p className="mt-4 text-xs text-white/35">
          At {formatMoney(stats.monthlyTotal)}/month you&apos;ll have about{" "}
          {formatMoney(stats.projection(6), { compact: true })} by{" "}
          {monthLabel(addMonths(currentMonthKey(), 6))}.
        </p>
      </GlassCard>

      <FundSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AddFundEntryModal
        key={entryKind ?? "closed"}
        open={entryKind !== null}
        onClose={() => setEntryKind(null)}
        defaultKind={entryKind ?? "deposit"}
      />
    </section>
  );
}
