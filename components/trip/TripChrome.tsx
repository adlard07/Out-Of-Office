"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { Trip } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Countdown } from "@/components/trip/Countdown";
import { daysUntil, formatDateRange } from "@/lib/date";
import { tripReadiness } from "@/lib/checklist";
import { budgetTotals } from "@/lib/budget";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/cn";

export function TripChrome({ trip, children }: { trip: Trip; children: React.ReactNode }) {
  const pathname = usePathname();
  const base = `/trip/${trip.id}`;
  const tabs = [
    { label: "Overview", href: base },
    { label: "Itinerary", href: `${base}/itinerary` },
    { label: "Budget", href: `${base}/budget` },
    { label: "Checklist", href: `${base}/checklist` },
  ];
  const days = daysUntil(trip.startDate);
  const totals = budgetTotals(trip);

  return (
    <div>
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage src={trip.heroImage} alt={trip.destinationName} fallbackSeed={trip.destinationId} priority />
          <div className="absolute inset-0 bg-night-950/68" />
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-6 pt-24 sm:px-6 sm:pt-28">
          <Link href="/" className="text-sm text-white/50 hover:text-white">← Home</Link>
          <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-300">
                {days > 0 ? `${days} days to go` : days === 0 ? "Today's the day" : "Trip in progress"}
              </p>
              <h1 className="font-display text-4xl text-white sm:text-6xl">{trip.destinationName}</h1>
              <p className="mt-1 text-white/60">
                {formatDateRange(trip.startDate, trip.endDate)} · {trip.days} days · {trip.country}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:block">
                <Countdown target={trip.startDate} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="glass rounded-2xl px-4 py-3">
              <p className="text-xs text-white/45">Trip readiness</p>
              <p className="font-display text-2xl text-white">{tripReadiness(trip)}%</p>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <p className="text-xs text-white/45">Budget left</p>
              <p className="font-display text-2xl text-white">{formatMoney(totals.remaining, { compact: true })}</p>
            </div>
          </div>
        </div>

        <nav className="sticky top-0 z-30 border-y border-white/10 bg-night-950/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-6">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-white/50 hover:text-white",
                  )}
                >
                  {t.label}
                  {active && (
                    <motion.span
                      layoutId="trip-tab"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-white"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-6 md:pb-16">{children}</div>
    </div>
  );
}
