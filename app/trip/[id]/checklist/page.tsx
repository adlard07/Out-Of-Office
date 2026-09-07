"use client";

import { use } from "react";
import { useTrip } from "@/lib/store";
import { ChecklistView } from "@/components/trip/ChecklistView";
import { PackingListView } from "@/components/trip/PackingListView";

export default function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip(id);
  if (!trip) return null;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-display text-3xl text-white">Getting ready</h2>
        <p className="text-sm text-white/50">Tick things off. The homepage countdown is watching.</p>
      </div>
      <ChecklistView trip={trip} />
      <PackingListView trip={trip} />
    </div>
  );
}
