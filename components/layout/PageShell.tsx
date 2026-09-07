import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Standard inner-page wrapper: top padding to clear the fixed nav + max width. */
export function PageShell({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <main
      className={cn(
        "mx-auto px-5 pb-28 pt-24 sm:px-6 sm:pb-16 sm:pt-28",
        wide ? "max-w-7xl" : "max-w-5xl",
        className,
      )}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-10">
      {kicker && (
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-300">{kicker}</p>
      )}
      <h1 className="font-display text-4xl leading-tight text-white text-balance sm:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 max-w-2xl text-white/60">{subtitle}</p>}
    </header>
  );
}
