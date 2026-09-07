"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

export function Footer() {
  const { resetLocal } = useStore();
  return (
    <footer className="mx-auto mt-24 max-w-7xl px-6 pb-28 pt-10 text-sm text-white/40 sm:pb-12">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
        <p className="font-display text-base text-white/70">
          two·tickets — a private travel universe for two
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/discover" className="hover:text-white">Discover</Link>
          <Link href="/wheel" className="hover:text-white">Spin</Link>
          <Link href="/adventures" className="hover:text-white">Adventures</Link>
          <Link href="/fund" className="hover:text-white">Fund</Link>
          <button
            onClick={resetLocal}
            className="rounded-full border border-white/10 px-3 py-1 text-xs hover:border-white/25 hover:text-white"
          >
            Clear local data
          </button>
        </div>
      </div>
      <p className="mt-6 text-xs text-white/30">
        Trips, itineraries and budgets live in the backend · prices in ₹ · the wheel and packing
        ticks stay on this device.
      </p>
    </footer>
  );
}
