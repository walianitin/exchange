"use client";

import { useParams } from "next/navigation";

import { Depth } from "@/components/ui/depth/Depth";
import { TradeView } from "@/components/ui/Tradeview";
import { SwapUI } from "@/components/ui/SwapUi";
import { MarketBar } from "@/components/ui/MarketBar";
import { OrdersPanel } from "@/components/trade/orders-panel";

export default function TradePage() {
  const { market } = useParams();
  const symbol = String(market ?? "SOL_USDC");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-black lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <MarketBar market={symbol} />
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_260px]">
          <TradeView market={symbol} />
          <Depth market={symbol} />
        </div>
        <OrdersPanel market={symbol} />
      </div>
      <aside className="w-full border-t border-zinc-800 lg:w-[300px] lg:border-t-0 lg:border-l">
        <SwapUI market={symbol} />
      </aside>
    </div>
  );
}
