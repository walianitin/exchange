"use client";

import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

import { TokenAvatar } from "@/components/token-avatar";
import { Sparkline } from "@/components/markets/sparkline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet-provider";
import {
  formatCompact,
  formatPercent,
  formatUsd,
  toTradeMarket,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CombinedCryptoData } from "@/app/utils/types";

export function CryptoTable({ data }: { data: CombinedCryptoData[] }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useWallet();

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-800 hover:bg-transparent">
          <TableHead className="w-10" />
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Market cap</TableHead>
          <TableHead className="text-right">24h volume</TableHead>
          <TableHead className="text-right">24h</TableHead>
          <TableHead className="text-right">7d</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => {
          const change = item.price_change_percentage_24h ?? 0;
          const up = change >= 0;
          const starred = isFavorite(item.symbol);
          return (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() => router.push(`/trade/${toTradeMarket(item.symbol)}`)}
            >
              <TableCell className="w-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(item.symbol);
                  }}
                >
                  <Star
                    className={cn(
                      "size-4",
                      starred && "fill-amber-400 text-amber-400"
                    )}
                  />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <TokenAvatar src={item.image} symbol={item.symbol} size={36} />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground text-xs uppercase">
                      {item.symbol}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatUsd(item.current_price)}
              </TableCell>
              <TableCell className="text-right">
                ${formatCompact(item.market_cap)}
              </TableCell>
              <TableCell className="text-right">
                ${formatCompact(item.total_volume)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium",
                  up ? "text-emerald-400" : "text-red-400"
                )}
              >
                <span className="inline-flex items-center justify-end gap-1">
                  {up ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  {formatPercent(change)}
                </span>
              </TableCell>
              <TableCell className="flex justify-end">
                <Sparkline
                  data={item.KlineData ?? []}
                  color={up ? "#34d399" : "#f87171"}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
