"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Trip } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Countdown } from "@/components/trip/Countdown";
import { TripQuickNav } from "@/components/trip/TripQuickNav";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { tripReadiness } from "@/lib/checklist";
import { budgetTotals } from "@/lib/budget";
import { daysUntil, formatDateRange } from "@/lib/date";
import { formatMoney } from "@/lib/currency";

export function UpcomingTripHome({ trip }: { trip: Trip }) {
  const days = daysUntil(trip.startDate);
  const readiness = tripReadiness(trip);
  const totals = budgetTotals(trip);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage src={trip.heroImage} alt={trip.destinationName} fallbackSeed={trip.destinationId} priority />
        <div className="absolute inset-0 bg-night-950/62" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-28 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium uppercase tracking-[0.25em] text-brand-300"
        >
          Next adventure
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mt-2 font-display text-[2.6rem] leading-[1.05] text-white sm:text-7xl lg:text-8xl"
        >
          {days > 0 ? (
            <>
              {days} {days === 1 ? "day" : "days"} until <span className="italic text-brand-300">{trip.destinationName}</span>
            </>
          ) : (
            <>We&apos;re in {trip.destinationName}</>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.14 }}
          className="mt-4 text-white/70"
        >
          {formatDateRange(trip.startDate, trip.endDate)} · {trip.days} days · {trip.country}
        </motion.p>

        <div className="mt-8">
          <Countdown target={trip.startDate} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 grid gap-4 lg:grid-cols-3"
        >
          <div className="glass-strong rounded-3xl p-6">
            <p className="text-sm text-white/55">Trip readiness</p>
            <p className="mt-1 font-display text-4xl text-white">
              <AnimatedCounter value={readiness} format={(n) => `${Math.round(n)}%`} />
            </p>
            <ProgressBar value={readiness} className="mt-4" />
            <Link href={`/trip/${trip.id}/checklist`} className="mt-4 inline-block text-sm text-brand-300 hover:text-brand-200">
              Finish the checklist →
            </Link>
          </div>

          <div className="glass-strong rounded-3xl p-6">
            <p className="text-sm text-white/55">Budget allocated</p>
            <p className="mt-1 font-display text-4xl text-white">
              <AnimatedCounter value={totals.allocatedPct} format={(n) => `${Math.round(n)}%`} />
            </p>
            <ProgressBar value={totals.allocatedPct} className="mt-4" gradient="#ffffff" />
            <p className="mt-4 text-sm text-white/50">
              {formatMoney(totals.estimatedSpend, { compact: true })} of {formatMoney(totals.totalBudget, { compact: true })} planned
            </p>
          </div>

          <div className="glass-strong flex flex-col justify-between rounded-3xl p-6">
            <div>
              <p className="text-sm text-white/55">This week&apos;s job</p>
              <p className="mt-1 font-display text-2xl text-white">Book the airport transfer</p>
              <p className="mt-2 text-sm text-white/50">Small thing. Do it before it becomes a big thing.</p>
            </div>
            <Link
              href={`/trip/${trip.id}`}
              className="mt-4 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-sm font-medium text-night-950 hover:bg-white/90"
            >
              Open trip dashboard
            </Link>
          </div>
        </motion.div>

        <div className="mt-6">
          <TripQuickNav tripId={trip.id} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-sm text-white/45"
        >
          Not feeling Bali anymore?{" "}
          <Link href="/discover" className="text-white/80 underline-offset-4 hover:underline">
            Explore somewhere else
          </Link>{" "}
          or{" "}
          <Link href="/wheel" className="text-white/80 underline-offset-4 hover:underline">
            spin for it
          </Link>
          .
        </motion.p>
      </div>
    </section>
  );
}
