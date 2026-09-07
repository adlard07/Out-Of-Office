"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Itinerary", icon: "🗓️", seg: "itinerary" },
  { label: "Budget", icon: "💰", seg: "budget" },
  { label: "Expenses", icon: "🧾", seg: "budget#expenses" },
  { label: "Packing", icon: "🎒", seg: "checklist#packing" },
  { label: "Checklist", icon: "✅", seg: "checklist" },
  { label: "Travel details", icon: "✈️", seg: "itinerary#travel" },
];

export function TripQuickNav({ tripId }: { tripId: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {LINKS.map((l, i) => (
        <motion.div
          key={l.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
        >
          <Link
            href={`/trip/${tripId}/${l.seg}`}
            className="glass flex flex-col items-center gap-2 rounded-2xl px-3 py-5 text-center transition-colors hover:bg-white/12"
          >
            <span className="text-2xl">{l.icon}</span>
            <span className="text-sm font-medium text-white/85">{l.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
