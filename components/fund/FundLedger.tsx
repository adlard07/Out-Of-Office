"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFund, useStore } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import type { LedgerKind } from "@/lib/fund";
import { cn } from "@/lib/cn";

const META: Record<LedgerKind, { icon: string; tint: string; label: string }> = {
  opening: { icon: "🏦", tint: "text-white/70", label: "Opening balance" },
  monthly: { icon: "🔁", tint: "text-white", label: "Monthly contribution" },
  deposit: { icon: "➕", tint: "text-white", label: "Added" },
  withdrawal: { icon: "➖", tint: "text-white/55", label: "Withdrawn" },
};

const PREVIEW = 6;

export function FundLedger() {
  const { ledger } = useFund();
  const { removeFundEntry } = useStore();
  const [expanded, setExpanded] = useState(false);

  // Newest first.
  const rows = [...ledger].reverse();
  const shown = expanded ? rows : rows.slice(0, PREVIEW);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl text-white">Month by month</h2>
          <p className="text-sm text-white/50">Every contribution, in order, with the running total.</p>
        </div>
        <span className="text-sm text-white/40">
          {ledger.length} {ledger.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <AnimatePresence initial={false}>
          {shown.map((row) => {
            const meta = META[row.kind];
            return (
              <motion.div
                key={row.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 border-b border-white/8 px-4 py-3.5 last:border-0 sm:px-5"
              >
                <span className="text-lg" aria-hidden>{meta.icon}</span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    {row.label}
                    <span className="ml-2 text-xs font-normal text-white/40">{meta.label}</span>
                  </p>
                  {row.note && <p className="truncate text-xs text-white/45">{row.note}</p>}
                </div>

                <div className="shrink-0 text-right">
                  <p className={cn("text-sm font-semibold tabular-nums", meta.tint)}>
                    {row.amount >= 0 ? "+" : "−"}
                    {formatMoney(Math.abs(row.amount))}
                  </p>
                  <p className="text-xs text-white/40 tabular-nums">{formatMoney(row.balanceAfter)}</p>
                </div>

                {row.removable && (
                  <button
                    onClick={() => removeFundEntry(row.id)}
                    aria-label="Remove entry"
                    className="shrink-0 rounded-full px-2 py-1 text-xs text-white/30 transition hover:bg-white/10 hover:text-brand-300"
                  >
                    ✕
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {rows.length > PREVIEW && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/8"
          >
            {expanded ? "Show less" : `Show all ${rows.length} months`}
          </button>
        </div>
      )}
    </section>
  );
}
