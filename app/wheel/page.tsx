"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { WheelEntry } from "@/lib/types";
import { PageShell, PageHeader } from "@/components/layout/PageShell";
import { SpinWheel } from "@/components/wheel/SpinWheel";
import { ResultReveal } from "@/components/wheel/ResultReveal";
import { ClueReveal } from "@/components/wheel/ClueReveal";
import { Segmented } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/lib/store";
import { DESTINATIONS } from "@/data/destinations";
import { cn } from "@/lib/cn";

export default function WheelPage() {
  const { wheel, addToWheel, removeFromWheel, shortlist, knownDestination } = useStore();
  const [spinning, setSpinning] = useState(false);
  const [mode, setMode] = useState<"reveal" | "surprise">("reveal");
  const [result, setResult] = useState<WheelEntry | null>(null);
  const [clueEntry, setClueEntry] = useState<WheelEntry | null>(null);

  // Backend suggestions you have shortlisted, plus the local atlas.
  const candidates = useMemo(() => {
    const shortlisted = shortlist
      .map((id) => knownDestination(id))
      .filter((d) => d !== undefined);
    const seen = new Set(shortlisted.map((d) => d.id));
    return [...shortlisted, ...DESTINATIONS.filter((d) => !seen.has(d.id))];
  }, [shortlist, knownDestination]);

  const available = useMemo(
    () => candidates.filter((d) => !wheel.some((w) => w.id === d.id)),
    [candidates, wheel],
  );
  const shortlistedNotOnWheel = available.filter((d) => shortlist.includes(d.id));

  function handleResult(entry: WheelEntry) {
    if (mode === "surprise") setClueEntry(entry);
    else setResult(entry);
  }

  return (
    <PageShell wide>
      <PageHeader
        kicker="Spin"
        title="Let the wheel decide"
        subtitle="Can't agree? Add the contenders, give it a spin, and commit to whatever it lands on. No takebacks. (Okay, one takeback.)"
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col items-center">
          <div className="mb-6 w-full max-w-xs">
            <Segmented
              value={mode}
              onChange={setMode}
              options={[
                { value: "reveal", label: "Classic spin" },
                { value: "surprise", label: "Complete surprise" },
              ]}
            />
          </div>

          {wheel.length < 2 ? (
            <EmptyState emoji="🎡" title="The wheel needs contenders" className="w-full">
              Add at least two destinations from the panel to start spinning.
            </EmptyState>
          ) : (
            <>
              <SpinWheel
                entries={wheel}
                onResult={handleResult}
                spinning={spinning}
                setSpinning={setSpinning}
              />
              <p className="mt-6 text-sm text-white/45">
                {mode === "surprise"
                  ? "Surprise mode: three clues from the planner before the reveal."
                  : `${wheel.length} destinations on the wheel · tap SPIN`}
              </p>
            </>
          )}
        </div>

        <aside className="space-y-6">
          <div className="glass rounded-3xl p-5">
            <h2 className="font-display text-xl text-white">On the wheel</h2>
            <ul className="mt-3 space-y-2">
              {wheel.map((w) => (
                <li key={w.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <span className="text-sm text-white/85">{w.name}</span>
                  <button
                    onClick={() => removeFromWheel(w.id)}
                    className="text-xs text-white/40 hover:text-brand-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {wheel.length === 0 && <li className="text-sm text-white/40">Nothing yet.</li>}
            </ul>
          </div>

          {shortlistedNotOnWheel.length > 0 && (
            <div className="glass rounded-3xl p-5">
              <h2 className="font-display text-xl text-white">From your shortlist</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {shortlistedNotOnWheel.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => addToWheel({ id: d.id, name: d.name, country: d.country, image: d.image })}
                    className="rounded-full border border-brand-400/40 bg-brand-500/15 px-3 py-1.5 text-sm text-white hover:bg-brand-500/25"
                  >
                    + {d.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="glass rounded-3xl p-5">
            <h2 className="font-display text-xl text-white">Add a destination</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {available.map((d) => (
                <motion.button
                  key={d.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToWheel({ id: d.id, name: d.name, country: d.country, image: d.image })}
                  className={cn(
                    "rounded-full border border-white/12 px-3 py-1.5 text-sm text-white/75 transition hover:border-white/30 hover:text-white",
                  )}
                >
                  + {d.name}
                </motion.button>
              ))}
              {available.length === 0 && (
                <p className="text-sm text-white/40">Every destination is on the wheel already.</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {mode === "reveal" && (
        <ResultReveal
          entry={result}
          onClose={() => setResult(null)}
          onSpinAgain={() => setResult(null)}
        />
      )}
      {mode === "surprise" && (
        <ClueReveal
          entry={clueEntry}
          onClose={() => setClueEntry(null)}
          onSpinAgain={() => setClueEntry(null)}
        />
      )}
    </PageShell>
  );
}
