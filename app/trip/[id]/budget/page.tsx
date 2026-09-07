"use client";

import { use } from "react";
import { useTrip } from "@/lib/store";
import { BudgetDashboard } from "@/components/budget/BudgetDashboard";

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip(id);
  if (!trip) return null;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-white">Money</h2>
        <p className="text-sm text-white/50">
          Estimates while planning, real numbers while travelling. No spreadsheets.
        </p>
      </div>
      <BudgetDashboard trip={trip} />
    </div>
  );
}
