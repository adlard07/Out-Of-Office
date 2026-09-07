"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Destination } from "@/lib/types";
import type { DestinationRecommendation } from "@/services";
import { SmartImage } from "@/components/ui/SmartImage";
import { Tag } from "@/components/ui/Tag";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { monthRange } from "@/lib/date";
import { cn } from "@/lib/cn";

interface DestinationCardProps {
  destination: Destination;
  recommendation?: DestinationRecommendation;
  index?: number;
}

export function DestinationCard({ destination: d, recommendation, index = 0 }: DestinationCardProps) {
  const { isShortlisted, toggleShortlist, addToWheel, wheel } = useStore();
  const shortlisted = isShortlisted(d.id);
  const onWheel = wheel.some((w) => w.id === d.id);
  const cost = recommendation?.estimatedCostForTwo ?? d.estimatedCostForTwo;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      className="group glass overflow-hidden rounded-3xl"
    >
      <Link href={`/destination/${d.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <SmartImage src={d.image} alt={d.name} fallbackSeed={d.id} className="transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/85 via-night-950/10 to-transparent" />
        {recommendation && (
          <div className="absolute right-3 top-3 rounded-full bg-night-950/70 px-2.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur">
            {recommendation.matchScore}% match
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs uppercase tracking-widest text-white/60">{d.country} · {d.region}</p>
          <h3 className="font-display text-2xl text-white">{d.name}</h3>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <p className="text-sm text-white/70">
          {recommendation?.reason ?? d.whyItSuitsUs}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {d.vibeTags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-white/5 p-3 text-center">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-white/40">Cost / two</dt>
            <dd className="text-sm font-semibold text-white">{formatMoney(cost, { compact: true })}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-white/40">Duration</dt>
            <dd className="text-sm font-semibold text-white">{d.recommendedDays} days</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-white/40">Best in</dt>
            <dd className="text-sm font-semibold text-white">{monthRange(d.bestMonths)}</dd>
          </div>
        </dl>

        <p className="text-xs leading-relaxed text-white/50">{d.whyWeWouldLoveIt}</p>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/destination/${d.id}`}
            className="flex-1 rounded-full bg-white px-3 py-2 text-center text-sm font-medium text-night-950 transition hover:bg-white/90"
          >
            Explore
          </Link>
          <button
            onClick={() => addToWheel({ id: d.id, name: d.name, country: d.country, image: d.image })}
            disabled={onWheel}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-medium transition",
              onWheel
                ? "border-white/10 text-white/35"
                : "border-white/15 text-white/80 hover:border-gold-400/50 hover:text-gold-300",
            )}
          >
            {onWheel ? "On wheel ✓" : "Add to Wheel"}
          </button>
          <button
            onClick={() => void toggleShortlist(d)}
            aria-pressed={shortlisted}
            className={cn(
              "rounded-full border px-3 py-2 text-sm transition",
              shortlisted
                ? "border-brand-400/50 bg-brand-500/20 text-white"
                : "border-white/15 text-white/80 hover:border-white/30",
            )}
          >
            {shortlisted ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
