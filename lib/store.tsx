"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  Adventure,
  Destination,
  Expense,
  FundEntryKind,
  ItineraryIntake,
  PackingItem,
  TravelFund,
  Trip,
  TripSummary,
  WheelEntry,
} from "./types";
import { ApiError } from "./api";
import { buildLedger, defaultFund, fundBalance, fundStats, currentMonthKey } from "./fund";
import {
  adventures as adventuresApi,
  checklist as checklistApi,
  destinations as destinationsApi,
  expenses as expensesApi,
  trips as tripsApi,
} from "@/services";
import { mergeTrip } from "@/services/map";
import type { ApiTrip } from "@/services/dto";
import { getDestination } from "@/data/destinations";

const STORAGE_KEY = "travel-universe.v2";

/**
 * Trips, itineraries, budgets, checklists and the shortlist all live in the backend.
 * What stays on the device is genuinely local: the wheel line-up, which trip is being
 * looked at, a cache of API destinations (the backend has no `GET /destinations/{id}`),
 * and packing tick-boxes — the one thing with no endpoint to save to.
 */
interface PersistShape {
  wheel: WheelEntry[];
  activeTripId: string | null;
  shortlist: string[];
  /** API destinations we have seen, so detail pages survive a refresh. */
  destinations: Record<string, Destination>;
  /** `${tripId}:${packingItemId}` -> packed. No backend route for this yet. */
  packed: Record<string, boolean>;
  /** The couples travel fund — a personal savings tracker, device-local. */
  fund: TravelFund;
}

const EMPTY: PersistShape = {
  wheel: [],
  activeTripId: null,
  shortlist: [],
  destinations: {},
  packed: {},
  fund: defaultFund(),
};

interface StoreValue extends PersistShape {
  hydrated: boolean;
  error: string | null;
  clearError: () => void;

  /* destinations */
  cacheDestinations: (list: Destination[]) => void;
  knownDestination: (id: string) => Destination | undefined;
  isShortlisted: (id: string) => boolean;
  toggleShortlist: (destination: Destination) => Promise<void>;

  /* wheel */
  addToWheel: (entry: WheelEntry) => void;
  removeFromWheel: (id: string) => void;

  /* trips */
  trips: Record<string, Trip>;
  tripSummaries: TripSummary[];
  tripsLoading: boolean;
  setActiveTrip: (id: string | null) => void;
  refreshTrips: () => Promise<void>;
  loadTrip: (id: string) => Promise<Trip | undefined>;
  setTrip: (trip: Trip) => void;
  /** Apply a trip returned by an itinerary/activity route, keeping loaded children. */
  applyTripDto: (dto: ApiTrip) => void;
  planTrip: (
    intake: ItineraryIntake,
    destination: { name: string; country: string; id?: string },
  ) => Promise<string>;
  deleteTrip: (id: string) => Promise<void>;

  /* trip children */
  addExpense: (tripId: string, expense: Omit<Expense, "id">) => Promise<void>;
  toggleChecklistItem: (tripId: string, itemId: string) => Promise<void>;
  setPacking: (tripId: string, items: PackingItem[]) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;

  /* travel fund (device-local) */
  setFundPerPerson: (perPerson: number) => void;
  setFundPeople: (people: number) => void;
  addFundEntry: (entry: { amount: number; kind: FundEntryKind; month?: string; note?: string }) => void;
  removeFundEntry: (id: string) => void;
  correctFundBalance: (target: number) => void;
  resetFund: () => void;

  /**
   * Wipe *all* device-local state — wheel line-up, shortlist, destination cache,
   * packing ticks, active-trip pointer and the travel fund (back to its seed).
   * Server data (trips, itineraries, the memory book) is untouched.
   */
  resetLocal: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function unique(ids: string[]): string[] {
  return [...new Set(ids)];
}

function describe(error: unknown): string {
  if (error instanceof ApiError) return error.detail;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [local, setLocal] = useState<PersistShape>(EMPTY);
  const [trips, setTrips] = useState<Record<string, Trip>>({});
  const [tripSummaries, setTripSummaries] = useState<TripSummary[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(new Map<string, Promise<Trip | undefined>>());
  // Read inside callbacks that must not re-create themselves on every tick.
  const packedRef = useRef(local.packed);
  useEffect(() => {
    packedRef.current = local.packed;
  }, [local.packed]);

  /* ---------------- persistence ---------------- */

  // Load once on mount. Both setState calls batch into a single commit, so by the
  // time the writer effect below sees `hydrated === true`, `local` is already the
  // restored value — never EMPTY.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistShape>;
        setLocal({
          ...EMPTY,
          ...parsed,
          fund: parsed.fund ? { ...EMPTY.fund, ...parsed.fund } : EMPTY.fund,
        });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    } catch {
      /* storage full / unavailable */
    }
  }, [local, hydrated]);

  /** Packed ticks are device-local, so re-apply them whenever a trip arrives. */
  const withPacked = useCallback(
    (trip: Trip, packed: Record<string, boolean>): Trip => ({
      ...trip,
      packing: trip.packing.map((item) => ({
        ...item,
        packed: packed[`${trip.id}:${item.id}`] ?? item.packed,
      })),
    }),
    [],
  );

  const setTrip = useCallback(
    (trip: Trip) => {
      setTrips((current) => ({ ...current, [trip.id]: withPacked(trip, packedRef.current) }));
    },
    [withPacked],
  );

  const applyTripDto = useCallback(
    (dto: ApiTrip) => {
      setTrips((current) => ({
        ...current,
        [dto.id]: withPacked(mergeTrip(current[dto.id], dto), packedRef.current),
      }));
    },
    [withPacked],
  );

  /* ---------------- destinations & shortlist ---------------- */

  const cacheDestinations = useCallback((list: Destination[]) => {
    if (!list.length) return;
    setLocal((s) => ({
      ...s,
      destinations: { ...s.destinations, ...Object.fromEntries(list.map((d) => [d.id, d])) },
    }));
  }, []);

  const knownDestination = useCallback(
    (id: string) => local.destinations[id] ?? getDestination(id),
    [local.destinations],
  );

  const toggleShortlist = useCallback(
    async (destination: Destination) => {
      const id = destination.id;
      const next = !local.shortlist.includes(id);
      setLocal((s) => ({
        ...s,
        shortlist: next ? unique([...s.shortlist, id]) : s.shortlist.filter((x) => x !== id),
      }));

      // Only destinations the backend actually knows about can be shortlisted there.
      if (!local.destinations[id]) return;
      try {
        const updated = await destinationsApi.setShortlisted(id, next);
        cacheDestinations([updated]);
      } catch (cause) {
        setError(describe(cause));
        setLocal((s) => ({
          ...s,
          shortlist: next ? s.shortlist.filter((x) => x !== id) : unique([...s.shortlist, id]),
        }));
      }
    },
    [local.shortlist, local.destinations, cacheDestinations],
  );

  /* ---------------- wheel (client-side only) ---------------- */

  const addToWheel = useCallback((entry: WheelEntry) => {
    setLocal((s) => (s.wheel.some((w) => w.id === entry.id) ? s : { ...s, wheel: [...s.wheel, entry] }));
  }, []);

  const removeFromWheel = useCallback((id: string) => {
    setLocal((s) => ({ ...s, wheel: s.wheel.filter((w) => w.id !== id) }));
  }, []);

  const setActiveTrip = useCallback((id: string | null) => {
    setLocal((s) => ({ ...s, activeTripId: id }));
  }, []);

  /* ---------------- trips ---------------- */

  const refreshTrips = useCallback(async () => {
    try {
      const summaries = await tripsApi.upcoming();
      setTripSummaries(summaries);
      setLocal((s) => ({
        ...s,
        activeTripId:
          s.activeTripId && summaries.some((t) => t.id === s.activeTripId)
            ? s.activeTripId
            : summaries[0]?.id ?? null,
      }));
    } catch (cause) {
      setError(describe(cause));
    } finally {
      setTripsLoading(false);
    }
  }, []);

  const loadTrip = useCallback(
    async (id: string) => {
      const running = inFlight.current.get(id);
      if (running) return running;

      const request = (async () => {
        try {
          const trip = await tripsApi.get(id);
          setTrip(trip);
          return trip;
        } catch (cause) {
          if (!(cause instanceof ApiError && cause.status === 404)) setError(describe(cause));
          return undefined;
        } finally {
          inFlight.current.delete(id);
        }
      })();

      inFlight.current.set(id, request);
      return request;
    },
    [setTrip],
  );

  const planTrip = useCallback<StoreValue["planTrip"]>(
    async (intake, destination) => {
      const trip = await tripsApi.plan(intake, destination);
      setTrip(trip);
      setLocal((s) => ({ ...s, activeTripId: trip.id }));
      void refreshTrips();
      return trip.id;
    },
    [setTrip, refreshTrips],
  );

  const deleteTrip = useCallback(
    async (id: string) => {
      try {
        await tripsApi.remove(id);
        setTrips((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        });
        setLocal((s) => ({ ...s, activeTripId: s.activeTripId === id ? null : s.activeTripId }));
        await refreshTrips();
      } catch (cause) {
        setError(describe(cause));
      }
    },
    [refreshTrips],
  );

  /* ---------------- trip children ---------------- */

  const addExpense = useCallback(
    async (tripId: string, expense: Omit<Expense, "id">) => {
      try {
        const created = await expensesApi.add(tripId, expense);
        // The budget summary is recomputed server-side, so take it from there.
        const budgetLines = await expensesApi.budgetLines(tripId);
        setTrips((current) => {
          const trip = current[tripId];
          if (!trip) return current;
          return {
            ...current,
            [tripId]: { ...trip, expenses: [created, ...trip.expenses], budgetLines },
          };
        });
      } catch (cause) {
        setError(describe(cause));
      }
    },
    [],
  );

  const toggleChecklistItem = useCallback(async (tripId: string, itemId: string) => {
    let previous: boolean | undefined;
    setTrips((current) => {
      const trip = current[tripId];
      if (!trip) return current;
      const checklist = trip.checklist.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          if (item.id !== itemId) return item;
          previous = item.done;
          return { ...item, done: !item.done };
        }),
      }));
      return { ...current, [tripId]: { ...trip, checklist } };
    });

    try {
      await checklistApi.setCompleted(tripId, itemId, !previous);
    } catch (cause) {
      setError(describe(cause));
      setTrips((current) => {
        const trip = current[tripId];
        if (!trip) return current;
        const checklist = trip.checklist.map((section) => ({
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, done: previous ?? item.done } : item,
          ),
        }));
        return { ...current, [tripId]: { ...trip, checklist } };
      });
    }
  }, []);

  const setPacking = useCallback(
    (tripId: string, items: PackingItem[]) => {
      setTrips((current) => {
        const trip = current[tripId];
        if (!trip) return current;
        return {
          ...current,
          [tripId]: withPacked({ ...trip, packing: items }, packedRef.current),
        };
      });
    },
    [withPacked],
  );

  /** No backend route stores this, so it lives in localStorage. */
  const togglePackingItem = useCallback((tripId: string, itemId: string) => {
    const key = `${tripId}:${itemId}`;
    setLocal((s) => ({ ...s, packed: { ...s.packed, [key]: !s.packed[key] } }));
    setTrips((current) => {
      const trip = current[tripId];
      if (!trip) return current;
      return {
        ...current,
        [tripId]: {
          ...trip,
          packing: trip.packing.map((item) =>
            item.id === itemId ? { ...item, packed: !item.packed } : item,
          ),
        },
      };
    });
  }, []);

  /* ---------------- travel fund ---------------- */

  const setFundPerPerson = useCallback((perPerson: number) => {
    const value = Math.max(0, Math.round(perPerson));
    setLocal((s) => {
      const month = currentMonthKey();
      const rates = [
        ...s.fund.rates.filter((r) => r.fromMonth !== month),
        { fromMonth: month, perPerson: value },
      ].sort((a, b) => (a.fromMonth < b.fromMonth ? -1 : 1));
      return { ...s, fund: { ...s.fund, rates } };
    });
  }, []);

  const setFundPeople = useCallback((people: number) => {
    const value = Math.max(1, Math.round(people));
    setLocal((s) => ({ ...s, fund: { ...s.fund, people: value } }));
  }, []);

  const addFundEntry = useCallback<StoreValue["addFundEntry"]>((entry) => {
    setLocal((s) => ({
      ...s,
      fund: {
        ...s.fund,
        entries: [
          ...s.fund.entries,
          {
            id: `fe-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
            amount: Math.abs(Math.round(entry.amount)),
            kind: entry.kind,
            month: entry.month ?? currentMonthKey(),
            note: entry.note?.trim() || undefined,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    }));
  }, []);

  const removeFundEntry = useCallback((id: string) => {
    setLocal((s) => ({
      ...s,
      fund: { ...s.fund, entries: s.fund.entries.filter((e) => e.id !== id) },
    }));
  }, []);

  const correctFundBalance = useCallback((target: number) => {
    setLocal((s) => {
      const delta = Math.round(target) - fundBalance(s.fund);
      if (delta === 0) return s;
      return {
        ...s,
        fund: {
          ...s.fund,
          entries: [
            ...s.fund.entries,
            {
              id: `fe-${Date.now().toString(36)}`,
              amount: Math.abs(delta),
              kind: delta > 0 ? "deposit" : "withdrawal",
              month: currentMonthKey(),
              note: "Balance correction",
              createdAt: new Date().toISOString(),
            },
          ],
        },
      };
    });
  }, []);

  const resetFund = useCallback(() => {
    setLocal((s) => ({ ...s, fund: defaultFund() }));
  }, []);

  const resetLocal = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    setLocal({ ...EMPTY, fund: defaultFund() });
    setTrips({});
    void refreshTrips();
  }, [refreshTrips]);

  /* ---------------- initial load ---------------- */

  useEffect(() => {
    if (!hydrated) return;
    void refreshTrips();

    let active = true;
    destinationsApi
      .shortlist()
      .then((rows) => {
        if (!active) return;
        const byId = Object.fromEntries(rows.map((d) => [d.id, d]));
        const backendIds = rows.map((d) => d.id);
        setLocal((s) => {
          const cache = { ...s.destinations, ...byId };
          // Drop API destinations that are no longer shortlisted server-side; keep
          // atlas entries, which have no backend row to sync with.
          const localOnly = s.shortlist.filter((id) => !(id in cache));
          return { ...s, destinations: cache, shortlist: unique([...localOnly, ...backendIds]) };
        });
      })
      .catch(() => {
        /* the trips call already reports an unreachable backend */
      });
    return () => {
      active = false;
    };
  }, [hydrated, refreshTrips]);

  const value = useMemo<StoreValue>(
    () => ({
      ...local,
      hydrated,
      error,
      clearError: () => setError(null),
      cacheDestinations,
      knownDestination,
      isShortlisted: (id: string) => local.shortlist.includes(id),
      toggleShortlist,
      addToWheel,
      removeFromWheel,
      trips,
      tripSummaries,
      tripsLoading,
      setActiveTrip,
      refreshTrips,
      loadTrip,
      setTrip,
      applyTripDto,
      planTrip,
      deleteTrip,
      addExpense,
      toggleChecklistItem,
      setPacking,
      togglePackingItem,
      setFundPerPerson,
      setFundPeople,
      addFundEntry,
      removeFundEntry,
      correctFundBalance,
      resetFund,
      resetLocal,
    }),
    [
      local,
      hydrated,
      error,
      cacheDestinations,
      knownDestination,
      toggleShortlist,
      addToWheel,
      removeFromWheel,
      trips,
      tripSummaries,
      tripsLoading,
      setActiveTrip,
      refreshTrips,
      loadTrip,
      setTrip,
      applyTripDto,
      planTrip,
      deleteTrip,
      addExpense,
      toggleChecklistItem,
      setPacking,
      togglePackingItem,
      setFundPerPerson,
      setFundPeople,
      addFundEntry,
      removeFundEntry,
      correctFundBalance,
      resetFund,
      resetLocal,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function useTrip(id: string): Trip | undefined {
  const { trips } = useStore();
  return trips[id];
}

/** Fetches the trip on mount and reports load state — trips are server-owned now. */
export function useTripDetail(id: string | null): {
  trip: Trip | undefined;
  loading: boolean;
} {
  const { trips, loadTrip, hydrated } = useStore();
  const [pending, setPending] = useState(true);
  const trip = id ? trips[id] : undefined;

  useEffect(() => {
    if (!hydrated || !id) return;
    let active = true;
    void loadTrip(id).finally(() => {
      if (active) setPending(false);
    });
    return () => {
      active = false;
    };
  }, [id, hydrated, loadTrip]);

  return { trip, loading: Boolean(id) && pending && !trip };
}

export function useActiveTrip(): { trip: Trip | undefined; loading: boolean } {
  const { activeTripId, tripsLoading } = useStore();
  const { trip, loading } = useTripDetail(activeTripId);
  return { trip, loading: tripsLoading || loading };
}

/** The travel fund plus its derived ledger and headline stats. */
export function useFund() {
  const { fund, hydrated } = useStore();
  return {
    fund,
    hydrated,
    stats: fundStats(fund),
    ledger: buildLedger(fund),
  };
}

/** The memory book — completed trips, straight from `GET /adventures`. */
export function useAdventures(): { adventures: Adventure[]; loading: boolean; error: string | null } {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    adventuresApi
      .list(controller.signal)
      .then(setAdventures)
      .catch((cause) => {
        if (controller.signal.aborted) return;
        setFailure(describe(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { adventures, loading, error: failure };
}

/** One completed trip from `GET /adventures/{id}`. */
export function useAdventure(id: string): {
  adventure: Adventure | undefined;
  loading: boolean;
  error: string | null;
} {
  const [adventure, setAdventure] = useState<Adventure | undefined>();
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    adventuresApi
      .get(id, controller.signal)
      .then(setAdventure)
      .catch((cause) => {
        if (controller.signal.aborted) return;
        if (!(cause instanceof ApiError && cause.status === 404)) setFailure(describe(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  return { adventure, loading, error: failure };
}
