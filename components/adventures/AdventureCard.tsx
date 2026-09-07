"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Adventure } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatMoney } from "@/lib/currency";
import { formatDateRange } from "@/lib/date";

export function AdventureCard({ adventure: a, index = 0 }: { adventure: Adventure; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
    >
      <Link
        href={`/adventures/${a.id}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-3xl sm:aspect-[4/5]"
      >
        <SmartImage
          src={a.heroImage}
          alt={a.destinationName}
          fallbackSeed={a.id}
          className="transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/20 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-xs text-white/70">
          <span>{formatDateRange(a.startDate, a.endDate)}</span>
          <span>{a.days} days</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-3xl text-white">{a.destinationName}</h3>
          <p className="text-sm text-white/60">{a.country}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-white/70">
            <span>{formatMoney(a.actualSpend, { compact: true })} spent</span>
            <span>·</span>
            <span>{a.memories.length} memories</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
