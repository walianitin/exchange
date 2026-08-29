"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CandlestickChart } from "lucide-react";

import { ChartManager } from "@/app/utils/ChartManager";
import { getKlines } from "@/app/utils/httpClient";
import { KLine } from "@/app/utils/types";
import { Skeleton } from "@/components/ui/skeleton";

export function TradeView({ market }: { market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  const init = useCallback(async () => {
    setStatus("loading");
    let klineData: KLine[] = [];
    try {
      const interval = "1h";
      const startTime = String(
        Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000)
      );
      const endTime = String(Math.floor(new Date().getTime() / 1000));
      klineData = await getKlines({ market, interval, startTime, endTime });
    } catch {
      setStatus("empty");
      return;
    }

    if (!chartRef.current) return;
    chartManagerRef.current?.destroy();

    if (!klineData?.length) {
      setStatus("empty");
      return;
    }

    chartManagerRef.current = new ChartManager(
      chartRef.current,
      klineData
        .map((x) => ({
          close: parseFloat(x.close),
          high: parseFloat(x.high),
          low: parseFloat(x.low),
          open: parseFloat(x.open),
          timestamp: new Date(x.end).getTime(),
        }))
        .sort((x, y) => x.timestamp - y.timestamp),
      {
        background: "#000000",
        color: "#71717a",
      }
    );
    setStatus("ready");
  }, [market]);

  useEffect(() => {
    init();
    return () => {
      chartManagerRef.current?.destroy();
      chartManagerRef.current = null;
    };
  }, [init]);

  return (
    <div className="relative min-h-[420px] flex-1 p-2">
      {status === "loading" && (
        <Skeleton className="absolute inset-2 rounded-lg" />
      )}
      {status === "empty" && (
        <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm">
          <CandlestickChart className="size-8" />
          No candles for this market.
        </div>
      )}
      <div
        ref={chartRef}
      className="h-[460px] w-full lg:h-[520px]"
      />
    </div>
  );
}
