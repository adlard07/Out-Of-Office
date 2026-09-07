"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WheelEntry } from "@/lib/types";
import { destinations as destinationsApi } from "@/services";
import { useStore } from "@/lib/store";
import { ResultReveal } from "./ResultReveal";

export function ClueReveal({
  entry,
  onClose,
  onSpinAgain,
}: {
  entry: WheelEntry | null;
  onClose: () => void;
  onSpinAgain: () => void;
}) {
  const { destinations: apiDestinations } = useStore();
  const [clues, setClues] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!entry) {
      setClues([]);
      setRevealed(0);
      setShowResult(false);
      return;
    }
    // Clues are written per destination row, so only backend destinations can have them.
    if (!apiDestinations[entry.id]) {
      setShowResult(true);
      return;
    }
    let active = true;
    destinationsApi
      .surprise([entry.id])
      .then((result) => {
        if (!active) return;
        setClues(result.clues);
        setRevealed(1);
      })
      .catch(() => {
        if (active) setShowResult(true);
      });
    return () => {
      active = false;
    };
  }, [entry, apiDestinations]);

  if (showResult) {
    return (
      <ResultReveal
        entry={entry}
        onClose={() => {
          setShowResult(false);
          onClose();
        }}
        onSpinAgain={() => {
          setShowResult(false);
          onSpinAgain();
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      {entry && clues.length > 0 && !showResult && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-night-950/90 backdrop-blur-lg" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-8 text-center"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-gold-300">Complete surprise</p>
            <h2 className="mt-2 font-display text-3xl text-white">Three clues first</h2>

            <div className="mt-6 space-y-3">
              {clues.slice(0, revealed).map((clue, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85"
                >
                  <span className="mr-2 text-brand-300">{i + 1}.</span>
                  {clue}
                </motion.p>
              ))}
            </div>

            <button
              onClick={() => (revealed < clues.length ? setRevealed((r) => r + 1) : setShowResult(true))}
              className="mt-7 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-night-950 hover:bg-white/90"
            >
              {revealed < clues.length ? "Next clue" : "Reveal the destination"}
            </button>
            <button onClick={onClose} className="mt-3 text-sm text-white/40 hover:text-white/70">
              Actually, don&apos;t tell me yet
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
