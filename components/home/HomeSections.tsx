"use client";

import Link from "next/link";
import { DESTINATIONS } from "@/data/destinations";
import { DestinationCard } from "@/components/discover/DestinationCard";
import { AdventureCard } from "@/components/adventures/AdventureCard";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { useAdventures, useStore } from "@/lib/store";
import { EmptyState } from "@/components/ui/EmptyState";
import { FundCard } from "@/components/fund/FundCard";

export function HomeSections({ showDiscoveryPrompt }: { showDiscoveryPrompt: boolean }) {
  const { shortlist, knownDestination } = useStore();
  const { adventures, loading: adventuresLoading } = useAdventures();
  // The shortlist mixes backend suggestions with the local atlas; resolve both.
  const dreaming = shortlist
    .map((id) => knownDestination(id))
    .filter((d) => d !== undefined)
    .slice(0, 3);
  const picks = (dreaming.length >= 3 ? dreaming : DESTINATIONS).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
      <Reveal className="mb-20">
        <div className="grid gap-5 lg:grid-cols-2">
          {showDiscoveryPrompt ? (
            <div className="glass-strong flex flex-col items-start justify-center gap-4 rounded-3xl p-8 sm:p-10">
              <div>
                <h2 className="font-display text-3xl text-white sm:text-4xl">Nothing booked yet</h2>
                <p className="mt-2 max-w-md text-white/60">
                  That&apos;s the fun part. Tell us a budget and a mood, or let the wheel embarrass us
                  into a decision.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/discover" size="lg">Explore destinations</ButtonLink>
                <ButtonLink href="/wheel" variant="glass" size="lg">Spin the wheel</ButtonLink>
              </div>
            </div>
          ) : (
            <div className="glass-strong flex flex-col items-start justify-center gap-3 rounded-3xl p-8 sm:p-10">
              <h2 className="font-display text-3xl text-white sm:text-4xl">The pot for all of it</h2>
              <p className="max-w-md text-white/60">
                Every trip in this little universe gets paid for from here. A bit each month, no
                thinking required.
              </p>
            </div>
          )}
          <FundCard />
        </div>
      </Reveal>

      <section className="mb-24">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Currently dreaming about</p>
              <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">The shortlist</h2>
            </div>
            <Link href="/discover" className="text-sm text-white/60 hover:text-white">See all →</Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((d, i) => (
            <DestinationCard key={d.id} destination={d} index={i} />
          ))}
        </div>
      </section>

      <section>
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-300">From the memory book</p>
              <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">Our adventures</h2>
            </div>
            <Link href="/adventures" className="text-sm text-white/60 hover:text-white">Open the book →</Link>
          </div>
        </Reveal>
        {adventuresLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass aspect-[3/4] animate-pulse rounded-3xl sm:aspect-[4/5]" />
            ))}
          </div>
        ) : adventures.length === 0 ? (
          <EmptyState emoji="📔" title="No completed trips yet">
            Once a trip is done and marked completed, it shows up here on its own.
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adventures.slice(0, 3).map((a, i) => (
              <AdventureCard key={a.id} adventure={a} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
