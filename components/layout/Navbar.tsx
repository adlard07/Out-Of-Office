"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";

interface NavItem {
  label: string;
  short: string;
  href: string;
  icon: string;
  match: (path: string) => boolean;
}

function useNavItems(): NavItem[] {
  const { activeTripId } = useStore();
  return [
    { label: "Home", short: "Home", href: "/", icon: "🏠", match: (p) => p === "/" },
    { label: "Discover", short: "Discover", href: "/discover", icon: "🧭", match: (p) => p.startsWith("/discover") || p.startsWith("/destination") },
    { label: "Spin", short: "Spin", href: "/wheel", icon: "🎡", match: (p) => p.startsWith("/wheel") },
    {
      label: "Upcoming Trip",
      short: "Trip",
      href: activeTripId ? `/trip/${activeTripId}` : "/discover",
      icon: "📍",
      match: (p) => p.startsWith("/trip") || p.startsWith("/plan"),
    },
    { label: "Our Adventures", short: "Book", href: "/adventures", icon: "📖", match: (p) => p.startsWith("/adventures") },
    { label: "Fund", short: "Fund", href: "/fund", icon: "🫙", match: (p) => p.startsWith("/fund") },
  ];
}

export function Navbar() {
  const pathname = usePathname();
  const items = useNavItems();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <>
      {/* Desktop / tablet top bar */}
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-40 hidden transition-all md:block",
          scrolled ? "glass-strong border-b border-white/10" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-6">
          <Link href="/" className="shrink-0 font-display text-lg tracking-tight text-white">
            two<span className="text-brand-400">·</span>tickets
          </Link>
          <ul className="flex items-center gap-0.5 lg:gap-1">
            {items.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors lg:px-4",
                      active ? "text-white" : "text-white/55 hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.header>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Primary"
      >
        <div className="mx-2 flex items-stretch justify-between rounded-2xl border border-white/12 bg-black/92 px-1 py-1.5 backdrop-blur-xl">
          {items.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1 font-medium transition-colors",
                  active ? "text-white" : "text-white/45",
                )}
              >
                <span className={cn("text-[17px] leading-none transition-transform", active && "scale-110")}>
                  {item.icon}
                </span>
                <span className="max-w-full truncate text-[9px] tracking-tight">{item.short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
