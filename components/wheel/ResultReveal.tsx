"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { WheelEntry } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Confetti } from "./Confetti";
import { getDestination } from "@/data/destinations";
import { useStore } from "@/lib/store";
import { PlanThisTripButton } from "@/components/destination/PlanThisTripButton";

export function ResultReveal({
  entry,
  onClose,
  onSpinAgain,
}: {
  entry: WheelEntry | null;
  onClose: () => void;
  onSpinAgain: () => void;
}) {
  const { removeFromWheel, knownDestination } = useStore();
  const destination = entry ? (getDestination(entry.id) ?? knownDestination(entry.id)) : undefined;

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-night-950/85 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="glass-strong relative z-10 w-full max-w-md overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-[4/3]">
              <SmartImage src={entry.image} alt={entry.name} fallbackSeed={entry.id} priority />
              <div className="absolute inset-0 bg-night-950/45" />

              {/* The pin drop */}
              <motion.div
                initial={{ y: -120, opacity: 0, scale: 0.4 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 16, delay: 0.15 }}
                className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-xl shadow-black/50"
              >
                📍
                <motion.span
                  initial={{ scale: 0, opacity: 0.7 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.28 }}
                  className="absolute inset-0 rounded-full border-2 border-white"
                />
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm uppercase tracking-[0.25em] text-gold-300"
                >
                  Fate has spoken
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.32 }}
                  className="font-display text-5xl text-white"
                >
                  {entry.name}
                </motion.h2>
                <p className="text-white/60">{entry.country}</p>
              </div>
            </div>

            <div className="space-y-3 p-5">
              {destination?.whyItSuitsUs && (
                <p className="text-sm text-white/65">{destination.whyItSuitsUs}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {destination ? (
                  <PlanThisTripButton destination={destination} size="md" label="Plan this trip" />
                ) : null}
                <button
                  onClick={onSpinAgain}
                  className="rounded-full glass px-5 py-2.5 text-sm font-medium text-white hover:bg-white/12"
                >
                  Spin again
                </button>
              </div>
              <div className="flex items-center justify-between pt-1 text-sm">
                {destination && (
                  <Link href={`/destination/${destination.id}`} className="text-brand-300 hover:text-brand-200">
                    See the full guide →
                  </Link>
                )}
                <button
                  onClick={() => {
                    removeFromWheel(entry.id);
                    onClose();
                  }}
                  className="text-white/40 hover:text-white/70"
                >
                  Remove from wheel
                </button>
              </div>
            </div>
          </motion.div>

          {/* Celebration burst — above the card so it reads as joyous. Re-fires per reveal. */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <Confetti key={entry.id} count={140} originY={44} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
