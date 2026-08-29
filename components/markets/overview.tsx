"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  Flame,
  Sparkles,
  Star,
} from "lucide-react";

import { CryptoList } from "@/components/markets/crypto-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact, formatPercent, formatUsd, toTradeMarket } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMarkets } from "@/hooks/use-markets";

type MarketsData = ReturnType<typeof useMarkets>;

export function MarketsOverview({ showLists = true }: { showLists?: boolean }) {
  const data = useMarkets();
  return <MarketsOverviewView {...data} showLists={showLists} />;
}

export function MarketsOverviewView({
  featured,
  newest,
  gainers,
  popular,
  stats,
  loading,
  error,
  reload,
  showLists = true,
}: MarketsData & { showLists?: boolean }) {
  const router = useRouter();

  if (error && !featured && !loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-zinc-500">{error}</p>
        <Button variant="outline" onClick={reload}>
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((k) => (
            <Skeleton key={k} className="h-[88px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const featuredUp = (featured?.price_change_percentage_24h ?? 0) >= 0;
  const featuredMarket = featured
    ? toTradeMarket(featured.symbol)
    : "/trade/SOL_USDC";

  return (
    <div className="space-y-4">
      <Card className="gap-0 border-zinc-800 bg-[#111] py-0 shadow-none">
        <CardContent className="flex flex-col justify-between gap-8 p-8 lg:min-h-[240px] lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              LIVE MARKETS
            </div>
            <h1 className="text-[40px] leading-[1.05] font-light tracking-tight text-white sm:text-[52px]">
              Trade crypto,
              <br />
              without limits.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400">
              Deep order books, live candles, and paper execution — built for
              people who actually trade.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                className="h-10 rounded-lg px-5 text-sm"
                onClick={() => router.push(featuredMarket)}
              >
                Start trading
                <ArrowUpRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-lg border-zinc-700 bg-transparent px-5 text-sm text-white hover:bg-zinc-900"
                asChild
              >
                <Link href="/market">View markets</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="24H VOLUME"
          value={`$${formatCompact(stats.volume24h)}`}
          change={stats.volumeChange}
        />
        <StatCard
          label="MARKET CAP"
          value={`$${formatCompact(stats.marketCap)}`}
          change={stats.marketCapChange}
        />
        <StatCard
          label="ACTIVE MARKETS"
          value={String(stats.active)}
          hint="Live"
          hintPositive
        />
        <StatCard
          label="BTC DOMINANCE"
          value={`${stats.btcDominance.toFixed(1)}%`}
          change={stats.btcChange}
        />
      </div>

      {featured && (
        <Card className="gap-0 border-zinc-800 bg-[#111] py-0 shadow-none">
          <button
            type="button"
            onClick={() => router.push(featuredMarket)}
            className="flex w-full flex-col items-start gap-4 px-6 py-5 text-left sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex size-11 items-center justify-center rounded-full bg-zinc-900">
                <BarChart3 className="size-5 text-zinc-300" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold tracking-tight">
                    {featured.symbol.toUpperCase()} / USDC
                  </span>
                  <Badge className="h-5 border-0 bg-emerald-500/15 px-1.5 text-[10px] font-medium text-emerald-400">
                    LIVE
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {formatUsd(featured.current_price)} · Vol $
                  {formatCompact(featured.total_volume)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:ml-auto">
              <span
                className={cn(
                  "text-2xl font-semibold tracking-tight",
                  featuredUp ? "text-emerald-400" : "text-red-400"
                )}
              >
                {formatPercent(featured.price_change_percentage_24h)}
              </span>
              <span className="inline-flex h-8 items-center rounded-md bg-white px-3 text-[13px] font-medium text-black">
                Trade
                <ArrowUpRight className="ml-1 size-3.5" />
              </span>
            </div>
          </button>
        </Card>
      )}

      {showLists && (
        <div className="grid gap-4 md:grid-cols-3">
          <ListCard
            icon={Sparkles}
            title="New listings"
            href="/market"
            items={newest}
          />
          <ListCard
            icon={Flame}
            title="Top gainers"
            href="/market"
            items={gainers}
          />
          <ListCard
            icon={Star}
            title="Popular"
            href="/market"
            items={popular}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  hint,
  hintPositive,
}: {
  label: string;
  value: string;
  change?: number;
  hint?: string;
  hintPositive?: boolean;
}) {
  return (
    <Card className="gap-0 border-zinc-800 bg-[#111] py-0 shadow-none">
      <CardContent className="px-4 py-3.5">
        <p className="text-[10px] font-normal tracking-[0.18em] text-zinc-500 uppercase">
          {label}
        </p>
        <p className="mt-2 text-[32px] leading-none font-light tracking-tight text-white tabular-nums">
          {value}
        </p>
        {typeof change === "number" && (
          <p
            className={cn(
              "mt-1.5 text-[11px] font-light",
              change >= 0 ? "text-emerald-400" : "text-red-400"
            )}
          >
            {formatPercent(change)}
          </p>
        )}
        {hint && (
          <p
            className={cn(
              "mt-1.5 text-[11px] font-light",
              hintPositive ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ListCard({
  icon: Icon,
  title,
  href,
  items,
}: {
  icon: typeof Sparkles;
  title: string;
  href: string;
  items: ReturnType<typeof useMarkets>["newest"];
}) {
  return (
    <Card className="gap-0 border-zinc-800 bg-[#111] py-0 shadow-none">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Icon className="size-3.5 text-zinc-400" />
            {title}
          </div>
          <Link
            href={href}
            className="text-[11px] font-medium tracking-wide text-zinc-500 hover:text-white"
          >
            ALL →
          </Link>
        </div>
        <CryptoList items={items} />
      </CardContent>
    </Card>
  );
}

