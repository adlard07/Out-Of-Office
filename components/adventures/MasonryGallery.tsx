"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Memory } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";

export function MasonryGallery({ memories, initial = 6 }: { memories: Memory[]; initial?: number }) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<Memory | null>(null);
  const shown = expanded ? memories : memories.slice(0, initial);

  return (
    <div>
      <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
        {shown.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            onClick={() => setActive(m)}
            className="group relative block w-full overflow-hidden rounded-2xl"
          >
            <SmartImage
              src={m.image}
              alt={m.caption}
              fallbackSeed={m.id}
              className={
                m.span === "tall" ? "aspect-[3/4]" : m.span === "wide" ? "aspect-[16/10]" : "aspect-square"
              }
            />
            <div className="absolute inset-0 bg-night-950/55 opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-xs text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              {m.caption}
            </p>
          </motion.button>
        ))}
      </div>

      {memories.length > initial && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/8"
          >
            {expanded ? "Show fewer" : `View all ${memories.length} memories`}
          </button>
        </div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-night-950/90 backdrop-blur-md" />
            <motion.figure
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 max-h-[85vh] max-w-3xl overflow-hidden rounded-3xl"
            >
              <SmartImage src={active.image} alt={active.caption} fallbackSeed={active.id} priority />
              <figcaption className="absolute inset-x-0 bottom-0 bg-night-950/75 p-5 text-white">
                {active.caption}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
