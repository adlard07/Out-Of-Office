"use client";

import Link from "next/link";
import { DESTINATIONS } from "@/data/destinations";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatMoney } from "@/lib/currency";

export function SpecificPicker() {
  return (
    <div>
      <p className="mb-6 max-w-xl text-white/60">
        We already have a place in mind. Pick it and we&apos;ll jump straight to planning.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((d) => (
          <Link
            key={d.id}
            href={`/destination/${d.id}`}
            className="group glass overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <SmartImage
                src={d.image}
                alt={d.name}
                fallbackSeed={d.id}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs uppercase tracking-widest text-white/60">{d.country}</p>
                <h3 className="font-display text-2xl text-white">{d.name}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 text-sm text-white/60">
              <span>{d.recommendedDays} days</span>
              <span>{formatMoney(d.estimatedCostForTwo, { compact: true })} for two</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
