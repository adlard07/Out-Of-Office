"use client";

import { useActiveTrip } from "@/lib/store";
import { DiscoveryHero } from "@/components/home/DiscoveryHero";
import { UpcomingTripHome } from "@/components/home/UpcomingTripHome";
import { HomeSections } from "@/components/home/HomeSections";

export default function HomePage() {
  // The active trip comes from GET /trips/upcoming, then its full detail.
  const { trip, loading } = useActiveTrip();

  return (
    <>
      {loading ? (
        <div className="min-h-[60svh]" />
      ) : trip ? (
        <UpcomingTripHome trip={trip} />
      ) : (
        <DiscoveryHero />
      )}
      <HomeSections showDiscoveryPrompt={!loading && !trip} />
    </>
  );
}
