"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { getDepth, getTicker } from "@/app/utils/httpClient";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { AskTable } from "./AsksTable";
import Bidstable from "./Bidstable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/components/wallet-provider";
import { formatUsd } from "@/lib/format";

interface DepthData {
  bids: [string, string][];
  asks: [string, string][];
}

export function Depth({ market }: { market: string }) {
  const [asks, setAsks] = useState<[string, string][]>();
  const [bids, setBids] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();
  const { orders } = useWallet();
  const fills = orders.filter(
    (o) => o.market === market && o.status === "filled"
  );

  useEffect(() => {
    const id = `DEPTH-${market}`;
    const stream = `depth.${market}`;

    SignalingManager.getInstance().registerCallback(
      "depth",
      (data: unknown) => {
        const depthData = data as DepthData;
        setBids((originalBids) => {
          const next = [...(originalBids || [])];
          for (let i = 0; i < next.length; i++) {
            for (let j = 0; j < (depthData.bids?.length ?? 0); j++) {
              if (next[i][0] === depthData.bids[j][0]) {
                next[i][1] = depthData.bids[j][1];
                break;
              }
            }
          }
          return next;
        });
        setAsks((originalAsks) => {
          const next = [...(originalAsks || [])];
          for (let i = 0; i < next.length; i++) {
            for (let j = 0; j < (depthData.asks?.length ?? 0); j++) {
              if (next[i][0] === depthData.asks[j][0]) {
                next[i][1] = depthData.asks[j][1];
                break;
              }
            }
          }
          return next;
        });
      },
      id
    );
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [stream],
    });

    getDepth(market)
      .then((d) => {
        setBids(d.bids?.reverse?.() ?? d.bids);
        setAsks(d.asks);
      })
      .catch(() => undefined);

    getTicker(market)
      .then((t) => setPrice(t?.lastPrice))
      .catch(() => undefined);

    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [stream],
      });
      SignalingManager.getInstance().deRegisterCallback("depth", id);
    };
  }, [market]);

  return (
    <div className="flex h-full min-h-[420px] flex-col border-l border-zinc-800 bg-black">
      <Tabs defaultValue="book" className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList className="h-10 w-full justify-start rounded-none border-b border-zinc-800 bg-transparent p-0">
          <TabsTrigger
            value="book"
            className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Order Book
          </TabsTrigger>
          <TabsTrigger
            value="trades"
            className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Trades
          </TabsTrigger>
        </TabsList>
        <TabsContent value="book" className="mt-0 min-h-0 flex-1">
          <div className="grid grid-cols-3 px-3 py-2 text-[10px] font-medium tracking-[0.12em] text-zinc-500">
            <span>PRICE</span>
            <span className="text-right">SIZE</span>
            <span className="text-right">TOTAL</span>
          </div>
          <ScrollArea className="h-[460px]">
            <div className="px-1">{asks && <AskTable asks={asks} />}</div>
            {price && (
              <div className="flex items-center gap-1.5 px-3 py-2 font-mono text-[15px] font-semibold text-emerald-400">
                {Number(price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <ArrowUp className="size-3.5" />
              </div>
            )}
            <div className="px-1">{bids && <Bidstable bids={bids} />}</div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="trades" className="mt-0 px-3 py-3">
          {fills.length === 0 ? (
            <p className="py-8 text-center text-xs text-zinc-500">
              Your fills will show here.
            </p>
          ) : (
            <div className="space-y-2">
              {fills.slice(0, 20).map((fill) => (
                <div
                  key={fill.id}
                  className="flex justify-between font-mono text-xs"
                >
                  <span
                    className={
                      fill.side === "buy" ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {formatUsd(fill.price, 2)}
                  </span>
                  <span className="text-zinc-400">{fill.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
