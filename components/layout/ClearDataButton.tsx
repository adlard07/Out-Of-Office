"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";

const WIPES = [
  "The spin wheel line-up",
  "Your shortlist and any cached destination pages",
  "Packing tick-boxes",
  "The travel fund — back to its ₹80,000 starting point",
];

export function ClearDataButton() {
  const { resetLocal } = useStore();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  function confirm() {
    resetLocal();
    setDone(true);
    setTimeout(() => {
      setOpen(false);
      setDone(false);
    }, 1400);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-white/10 px-3 py-1 text-xs transition hover:border-white/25 hover:text-white"
      >
        Clear local data
      </button>

      <Modal
        open={open}
        onClose={() => !done && setOpen(false)}
        title={done ? undefined : "Clear local data?"}
      >
        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-6 text-center"
          >
            <span className="text-4xl">🧹</span>
            <p className="font-display text-xl text-white">All cleared</p>
            <p className="text-sm text-white/55">Everything on this device is back to a fresh start.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              This wipes everything stored in this browser and can&apos;t be undone:
            </p>
            <ul className="space-y-1.5">
              {WIPES.map((w) => (
                <li key={w} className="flex gap-2.5 text-sm text-white/75">
                  <span className="text-white/30">•</span>
                  {w}
                </li>
              ))}
            </ul>
            <p className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white/50">
              Your trips, itineraries, budgets and the memory book live in the backend — those are
              safe and stay exactly as they are.
            </p>
            <div className="flex gap-2 pt-1">
              <Button variant="glass" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={confirm}>
                Clear everything
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
