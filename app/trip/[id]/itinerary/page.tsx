"use client";

import { use } from "react";
import Link from "next/link";
import { useTrip } from "@/lib/store";
import { ItineraryBoard } from "@/components/itinerary/ItineraryBoard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip(id);

  if (!trip) return null;

  if (trip.itinerary.length === 0) {
    return (
      <EmptyState emoji="🗺️" title="This trip has no days yet">
        The planner writes the itinerary when a trip is created. Ask the assistant on this page to
        build one, or{" "}
        <Link href="/discover" className="text-brand-300 hover:text-brand-200">
          plan a fresh trip
        </Link>
        .
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-white">Day by day</h2>
        <p className="text-sm text-white/50">
          Every change here is saved to the trip. Tick things off, move them, or just tell the
          assistant what to fix.
        </p>
      </div>
      <ItineraryBoard trip={trip} />
    </div>
  );
}
