"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function parts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ target, compact = false }: { target: string; compact?: boolean }) {
  const targetDate = new Date(target);
  const [t, setT] = useState(() => parts(targetDate));

  useEffect(() => {
    const i = setInterval(() => setT(parts(targetDate)), 1000);
    return () => clearInterval(i);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  const units: [string, number][] = [
    ["days", t.days],
    ["hrs", t.hours],
    ["min", t.minutes],
    ["sec", t.seconds],
  ];

  if (compact) {
    return (
      <span className="font-display text-2xl text-white">
        {t.days}
        <span className="text-base text-white/50"> days</span>
      </span>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4">
      {units.map(([label, value]) => (
        <div key={label} className="glass flex min-w-[64px] flex-col items-center rounded-2xl px-3 py-3 sm:min-w-[84px] sm:px-4">
          <motion.span
            key={value}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-3xl tabular-nums text-white sm:text-4xl"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
          <span className="mt-1 text-[10px] uppercase tracking-widest text-white/45">{label}</span>
        </div>
      ))}
    </div>
  );
}
