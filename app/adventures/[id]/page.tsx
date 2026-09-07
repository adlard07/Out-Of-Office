"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdventure } from "@/lib/store";
import { SmartImage } from "@/components/ui/SmartImage";
import { MasonryGallery } from "@/components/adventures/MasonryGallery";
import { TripStory } from "@/components/adventures/TripStory";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tag } from "@/components/ui/Tag";
import { NotFoundBlock } from "@/components/ui/NotFoundBlock";
import { CATEGORY_META } from "@/lib/budget";
import { formatMoney } from "@/lib/currency";
import { formatDateRange } from "@/lib/date";

export default function AdventurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { adventure: a, loading, error } = useAdventure(id);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-5 pt-32 sm:px-6">
        <div className="glass h-64 animate-pulse rounded-3xl" />
      </div>
    );
  }
  if (!a) {
    return (
      <NotFoundBlock
        title="That memory isn't in the book"
        message={error ?? "Only completed trips appear here."}
        href="/adventures"
        cta="Back to the memory book"
      />
    );
  }

  const totalActual = a.expenseSummary.reduce((s, l) => s + l.actual, 0);

  return (
    <article>
      <section className="relative h-[70svh] min-h-[460px] overflow-hidden">
        <SmartImage src={a.heroImage} alt={a.destinationName} fallbackSeed={a.id} priority />
        <div className="absolute inset-0 bg-night-950/55" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-5 pb-12 sm:px-6">
          <Link href="/adventures" className="text-sm text-white/60 hover:text-white">← The memory book</Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-display text-5xl text-white sm:text-7xl lg:text-8xl"
          >
            {a.destinationName}
          </motion.h1>
          <p className="mt-2 text-white/70">
            {formatDateRange(a.startDate, a.endDate)} · {a.days} days · {a.country}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-5 py-14 sm:px-6">
        <Reveal>
          <TripStory adventure={a} />
        </Reveal>

        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <GlassCard className="p-6">
              <h3 className="font-display text-lg text-gold-300">Favourite memory</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{a.favouriteMemory}</p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-display text-lg text-gold-300">Favourite activity</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{a.favouriteActivity}</p>
            </GlassCard>
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mb-2 font-display text-3xl text-white">The gallery</h2>
          <p className="mb-6 text-sm text-white/50">{a.memories.length} photos from the trip.</p>
          {a.memories.length ? (
            <MasonryGallery memories={a.memories} />
          ) : (
            <p className="glass rounded-2xl p-8 text-center text-sm text-white/50">
              No photos uploaded for this trip yet.
            </p>
          )}
        </Reveal>

        <Reveal>
          <h2 className="mb-4 font-display text-3xl text-white">Places we visited</h2>
          <div className="flex flex-wrap gap-2">
            {a.placesVisited.map((p) => (
              <Tag key={p} tone="brand">{p}</Tag>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mb-4 font-display text-3xl text-white">Final expense summary</h2>
          <div className="glass divide-y divide-white/8 rounded-2xl">
            {a.expenseSummary
              .filter((l) => l.actual > 0)
              .map((l) => {
                const meta = CATEGORY_META[l.category];
                const delta = l.actual - l.planned;
                return (
                  <div key={l.category} className="flex items-center justify-between gap-4 p-4 text-sm">
                    <span className="text-white/85">{meta.icon} {meta.label}</span>
                    <span className="text-white/55">
                      Planned {formatMoney(l.planned, { compact: true })} ·{" "}
                      <span className="text-white">{formatMoney(l.actual, { compact: true })}</span>
                      {delta !== 0 && (
                        <span className={delta > 0 ? "text-brand-300" : "text-white"}>
                          {" "}({delta > 0 ? "+" : ""}{formatMoney(delta, { compact: true })})
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            <div className="flex items-center justify-between gap-4 p-4 font-semibold text-white">
              <span>Total</span>
              <span>{formatMoney(totalActual)}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
