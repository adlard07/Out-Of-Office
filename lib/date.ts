export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = new Date(iso);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const startStr = start.toLocaleDateString("en-IN", opts);
  const endStr = end.toLocaleDateString("en-IN", { ...opts, year: "numeric" });
  return sameMonth
    ? `${start.getDate()}–${endStr}`
    : `${startStr} – ${endStr}`;
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function monthName(index: number): string {
  return new Date(2025, index, 1).toLocaleDateString("en-IN", { month: "long" });
}

export const MONTHS = Array.from({ length: 12 }, (_, i) => monthName(i));

/** "April"…"September" -> "Apr-Sep". Tolerates an empty list. */
export function monthRange(months: string[]): string {
  if (months.length === 0) return "Any time";
  const first = months[0].slice(0, 3);
  const last = months[months.length - 1].slice(0, 3);
  return first === last ? first : `${first}–${last}`;
}
