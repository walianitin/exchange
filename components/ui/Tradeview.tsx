import { useEffect, useRef } from "react";
import { ChartManager } from "../../app/utils/ChartManager";
import { getKlines } from "../../app/utils/httpClient";
import { KLine } from "../../app/utils/types";



export function TradeView({ market}:{ market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);





  const init = async () => {
    let klineData: KLine[] = [];
    try {
      const interval="1h";
      const startTime=String(Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000));
      const endTime=String(Math.floor(new Date().getTime() / 1000));
      klineData = await getKlines({market,interval,startTime , endTime }); 

    } catch (e) { return e}

    if (chartRef) {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
      }
      const chartManager = new ChartManager(
        chartRef.current,
        [
          ...klineData?.map((x) => ({
            close: parseFloat(x.close),
            high: parseFloat(x.high),
            low: parseFloat(x.low),
            open: parseFloat(x.open),
            timestamp: new Date(x.end), 
          })),
        ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
        {
          background: "#0e0f14",
          color: "white",
        }
      );
      //@ts-ignore
      chartManagerRef.current = chartManager;
    }
  };

  useEffect(() => {
      init();
  }, [market, chartRef]);

  return (
    <>
      <div ref={chartRef} style={{ height: "520px", width: "98%", marginTop: 4 }}></div>
    </>
  );
}