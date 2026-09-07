"use client";

import { motion } from "framer-motion";
import type { Destination } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlanThisTripButton } from "./PlanThisTripButton";
import { WheelShortlistButtons } from "./WheelShortlistButtons";
import { formatMoney } from "@/lib/currency";
import { monthRange } from "@/lib/date";

function StatBlock({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 font-display text-2xl text-white">{value}</p>
      {sub && <p className="text-xs text-white/45">{sub}</p>}
    </div>
  );
}

export function DestinationDetail({ destination: d }: { destination: Destination }) {
  return (
    <article>
      {/* Hero */}
      <section className="relative h-[75svh] min-h-[520px] w-full overflow-hidden">
        <SmartImage src={d.image} alt={d.name} fallbackSeed={d.id} priority />
        <div className="absolute inset-0 bg-night-950/55" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-5 pb-12 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm uppercase tracking-[0.25em] text-white/70"
          >
            {d.country} · {d.region}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-2 font-display text-5xl text-white sm:text-7xl lg:text-8xl"
          >
            {d.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14 }}
            className="mt-3 max-w-xl text-lg text-white/75"
          >
            {d.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <PlanThisTripButton destination={d} />
            <WheelShortlistButtons destination={d} />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-5 py-14 sm:px-6">
        {/* Overview + why we'd love it */}
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-3xl text-white">The overview</h2>
              <p className="mt-3 leading-relaxed text-white/70">{d.overview}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {d.vibeTags.map((t) => (
                  <Tag key={t} tone="brand">{t}</Tag>
                ))}
              </div>
            </div>
            <GlassCard className="p-6" strong>
              <h3 className="font-display text-xl text-gold-300">Why we&apos;d love it</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{d.whyWeWouldLoveIt}</p>
              <p className="mt-4 border-t border-white/10 pt-4 text-sm text-white/55">{d.whyItSuitsUs}</p>
            </GlassCard>
          </div>
        </Reveal>

        {/* Key stats */}
        <Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBlock label="Couple budget" value={formatMoney(d.estimatedCostForTwo, { compact: true })} sub="all in, for two" />
            <StatBlock label="Best time to visit" value={monthRange(d.bestMonths)} sub={d.bestMonths.join(", ")} />
            <StatBlock label="Trip length" value={`${d.recommendedDays} days`} sub="recommended" />
            {d.travelOptions[0] ? (
              <StatBlock
                label="Getting there"
                value={d.travelOptions[0].duration.replace("~", "")}
                sub={d.travelOptions[0].label}
              />
            ) : (
              <StatBlock label="Vibe" value={d.vibeTags[0] ?? "—"} sub={d.vibeTags.join(", ")} />
            )}
          </div>
        </Reveal>

        {/* Experiences */}
        {d.experiences.length > 0 && (
        <Reveal>
          <h2 className="mb-5 font-display text-3xl text-white">Suggested experiences</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {d.experiences.map((exp) => (
              <div key={exp.title} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-white">{exp.title}</h3>
                  <Tag>{exp.tag}</Tag>
                </div>
                <p className="mt-2 text-sm text-white/60">{exp.description}</p>
                <p className="mt-3 text-sm font-semibold text-gold-300">
                  {exp.approxCost === 0 ? "Free" : `${formatMoney(exp.approxCost)} for two`}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        )}

        {/* Accommodation */}
        {d.accommodation.length > 0 && (
        <Reveal>
          <h2 className="mb-5 font-display text-3xl text-white">Where we&apos;d stay</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {d.accommodation.map((a) => (
              <div key={a.name} className="glass overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3]">
                  <SmartImage src={a.image} alt={a.name} fallbackSeed={`${d.id}-${a.name}`} />
                  <div className="absolute inset-0 bg-night-950/45" />
                  <span className="absolute right-2 top-2 rounded-full bg-night-950/70 px-2 py-0.5 text-xs text-gold-300">
                    ★ {a.rating}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wider text-white/40">{a.style}</p>
                  <p className="font-medium text-white">{a.name}</p>
                  <p className="mt-1 text-sm text-white/60">{formatMoney(a.pricePerNight)} / night</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        )}

        {/* Travel options */}
        {d.travelOptions.length > 0 && (
        <Reveal>
          <h2 className="mb-5 font-display text-3xl text-white">Travel options</h2>
          <div className="glass divide-y divide-white/10 rounded-2xl">
            {d.travelOptions.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-white">
                    {t.mode === "flight" ? "✈️" : t.mode === "train" ? "🚆" : t.mode === "ferry" ? "⛴️" : "🚗"} {t.label}
                  </p>
                  {t.note && <p className="text-sm text-white/50">{t.note}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">{t.duration}</p>
                  <p className="font-semibold text-white">{formatMoney(t.approxCost)}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        )}

        {/* AI itinerary preview */}
        <Reveal>
          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪄</span>
              <h2 className="font-display text-2xl text-white">AI itinerary preview</h2>
            </div>
            <p className="mt-1 text-sm text-white/50">
              A rough shape for {d.recommendedDays} days. The planner turns this into a real,
              editable schedule generated by the backend.
            </p>
            <ol className="mt-5 space-y-3">
              {(d.itineraryPreview.length ? d.itineraryPreview : [d.whyItSuitsUs]).map((line, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-200">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/75">{line}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <PlanThisTripButton destination={d} label="Plan this trip properly" />
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
