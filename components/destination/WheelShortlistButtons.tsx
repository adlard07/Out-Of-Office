"use client";

import type { Destination } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function WheelShortlistButtons({ destination: d }: { destination: Destination }) {
  const { isShortlisted, toggleShortlist, addToWheel, wheel } = useStore();
  const onWheel = wheel.some((w) => w.id === d.id);
  const shortlisted = isShortlisted(d.id);

  return (
    <>
      <button
        onClick={() => addToWheel({ id: d.id, name: d.name, country: d.country, image: d.image })}
        disabled={onWheel}
        className={cn(
          "rounded-full border px-5 py-3.5 text-sm font-medium transition",
          onWheel ? "border-white/10 text-white/40" : "glass text-white hover:border-gold-400/50",
        )}
      >
        {onWheel ? "On the wheel ✓" : "Add to Wheel"}
      </button>
      <button
        onClick={() => void toggleShortlist(d)}
        className={cn(
          "rounded-full border px-5 py-3.5 text-sm font-medium transition",
          shortlisted ? "border-brand-400/50 bg-brand-500/20 text-white" : "glass text-white hover:border-white/30",
        )}
      >
        {shortlisted ? "♥ Shortlisted" : "♡ Shortlist"}
      </button>
    </>
  );
}
