"use client";

import { useAdventures } from "@/lib/store";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageShell, PageHeader } from "@/components/layout/PageShell";
import { AdventureCard } from "@/components/adventures/AdventureCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { formatMoney } from "@/lib/currency";

export default function AdventuresPage() {
  const { adventures, loading, error } = useAdventures();
  const totalDays = adventures.reduce((s, a) => s + a.days, 0);
  const totalSpend = adventures.reduce((s, a) => s + a.actualSpend, 0);
  const totalMemories = adventures.reduce((s, a) => s + a.memories.length, 0);

  return (
    <PageShell wide>
      <PageHeader
        kicker="Our Adventures"
        title="The memory book"
        subtitle="Every trip we've taken together, kept in one place. Open one to flick through it."
      />

      <Reveal>
        <div className="mb-12 grid grid-cols-3 gap-3">
          {(
            [
              { label: "Trips", value: adventures.length, fmt: (n: number) => String(Math.round(n)) },
              { label: "Days away together", value: totalDays, fmt: (n: number) => String(Math.round(n)) },
              { label: "Spent making them", value: totalSpend, fmt: (n: number) => formatMoney(n, { compact: true }) },
            ] as const
          ).map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center">
              <p className="font-display text-3xl text-white sm:text-4xl">
                <AnimatedCounter value={s.value} format={s.fmt} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass aspect-[3/4] animate-pulse rounded-3xl sm:aspect-[4/5]" />
          ))}
        </div>
      ) : error ? (
        <EmptyState emoji="📡" title="The memory book is offline">
          {error}
        </EmptyState>
      ) : adventures.length === 0 ? (
        <EmptyState emoji="📔" title="Nothing in the book yet">
          A trip lands here once it is marked completed. Finish one and it writes itself.
        </EmptyState>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adventures.map((a, i) => (
              <AdventureCard key={a.id} adventure={a} index={i} />
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-white/40">
            {totalMemories} memories and counting.
          </p>
        </>
      )}
    </PageShell>
  );
}
