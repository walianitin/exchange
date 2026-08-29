"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { CryptoTable } from "@/components/markets/crypto-table";
import { MarketsOverviewView } from "@/components/markets/overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/components/wallet-provider";
import { useMarkets } from "@/hooks/use-markets";

export default function MarketsPage() {
  const markets = useMarkets();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("spot");
  const { isFavorite } = useWallet();

  const tableRows = useMemo(() => {
    const searched = markets.coins.filter((item) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q)
      );
    });
    if (tab === "favorites") {
      return searched.filter((item) => isFavorite(item.symbol));
    }
    return searched;
  }, [markets.coins, query, tab, isFavorite]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 lg:max-w-[1400px]">
      <MarketsOverviewView {...markets} showLists />

      {markets.error && !markets.coins.length ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm text-zinc-500">{markets.error}</p>
          <Button variant="outline" onClick={markets.reload}>
            Retry
          </Button>
        </div>
      ) : markets.loading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <Card className="gap-0 border-zinc-800 bg-[#111] py-0 shadow-none">
          <CardContent className="p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="bg-zinc-950">
                  <TabsTrigger value="spot">Spot</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute top-2.5 left-2.5 size-4 text-zinc-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or symbol"
                  className="border-zinc-800 bg-zinc-950 pl-8"
                />
              </div>
            </div>
            {tableRows.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">
                {tab === "favorites"
                  ? "Star a market to pin it here."
                  : "No markets match that search."}
              </p>
            ) : (
              <CryptoTable data={tableRows} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
