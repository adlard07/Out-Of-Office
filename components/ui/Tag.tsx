import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Tag({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "brand" | "gold" | "solid";
}) {
  const tones = {
    default: "bg-white/8 text-white/80 border border-white/10",
    brand: "bg-brand-500/15 text-brand-200 border border-brand-400/25",
    gold: "bg-gold-400/15 text-gold-300 border border-gold-400/25",
    solid: "bg-white text-night-950 border border-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
