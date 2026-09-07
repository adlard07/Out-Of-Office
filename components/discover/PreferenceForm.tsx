"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DiscoveryPreferences, TravelMood } from "@/lib/types";
import { MOODS } from "@/data/moods";
import { MONTHS } from "@/lib/date";
import { Field, Select, Slider, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/currency";

const DEFAULTS: DiscoveryPreferences = {
  budgetForTwo: 200000,
  days: 7,
  month: MONTHS[new Date().getMonth() + 1] ?? "January",
  mood: "beach",
  notes: "",
};

/** Starters, appended rather than replacing whatever has already been typed. */
const PROMPT_STARTERS = [
  "No long flights.",
  "Somewhere new to us.",
  "Food over sights.",
  "One big adventure day.",
  "Not touristy.",
];

const NOTES_LIMIT = 1000;

export function PreferenceForm({
  onSubmit,
  loading,
}: {
  onSubmit: (prefs: DiscoveryPreferences) => void;
  loading: boolean;
}) {
  const [prefs, setPrefs] = useState<DiscoveryPreferences>(DEFAULTS);
  const set = <K extends keyof DiscoveryPreferences>(k: K, v: DiscoveryPreferences[K]) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(prefs);
      }}
      className="glass-strong space-y-7 rounded-3xl p-6 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Budget for two" hint={formatMoney(prefs.budgetForTwo)}>
          <Slider
            value={prefs.budgetForTwo}
            onChange={(v) => set("budgetForTwo", v)}
            min={40000}
            max={600000}
            step={10000}
            leftLabel="₹40k"
            rightLabel="₹6L"
          />
        </Field>

        <Field label="Number of days" hint={`${prefs.days} days`}>
          <Slider
            value={prefs.days}
            onChange={(v) => set("days", v)}
            min={2}
            max={21}
            leftLabel="Weekend"
            rightLabel="3 weeks"
          />
        </Field>
      </div>

      <Field label="Approximate travel month">
        <Select value={prefs.month} onChange={(e) => set("month", e.target.value)}>
          {MONTHS.map((m) => (
            <option key={m} value={m} className="bg-night-900">
              {m}
            </option>
          ))}
        </Select>
      </Field>

      <div>
        <p className="mb-3 text-sm font-medium text-white/85">Travel mood</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {MOODS.map((m) => {
            const active = prefs.mood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => set("mood", m.id as TravelMood)}
                className={`rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-brand-400/60 bg-brand-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="mt-1 block text-sm font-medium text-white">{m.label}</span>
                <span className="block text-xs text-white/45">{m.blurb}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Field
          label="In your own words"
          hint={prefs.notes ? `${prefs.notes.length}/${NOTES_LIMIT}` : "optional"}
        >
          <TextArea
            value={prefs.notes}
            onChange={(e) => set("notes", e.target.value.slice(0, NOTES_LIMIT))}
            maxLength={NOTES_LIMIT}
            placeholder="Somewhere we can dive in the morning and eat properly at night. No long flights. One train ride we'll still talk about next year."
          />
        </Field>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {PROMPT_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() =>
                set(
                  "notes",
                  (prefs.notes.trim() ? `${prefs.notes.trim()} ${starter}` : starter).slice(
                    0,
                    NOTES_LIMIT,
                  ),
                )
              }
              className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/30 hover:text-white"
            >
              + {starter}
            </button>
          ))}
        </div>

        <p className="mt-2.5 text-xs text-white/40">
          This is the part that counts most — where it disagrees with the mood above, we follow
          your words.
        </p>
      </div>

      <motion.div whileTap={{ scale: 0.99 }}>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Reading your minds…" : "Find our next trip"}
        </Button>
      </motion.div>
    </form>
  );
}
