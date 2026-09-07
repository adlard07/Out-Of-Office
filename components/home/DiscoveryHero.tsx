"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { photo } from "@/lib/images";

const ACTIONS = [
  { label: "Surprise Me", sub: "Let fate decide", href: "/wheel", icon: "🎲", variant: "gold" },
  { label: "Explore Destinations", sub: "Tell us the vibe", href: "/discover", icon: "🧭", variant: "primary" },
  { label: "Plan Somewhere Specific", sub: "We already know", href: "/discover?tab=specific", icon: "📍", variant: "glass" },
  { label: "Our Adventures", sub: "The memory book", href: "/adventures", icon: "📖", variant: "glass" },
] as const;

const variantCls: Record<string, string> = {
  gold: "bg-gold-400 text-night-950 hover:bg-gold-300",
  primary: "bg-brand-500 text-white hover:bg-brand-400",
  glass: "glass text-white hover:bg-white/12",
};

export function DiscoveryHero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={photo("1507525428034-b723cf961d3e", 2400)}
          alt="A quiet beach at golden hour"
          fallbackSeed="hero-beach"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/50 to-night-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-night-950/60 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-32 pt-28 sm:px-6 sm:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-sm font-medium uppercase tracking-[0.25em] text-white/70"
        >
          Just the two of us
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="mt-3 max-w-3xl font-display text-[2.6rem] leading-[1.05] text-white text-balance sm:text-6xl lg:text-7xl"
        >
          Where should we go next?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
          className="mt-5 max-w-xl text-lg text-white/70"
        >
          Dream up the next escape, plan every hour of it, then keep it forever. This little
          universe is just for us.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
          className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {ACTIONS.map((a, i) => (
            <motion.div key={a.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={a.href}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors ${variantCls[a.variant]}`}
              >
                <span className="text-2xl">{a.icon}</span>
                <span className="flex flex-col text-left">
                  <span className="text-base font-semibold tracking-tight">{a.label}</span>
                  <span className="text-xs opacity-70">{a.sub}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
