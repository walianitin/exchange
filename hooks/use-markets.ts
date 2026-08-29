"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { CombineData } from "@/app/utils/combine-data";
import type { CombinedCryptoData } from "@/app/utils/types";

const POPULAR = ["SOL", "ETH", "BTC", "WEN", "DRIFT"];

export function useMarkets() {
  const [data, setData] = useState<CombinedCryptoData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await CombineData();
      if (!res) throw new Error("No market data");
      setData(res);
    } catch {
      setError("Could not load markets. Try again.");
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const coins = useMemo(
    () =>
      (data ?? [])
        .filter((item) => !item.symbol.toLowerCase().includes("usdc"))
        .sort((a, b) => b.market_cap - a.market_cap),
    [data]
  );

  const newest = useMemo(
    () =>
      [...coins]
        .sort(
          (a, b) =>
            new Date(b.last_updated).getTime() -
            new Date(a.last_updated).getTime()
        )
        .slice(0, 5),
    [coins]
  );

  const gainers = useMemo(
    () =>
      [...coins]
        .filter((coin) => Number.isFinite(coin.price_change_percentage_24h))
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        )
        .slice(0, 5),
    [coins]
  );

  const popular = useMemo(
    () =>
      coins
        .filter((coin) => POPULAR.includes(coin.symbol.toUpperCase()))
        .sort(
          (a, b) =>
            POPULAR.indexOf(a.symbol.toUpperCase()) -
            POPULAR.indexOf(b.symbol.toUpperCase())
        ),
    [coins]
  );

  const featured =
    coins.find((c) => c.symbol.toUpperCase() === "SOL") ?? coins[0] ?? null;

  const btc = coins.find((c) => c.symbol.toUpperCase() === "BTC");
  const volume24h = coins.reduce((sum, c) => sum + (c.total_volume || 0), 0);
  const marketCap = coins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
  const avgChange =
    coins.length > 0
      ? coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) /
        coins.length
      : 0;

  const stats = {
    volume24h,
    marketCap,
    active: coins.length,
    btcDominance: btc && marketCap ? (btc.market_cap / marketCap) * 100 : 0,
    volumeChange: avgChange,
    marketCapChange: btc?.price_change_percentage_24h ?? avgChange,
    btcChange: btc?.price_change_percentage_24h ?? 0,
  };

  return {
    coins,
    newest,
    gainers,
    popular,
    featured,
    stats,
    loading: !data && !error,
    error,
    reload: load,
  };
}
