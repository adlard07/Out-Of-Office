"use client";

import { useState } from "react";
import type { Destination, ItineraryIntake, ItineraryPace } from "@/lib/types";
import { Field, Segmented, Select, Slider, Toggle, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/currency";
import { formatDateRange } from "@/lib/date";

const FOOD_OPTIONS = ["Anything", "Mostly local", "Vegetarian-friendly", "Street food heavy", "A few fancy dinners"];

/** Local-time date arithmetic — toISOString() would shift the day east of UTC. */
function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * The intake for `POST /trips/plan`. The backend creates the trip and its itinerary in
 * the same call, so this form runs *before* a trip exists — dates and budget included.
 */
export function ItineraryIntakeForm({
  destination,
  onGenerate,
  loading,
  error,
}: {
  destination: Destination;
  onGenerate: (intake: ItineraryIntake) => void;
  loading: boolean;
  error?: string | null;
}) {
  const [startDate, setStartDate] = useState("");
  const [intake, setIntake] = useState<Omit<ItineraryIntake, "startDate" | "endDate">>({
    destinationId: destination.id,
    days: destination.recommendedDays || 7,
    maxBudget:
      Math.round((destination.estimatedCostForTwo * 1.2 || 150000) / 10000) * 10000,
    pace: "balanced",
    foodPreference: "Mostly local",
    adventureLevel: 55,
    shopping: true,
    nightlife: false,
    mustDo: [],
  });
  const [mustDoText, setMustDoText] = useState("");

  const endDate = startDate ? addDays(startDate, intake.days - 1) : "";
  const set = <K extends keyof typeof intake>(k: K, v: (typeof intake)[K]) =>
    setIntake((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate({
          ...intake,
          startDate,
          endDate,
          mustDo: mustDoText.split(",").map((s) => s.trim()).filter(Boolean),
        });
      }}
      className="glass-strong mx-auto max-w-2xl space-y-7 rounded-3xl p-6 sm:p-8"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-brand-300">AI trip planner</p>
        <h2 className="mt-1 font-display text-3xl text-white">Let&apos;s shape {destination.name}</h2>
        <p className="mt-2 text-sm text-white/55">
          A few preferences and the planner drafts a full day-by-day schedule, then saves it as a
          trip. Everything stays editable afterwards.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Start date"
          hint={startDate ? formatDateRange(startDate, endDate) : "when are we going?"}
        >
          <TextInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </Field>
        <Field label="Number of days" hint={`${intake.days} days`}>
          <Slider value={intake.days} onChange={(v) => set("days", v)} min={2} max={18} />
        </Field>
      </div>

      <Field label="Maximum budget" hint={formatMoney(intake.maxBudget)}>
        <Slider
          value={intake.maxBudget}
          onChange={(v) => set("maxBudget", v)}
          min={40000}
          max={600000}
          step={10000}
        />
      </Field>

      <Field label="Pace">
        <Segmented
          value={intake.pace}
          onChange={(v) => set("pace", v as ItineraryPace)}
          options={[
            { value: "relaxed", label: "Relaxed" },
            { value: "balanced", label: "Balanced" },
            { value: "packed", label: "Packed" },
          ]}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Food preference">
          <Select value={intake.foodPreference} onChange={(e) => set("foodPreference", e.target.value)}>
            {FOOD_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-night-900">
                {o}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Adventure level" hint={intake.adventureLevel > 66 ? "Bring it on" : intake.adventureLevel > 33 ? "Some" : "Gentle"}>
          <Slider
            value={intake.adventureLevel}
            onChange={(v) => set("adventureLevel", v)}
            leftLabel="Spa days"
            rightLabel="Cliff jumps"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle checked={intake.shopping} onChange={(v) => set("shopping", v)} label="Leave time for shopping" />
        <Toggle checked={intake.nightlife} onChange={(v) => set("nightlife", v)} label="Some nightlife" />
      </div>

      <Field label="Must-do activities" hint="comma separated">
        <TextInput
          value={mustDoText}
          onChange={(e) => setMustDoText(e.target.value)}
          placeholder="Sunrise volcano trek, cooking class…"
        />
      </Field>

      {error && (
        <p className="rounded-2xl border border-brand-400/30 bg-brand-500/10 p-4 text-sm text-brand-100">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading || !startDate}>
        {loading ? "Drafting your days…" : startDate ? "Generate itinerary" : "Pick a start date"}
      </Button>
      {loading && (
        <p className="text-center text-xs text-white/40">
          The planner writes the whole trip in one go — this can take a few seconds.
        </p>
      )}
    </form>
  );
}
