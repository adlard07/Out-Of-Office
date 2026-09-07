"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  trackClassName?: string;
  gradient?: string;
  height?: number;
  label?: string;
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  gradient = "#ffffff",
  height = 10,
  label,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div
        className={cn("w-full overflow-hidden rounded-full bg-white/10", trackClassName)}
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
