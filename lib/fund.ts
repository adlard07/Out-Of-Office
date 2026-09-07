import type { TravelFund } from "./types";

/**
 * The travel fund is derived state. We store an anchor balance (accurate as of
 * `anchorMonth`), the per-person contribution history, and any manual deposits /
 * withdrawals. The monthly contribution "counter" is generated on the fly — one
 * row per calendar month after the anchor, up to the current month — so it stays
 * correct with no scheduled job and no missed months.
 */

/* ---------------- month-key helpers ("YYYY-MM", local time) ---------------- */

export function monthKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function currentMonthKey(): string {
  return monthKey(new Date());
}

export function addMonths(key: string, n: number): string {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + n, 1));
}

export function compareMonth(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function monthsInRange(fromKey: string, toKey: string): string[] {
  const out: string[] = [];
  let k = fromKey;
  while (compareMonth(k, toKey) <= 0) {
    out.push(k);
    k = addMonths(k, 1);
    if (out.length > 1200) break; // safety
  }
  return out;
}

export function monthLabel(key: string, opts: { short?: boolean } = {}): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
    month: opts.short ? "short" : "long",
    year: "numeric",
  });
}

/* ---------------- contribution rate ---------------- */

export function perPersonForMonth(fund: TravelFund, key: string): number {
  let amount = fund.rates[0]?.perPerson ?? 0;
  for (const rate of fund.rates) {
    if (compareMonth(rate.fromMonth, key) <= 0) amount = rate.perPerson;
  }
  return amount;
}

export function monthlyTotalForMonth(fund: TravelFund, key: string): number {
  return perPersonForMonth(fund, key) * fund.people;
}

export function currentPerPerson(fund: TravelFund): number {
  return perPersonForMonth(fund, currentMonthKey());
}

export function currentMonthlyTotal(fund: TravelFund): number {
  return monthlyTotalForMonth(fund, currentMonthKey());
}

/* ---------------- ledger ---------------- */

export type LedgerKind = "opening" | "monthly" | "deposit" | "withdrawal";

export interface LedgerRow {
  id: string;
  month: string;
  label: string;
  kind: LedgerKind;
  amount: number; // signed
  balanceAfter: number;
  note?: string;
  /** manual rows can be deleted */
  removable: boolean;
}

const KIND_ORDER: Record<LedgerKind, number> = {
  opening: 0,
  deposit: 1,
  monthly: 2,
  withdrawal: 3,
};

export function buildLedger(fund: TravelFund, asOf: string = currentMonthKey()): LedgerRow[] {
  const rows: Omit<LedgerRow, "balanceAfter">[] = [];

  rows.push({
    id: "opening",
    month: fund.anchorMonth,
    label: monthLabel(fund.anchorMonth),
    kind: "opening",
    amount: fund.anchorBalance,
    note: `Where we'd got to — saving together since ${monthLabel(monthKey(new Date(fund.since)), { short: true })}`,
    removable: false,
  });

  for (const m of monthsInRange(addMonths(fund.anchorMonth, 1), asOf)) {
    rows.push({
      id: `auto-${m}`,
      month: m,
      label: monthLabel(m),
      kind: "monthly",
      amount: monthlyTotalForMonth(fund, m),
      note: `${fund.people} × ${inr(perPersonForMonth(fund, m))} — added automatically`,
      removable: false,
    });
  }

  for (const entry of fund.entries) {
    if (compareMonth(entry.month, asOf) > 0) continue; // post-dated, not yet counted
    rows.push({
      id: entry.id,
      month: entry.month,
      label: monthLabel(entry.month),
      kind: entry.kind,
      amount: entry.kind === "withdrawal" ? -Math.abs(entry.amount) : Math.abs(entry.amount),
      note: entry.note,
      removable: true,
    });
  }

  rows.sort(
    (a, b) => compareMonth(a.month, b.month) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind],
  );

  let balance = 0;
  return rows.map((row) => {
    balance += row.amount;
    return { ...row, balanceAfter: balance };
  });
}

export function fundBalance(fund: TravelFund, asOf?: string): number {
  const ledger = buildLedger(fund, asOf);
  return ledger.length ? ledger[ledger.length - 1].balanceAfter : 0;
}

/* ---------------- headline stats ---------------- */

export interface FundStats {
  balance: number;
  perPerson: number;
  people: number;
  monthlyTotal: number;
  totalPaidIn: number;
  totalTakenOut: number;
  monthsSaving: number;
  contributedThisYear: number;
  nextMonth: string;
  nextMonthLabel: string;
  /** Rough projection assuming the current monthly rate holds. */
  projection: (monthsAhead: number) => number;
}

export function fundStats(fund: TravelFund): FundStats {
  const ledger = buildLedger(fund);
  const balance = ledger.length ? ledger[ledger.length - 1].balanceAfter : 0;
  const totalPaidIn = ledger.reduce((s, r) => (r.amount > 0 ? s + r.amount : s), 0);
  const totalTakenOut = ledger.reduce((s, r) => (r.amount < 0 ? s - r.amount : s), 0);

  const now = new Date();
  const since = new Date(fund.since);
  const monthsSaving =
    (now.getFullYear() - since.getFullYear()) * 12 + (now.getMonth() - since.getMonth()) + 1;

  const year = String(now.getFullYear());
  const contributedThisYear = ledger
    .filter((r) => r.month.startsWith(year) && r.amount > 0)
    .reduce((s, r) => s + r.amount, 0);

  const nextMonth = addMonths(currentMonthKey(), 1);
  const monthlyTotal = currentMonthlyTotal(fund);

  return {
    balance,
    perPerson: currentPerPerson(fund),
    people: fund.people,
    monthlyTotal,
    totalPaidIn,
    totalTakenOut,
    monthsSaving: Math.max(monthsSaving, 1),
    contributedThisYear,
    nextMonth,
    nextMonthLabel: monthLabel(nextMonth),
    projection: (monthsAhead: number) => balance + Math.max(0, monthsAhead) * monthlyTotal,
  };
}

/* ---------------- seed ---------------- */

export function defaultFund(): TravelFund {
  // Given: ~₹80,000 saved as of Sept 2026 (this month's ₹5k-each already in),
  // saving together since December 2025.
  return {
    since: "2025-12-01",
    people: 2,
    rates: [{ fromMonth: "2025-12", perPerson: 5000 }],
    anchorMonth: "2026-09",
    anchorBalance: 80000,
    entries: [],
  };
}

/* tiny local INR formatter to avoid a circular import with currency.ts consumers */
function inr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}
