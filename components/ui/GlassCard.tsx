"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  strong?: boolean;
}

export function GlassCard({ children, className, hover = false, strong = false }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl",
        hover && "hover:border-white/20",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
