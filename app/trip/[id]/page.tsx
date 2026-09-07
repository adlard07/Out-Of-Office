"use client";

import { use } from "react";
import Link from "next/link";
import { useTrip } from "@/lib/store";
import { TripQuickNav } from "@/components/trip/TripQuickNav";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { checklistProgress, packingProgress } from "@/lib/checklist";
import { budgetTotals, itineraryEstimate } from "@/lib/budget";
import { formatMoney } from "@/lib/currency";

export default function TripOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip(id);
  if (!trip) return null;

  const totals = budgetTotals(trip);
  const chk = checklistProgress(trip);
  const pack = packingProgress(trip);
  const itinCost = itineraryEstimate(trip);
  const nextActivities = trip.itinerary[0]?.activities.slice(0, 3) ?? [];

  return (
    <div className="space-y-10">
      <Reveal>
        <TripQuickNav tripId={trip.id} />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard className="h-full p-6" strong>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">The plan so far</h2>
              <Link href={`/trip/${trip.id}/itinerary`} className="text-sm text-brand-300 hover:text-brand-200">
                Open itinerary →
              </Link>
            </div>
            {trip.itinerary.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-6 text-center">
                <p className="text-white/60">No itinerary yet.</p>
                <Link
                  href={`/trip/${trip.id}/itinerary`}
                  className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-night-950 hover:bg-white/90"
                >
                  Build it with AI
                </Link>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm text-white/50">
                  {trip.itinerary.length} days planned · about {formatMoney(itinCost, { compact: true })} in activities & meals
                </p>
                <ul className="mt-5 space-y-3">
                  {nextActivities.map((a) => (
                    <li key={a.id} className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-3">
                      <span className="w-16 shrink-0 text-sm text-brand-200">{a.time}</span>
                      <span className="text-sm text-white/85">{a.title}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-white/40">Day 1 preview — the full plan is on the itinerary tab.</p>
              </>
            )}
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard className="flex h-full flex-col gap-6 p-6">
            <div>
              <p className="text-sm text-white/50">Prep checklist</p>
              <p className="font-display text-3xl text-white">
                <AnimatedCounter value={chk.pct} format={(n) => `${Math.round(n)}%`} />
              </p>
              <ProgressBar value={chk.pct} className="mt-3" />
              <p className="mt-2 text-xs text-white/40">{chk.done} of {chk.total} done</p>
            </div>
            <div>
              <p className="text-sm text-white/50">Packing</p>
              <p className="font-display text-3xl text-white">
                <AnimatedCounter value={pack.pct} format={(n) => `${Math.round(n)}%`} />
              </p>
              <ProgressBar value={pack.pct} className="mt-3" gradient="#ffffff" />
              <p className="mt-2 text-xs text-white/40">{pack.done} of {pack.total} packed</p>
            </div>
            <Link href={`/trip/${trip.id}/checklist`} className="mt-auto text-sm text-brand-300 hover:text-brand-200">
              Go to checklist →
            </Link>
          </GlassCard>
        </Reveal>
      </div>

      <Reveal>
        <GlassCard className="p-6" strong>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-white">Budget snapshot</h2>
            <Link href={`/trip/${trip.id}/budget`} className="text-sm text-brand-300 hover:text-brand-200">
              Full breakdown →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Total budget", totals.totalBudget],
              ["Estimated spend", totals.estimatedSpend],
              ["Actual spend", totals.actualSpend],
              ["Remaining", totals.remaining],
            ].map(([label, value]) => (
              <div key={label as string}>
                <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
                <p className="mt-1 font-display text-xl text-white">
                  {formatMoney(value as number, { compact: true })}
                </p>
              </div>
            ))}
          </div>
          <ProgressBar value={totals.allocatedPct} className="mt-5" gradient="#ffffff" />
          <p className="mt-2 text-xs text-white/40">{totals.allocatedPct}% of the budget is allocated</p>
        </GlassCard>
      </Reveal>
    </div>
  );
}
