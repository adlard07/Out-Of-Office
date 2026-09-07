"use client";

import { use } from "react";
import { useStore } from "@/lib/store";
import { DestinationDetail } from "@/components/destination/DestinationDetail";
import { NotFoundBlock } from "@/components/ui/NotFoundBlock";

export default function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Backend suggestions are cached in the store — there is no GET /destinations/{id}.
  const { knownDestination, hydrated } = useStore();
  const destination = knownDestination(id);

  if (!hydrated) return <div className="min-h-[60vh]" />;
  if (!destination) {
    return (
      <NotFoundBlock
        title="That destination isn't in our little atlas"
        message="It may have come from a search on another device. Run a discovery again to bring it back."
        href="/discover"
        cta="Discover destinations"
      />
    );
  }
  return <DestinationDetail destination={destination} />;
}
