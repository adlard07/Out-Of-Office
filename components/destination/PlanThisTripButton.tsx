"use client";

import { useRouter } from "next/navigation";
import type { Destination } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";

export function PlanThisTripButton({
  destination,
  size = "lg",
  className,
  label = "Plan This Trip",
}: {
  destination: Destination;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const { tripSummaries, setActiveTrip } = useStore();

  function go() {
    // The backend keys trips by destination name, not by our atlas id.
    const existing = tripSummaries.find(
      (t) => t.destinationName.toLowerCase() === destination.name.toLowerCase(),
    );
    if (existing) {
      setActiveTrip(existing.id);
      router.push(`/trip/${existing.id}`);
      return;
    }
    router.push(`/plan/${destination.id}`);
  }

  return (
    <Button onClick={go} size={size} className={className}>
      {label} <span aria-hidden>→</span>
    </Button>
  );
}
