"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useFund } from "@/lib/store";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { formatMoney } from "@/lib/currency";
import { monthLabel } from "@/lib/fund";

export function FundCard() {
  const { stats, hydrated } = useFund();
  if (!hydrated) return null;

  return (
    <motion.div whileHover={{ y: -3 }} className="h-full">
      <Link
        href="/fund"
        className="glass-strong flex h-full flex-col justify-between gap-6 rounded-3xl p-6 sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Our travel fund</p>
            <p className="mt-2 font-display text-4xl text-white sm:text-5xl">
              <AnimatedCounter value={stats.balance} format={(n) => formatMoney(n)} />
            </p>
          </div>
          <span className="text-2xl">🫙</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/55">
          <span>{formatMoney(stats.monthlyTotal)}/month</span>
          <span className="text-white/25">·</span>
          <span>+{formatMoney(stats.monthlyTotal)} on 1 {monthLabel(stats.nextMonth).split(" ")[0]}</span>
          <span className="ml-auto text-brand-300">Open →</span>
        </div>
      </Link>
    </motion.div>
  );
}
