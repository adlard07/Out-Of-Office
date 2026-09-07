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
          "fixed inset-x-0 top-0 z-40 hidden transition-all sm:block",
          scrolled ? "glass-strong border-b border-white/10" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg tracking-tight text-white">
            two<span className="text-brand-400">·</span>tickets
          </Link>
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
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
      <nav className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div className="glass-strong mx-3 mb-3 flex items-center justify-between rounded-2xl px-2 py-2">
          {items.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-colors",
                  active ? "text-white" : "text-white/45",
                )}
              >
                <span className={cn("text-base transition-transform", active && "scale-110")}>
                  {item.icon}
                </span>
                {item.short}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
