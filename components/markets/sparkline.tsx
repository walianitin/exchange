"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ColorType,
  createChart,
  LineSeries,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { LineCryptoDataPoint } from "@/app/utils/types";

export function Sparkline({
  data,
  color,
}: {
  data: LineCryptoDataPoint[];
  color: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const formatted = useMemo(
    () =>
      data
        .map((point) => ({
          time: (new Date(point.end).getTime() / 1000) as UTCTimestamp,
          value: parseFloat(point.close),
        }))
        .filter((point) => Number.isFinite(point.value)),
    [data]
  );

  useEffect(() => {
    if (!containerRef.current || formatted.length < 2) return;

    const chart = createChart(containerRef.current, {
      height: 36,
      width: containerRef.current.clientWidth || 112,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent",
      },
      rightPriceScale: { visible: false },
      timeScale: { visible: false, borderVisible: false },
      grid: {
        horzLines: { visible: false },
        vertLines: { visible: false },
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(LineSeries, {
      color,
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    series.setData(formatted);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [formatted, color]);

  if (formatted.length < 2) {
    return <div className="bg-muted/40 h-9 w-28 rounded-sm" />;
  }

  return <div ref={containerRef} className="h-9 w-28" />;
}
