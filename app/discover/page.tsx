"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { DiscoveryPreferences } from "@/lib/types";
import { destinations as destinationsApi, type DestinationRecommendation } from "@/services";
import { useStore } from "@/lib/store";
import { PageShell, PageHeader } from "@/components/layout/PageShell";
import { PreferenceForm } from "@/components/discover/PreferenceForm";
import { SpecificPicker } from "@/components/discover/SpecificPicker";
import { DestinationCard } from "@/components/discover/DestinationCard";
import { Segmented } from "@/components/ui/Field";
import { MOOD_LABEL } from "@/data/moods";

function DiscoverInner() {
  const search = useSearchParams();
  const [tab, setTab] = useState<"explore" | "specific">(
    search.get("tab") === "specific" ? "specific" : "explore",
  );
  const { cacheDestinations } = useStore();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DestinationRecommendation[] | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [askedFor, setAskedFor] = useState<string>("");
  const [failure, setFailure] = useState<string | null>(null);

  async function run(prefs: DiscoveryPreferences) {
    setLoading(true);
    setResults(null);
    setFailure(null);
    try {
      const recs = await destinationsApi.discover(prefs);
      // The backend persists each suggestion; cache them so detail pages can read them.
      cacheDestinations(recs.map((r) => r.destination));
      setResults(recs);
      setAskedFor(prefs.notes.trim());
      setSummary(
        `${prefs.days} days · ${MOOD_LABEL[prefs.mood]} · around ${prefs.month} · budget ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(prefs.budgetForTwo)}`,
      );
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "Could not reach the planner.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell wide>
      <PageHeader
        kicker="Discover"
        title={tab === "explore" ? "Where should we go next?" : "Somewhere specific"}
        subtitle={
          tab === "explore"
            ? "Set the budget and timing, then tell us in your own words what the trip should feel like. We'll match you with places that actually fit."
            : undefined
        }
      />

      <div className="mb-8 max-w-xs">
        <Segmented
          value={tab}
          onChange={(v) => setTab(v)}
          options={[
            { value: "explore", label: "Explore" },
            { value: "specific", label: "We know where" },
          ]}
        />
      </div>

      <AnimatePresence mode="wait">
        {tab === "specific" ? (
          <motion.div key="specific" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SpecificPicker />
          </motion.div>
        ) : (
          <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <PreferenceForm onSubmit={run} loading={loading} />
              </div>

              <div>
                {failure && !loading && (
                  <div className="glass mb-6 rounded-3xl border border-brand-400/30 p-6 text-center">
                    <p className="text-white/75">{failure}</p>
                    <p className="mt-1 text-sm text-white/45">
                      The suggestions come from the backend planner — check it is running and try again.
                    </p>
                  </div>
                )}

                {!results && !loading && !failure && (
                  <div className="glass flex h-full min-h-64 flex-col items-center justify-center rounded-3xl p-10 text-center">
                    <span className="text-4xl">✨</span>
                    <p className="mt-3 max-w-xs text-white/60">
                      Your matches will appear here. Nothing is booked, everything is possible.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="glass h-80 animate-pulse rounded-3xl" />
                    ))}
                  </div>
                )}

                {results && (
                  <>
                    <div className="mb-5">
                      <p className="text-sm text-white/50">{summary}</p>
                      {askedFor && (
                        <p className="mt-1 max-w-2xl text-sm italic text-white/40">
                          &ldquo;{askedFor}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {results.map((rec, i) => (
                        <DestinationCard
                          key={rec.destination.id}
                          destination={rec.destination}
                          recommendation={rec}
                          index={i}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<PageShell wide><div className="h-64" /></PageShell>}>
      <DiscoverInner />
    </Suspense>
  );
}
