"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

import type { Ticker } from "@/app/utils/types";
import { getAllInfo, getTicker } from "@/app/utils/httpClient";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { TokenAvatar } from "@/components/token-avatar";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CoinData {
  symbol: string;
  image: string;
}

export function MarketBar({ market }: { market: string }) {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [tokenImage, setTokenImage] = useState<string | null>(null);
  const [base, quote] = market.split("_");

  useEffect(() => {
    async function fetchImage() {
      try {
        const data: CoinData[] = await getAllInfo();
        setTokenImage(
          data.find((d) => d.symbol.toLowerCase() === base.toLowerCase())
            ?.image ?? null
        );
      } catch {
        setTokenImage(null);
      }
    }
    fetchImage();
  }, [base]);

  useEffect(() => {
    getTicker(market).then(setTicker).catch(() => setTicker(null));
    const id = `ticker-${market}`;
    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: unknown) => {
        const tickerData = data as Ticker;
        setTicker((prevTicker) => ({
          firstPrice: tickerData?.firstPrice ?? prevTicker?.firstPrice ?? "",
          high: tickerData?.high ?? prevTicker?.high ?? "",
          lastPrice: tickerData?.lastPrice ?? prevTicker?.lastPrice ?? "",
          low: tickerData?.low ?? prevTicker?.low ?? "",
          priceChange: tickerData?.priceChange ?? prevTicker?.priceChange ?? "",
          priceChangePercent:
            tickerData?.priceChangePercent ??
            prevTicker?.priceChangePercent ??
            "",
          quoteVolume:
            tickerData?.quoteVolume ?? prevTicker?.quoteVolume ?? "",
          symbol: tickerData?.symbol ?? prevTicker?.symbol ?? "",
          trades: tickerData?.trades ?? prevTicker?.trades ?? "",
          volume: tickerData?.volume ?? prevTicker?.volume ?? "",
        }));
      },
      id
    );
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker.${market}`],
    });
    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${market}`],
      });
      SignalingManager.getInstance().deRegisterCallback("ticker", id);
    };
  }, [market]);

  const change = Number(ticker?.priceChangePercent ?? 0);
  const up = change >= 0;
  const last = ticker?.lastPrice
    ? Number(ticker.lastPrice).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";

  return (
    <div className="flex h-[64px] items-center gap-8 overflow-x-auto border-b border-zinc-800 bg-black px-4">
      <Link
        href="/market"
        className="flex shrink-0 items-center gap-3 hover:opacity-80"
      >
        <TokenAvatar src={tokenImage} symbol={base} size={28} />
        <div className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight">
          {base} / {quote}
          <ChevronDown className="size-3.5 text-zinc-500" />
        </div>
      </Link>

      <div className="shrink-0">
        <p
          className={cn(
            "font-mono text-lg leading-none font-semibold",
            up ? "text-emerald-400" : "text-red-400"
          )}
        >
          {last}
        </p>
      </div>

      <Stat
        label="24H CHANGE"
        value={
          ticker
            ? `${Number(ticker.priceChange) > 0 ? "+" : ""}${Number(ticker.priceChange).toLocaleString()} (${formatPercent(change)})`
            : "—"
        }
        className={up ? "text-emerald-400" : "text-red-400"}
      />
      <Stat label="24H HIGH" value={fmt(ticker?.high)} />
      <Stat label="24H LOW" value={fmt(ticker?.low)} />
      <Stat label="24H VOLUME" value={fmt(ticker?.volume)} />
    </div>
  );
}

function fmt(value?: string) {
  if (!value) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="shrink-0">
      <p className="text-[10px] font-medium tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className={cn("mt-0.5 font-mono text-[13px] text-zinc-200", className)}>
        {value}
      </p>
    </div>
  );
}
