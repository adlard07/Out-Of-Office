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
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: opts.compact ? 1 : 0,
    notation: opts.compact ? "compact" : "standard",
  }).format(amount);
}

/** Plain grouped number without the currency symbol. */
export function formatNumber(amount: number, currency = ACTIVE_CURRENCY): string {
  return new Intl.NumberFormat(currency.locale, {
    maximumFractionDigits: 0,
  }).format(amount);
}
