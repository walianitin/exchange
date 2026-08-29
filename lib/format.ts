export function formatUsd(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatCompact(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatQty(value: number) {
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 1 ? 4 : 6,
  });
}

export function toTradeMarket(symbol: string) {
  return `${symbol.toUpperCase()}_USDC`;
}
