"use client";

import { use } from "react";
import { useTripDetail } from "@/lib/store";
import { TripChrome } from "@/components/trip/TripChrome";
import { NotFoundBlock } from "@/components/ui/NotFoundBlock";

export default function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { trip, loading } = useTripDetail(id);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 pt-32 sm:px-6">
        <div className="glass h-40 animate-pulse rounded-3xl" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="glass h-24 animate-pulse rounded-2xl" />
          <div className="glass h-24 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!trip) {
    return (
      <NotFoundBlock
        title="No trip here yet"
        message="Pick a destination and hit 'Plan This Trip' to start one."
        href="/discover"
        cta="Find a destination"
      />
    );
  }
  return <TripChrome trip={trip}>{children}</TripChrome>;
}
