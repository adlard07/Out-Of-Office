"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import type { ItineraryIntake } from "@/lib/types";
import { useStore } from "@/lib/store";
import { PageShell, PageHeader } from "@/components/layout/PageShell";
import { ItineraryIntakeForm } from "@/components/itinerary/ItineraryIntakeForm";
import { NotFoundBlock } from "@/components/ui/NotFoundBlock";
import { ApiError } from "@/services";

/**
 * `POST /trips/plan` creates the trip *and* its itinerary, so the planner form lives
 * here — before a trip id exists — rather than inside the trip pages.
 */
export default function PlanTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { knownDestination, planTrip, hydrated, destinations } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destination = knownDestination(id);

  if (!hydrated) return <PageShell><div className="min-h-[50vh]" /></PageShell>;
  if (!destination) {
    return (
      <NotFoundBlock
        title="We don't know that destination yet"
        message="Discover a few options first, then plan one of them."
        href="/discover"
        cta="Discover destinations"
      />
    );
  }

  async function generate(intake: ItineraryIntake) {
    if (!destination) return;
    setLoading(true);
    setError(null);
    try {
      const tripId = await planTrip(intake, {
        name: destination.name,
        country: destination.country,
        // Only send an id the backend issued; atlas slugs mean nothing to it.
        id: destinations[destination.id] ? destination.id : undefined,
      });
      router.push(`/trip/${tripId}`);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.detail : "Could not plan the trip.");
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        kicker="Plan"
        title={`Planning ${destination.name}`}
        subtitle={destination.tagline}
      />
      <ItineraryIntakeForm
        destination={destination}
        onGenerate={generate}
        loading={loading}
        error={error}
      />
    </PageShell>
  );
}
