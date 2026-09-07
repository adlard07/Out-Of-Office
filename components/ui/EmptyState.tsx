import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  emoji = "🧭",
  title,
  children,
  action,
  className,
}: {
  emoji?: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass flex flex-col items-center rounded-3xl px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 text-4xl">{emoji}</div>
      <h3 className="font-display text-2xl text-white">{title}</h3>
      {children && <p className="mt-2 max-w-sm text-sm text-white/60">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
