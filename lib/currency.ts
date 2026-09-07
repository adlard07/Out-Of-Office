/**
 * Currency + formatting helpers.
 * The active currency is configurable in one place so a settings screen or
 * a real localisation layer can swap it later without touching components.
 */

export interface CurrencyConfig {
  code: string;
  locale: string;
  symbol: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: { code: "INR", locale: "en-IN", symbol: "₹" },
  USD: { code: "USD", locale: "en-US", symbol: "$" },
  EUR: { code: "EUR", locale: "en-IE", symbol: "€" },
};

export const ACTIVE_CURRENCY: CurrencyConfig = CURRENCIES.INR;

export function formatMoney(
  amount: number,
  opts: { compact?: boolean; currency?: CurrencyConfig } = {},
): string {
  const currency = opts.currency ?? ACTIVE_CURRENCY;
  if (opts.compact) return compactMoney(amount, currency);
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Hand-rolled compact formatting. `Intl` compact notation ("1.7L", "95K") depends
 * on the runtime's ICU version, so Node and the browser can disagree and trigger
 * a hydration mismatch. This produces identical output everywhere.
 */
function compactMoney(amount: number, currency: CurrencyConfig): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);

  const units =
    currency.locale === "en-IN"
      ? ([
          [1e7, "Cr"],
          [1e5, "L"],
          [1e3, "K"],
        ] as const)
      : ([
          [1e9, "B"],
          [1e6, "M"],
          [1e3, "K"],
        ] as const);

  for (const [size, suffix] of units) {
    if (abs >= size) {
      const value = Math.round((abs / size) * 10) / 10;
      const str = value % 1 === 0 ? String(value) : value.toFixed(1);
      return `${sign}${currency.symbol}${str}${suffix}`;
    }
  }
  return `${sign}${currency.symbol}${Math.round(abs).toLocaleString(currency.locale)}`;
}

/** Plain grouped number without the currency symbol. */
export function formatNumber(amount: number, currency = ACTIVE_CURRENCY): string {
  return new Intl.NumberFormat(currency.locale, {
    maximumFractionDigits: 0,
  }).format(amount);
}
