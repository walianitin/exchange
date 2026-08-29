"use client";

import { useEffect, useState } from "react";

import { getTicker } from "@/app/utils/httpClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useWallet,
  type OrderSide,
  type OrderType,
} from "@/components/wallet-provider";
import { formatQty } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SwapUI({ market }: { market: string }) {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [side, setSide] = useState<OrderSide>("buy");
  const [type, setType] = useState<OrderType>("limit");
  const [lastPrice, setLastPrice] = useState(0);
  const [postOnly, setPostOnly] = useState(false);
  const [ioc, setIoc] = useState(false);
  const { balances, placeOrder } = useWallet();

  const [base, quote] = market.split("_");
  const quoteBal = balances[quote] ?? 0;
  const baseBal = balances[base] ?? 0;

  useEffect(() => {
    getTicker(market)
      .then((ticker) => {
        const live = Number(ticker?.lastPrice ?? 0);
        if (live) {
          setLastPrice(live);
          setPrice(String(live));
        }
      })
      .catch(() => undefined);
  }, [market]);

  const effectivePrice =
    type === "market" ? lastPrice || Number(price) : Number(price);
  const total = (Number(quantity) || 0) * (effectivePrice || 0);
  const canSubmit = Number(quantity) > 0 && effectivePrice > 0;

  function applyPercent(pct: number) {
    if (side === "buy") {
      const spend = quoteBal * (pct / 100);
      const px = effectivePrice || lastPrice;
      if (!px) return;
      setQuantity((spend / px).toFixed(6));
      if (type === "limit" && !price) setPrice(String(px));
    } else {
      setQuantity(((baseBal * pct) / 100).toFixed(6));
    }
  }

  function submit() {
    const px = type === "market" ? lastPrice || Number(price) : Number(price);
    const ok = placeOrder({
      market,
      side,
      type: ioc ? "market" : type,
      price: px,
      quantity: Number(quantity),
    });
    if (ok) setQuantity("");
  }

  return (
    <div className="flex h-full flex-col bg-black p-4">
      <div className="grid grid-cols-2 overflow-hidden rounded-lg bg-zinc-950">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={cn(
            "h-10 text-sm font-medium",
            side === "buy"
              ? "bg-[#0d3d2e] text-emerald-400"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={cn(
            "h-10 text-sm font-medium",
            side === "sell"
              ? "bg-[#3d151c] text-red-400"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          Sell
        </button>
      </div>

      <div className="mt-4 inline-flex w-fit rounded-full bg-zinc-950 p-0.5">
        {(["limit", "market"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setType(item)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              type === item ? "bg-zinc-800 text-white" : "text-zinc-500"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-medium tracking-[0.14em] text-zinc-500">
          AVAILABLE BALANCE
        </p>
        <div className="mt-2 space-y-1.5 font-mono text-[13px]">
          <div className="flex justify-between">
            <span className="text-zinc-500">{quote}</span>
            <span>{formatQty(quoteBal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">{base}</span>
            <span>{formatQty(baseBal)}</span>
          </div>
        </div>
      </div>

      {type === "limit" && (
        <div className="mt-4 grid gap-1.5">
          <Label className="text-xs text-zinc-500">Price</Label>
          <div className="relative">
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-11 border-zinc-800 bg-zinc-950 pr-14 font-mono"
            />
            <span className="absolute top-3 right-3 text-xs text-zinc-500">
              {quote}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 grid gap-1.5">
        <Label className="text-xs text-zinc-500">Quantity</Label>
        <div className="relative">
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="h-11 border-zinc-800 bg-zinc-950 pr-14 font-mono"
          />
          <span className="absolute top-3 right-3 text-xs text-zinc-500">
            {base}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {[25, 50, 75, 100].map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => applyPercent(pct)}
            className="h-8 rounded-md bg-zinc-950 text-[11px] text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            {pct === 100 ? "Max" : `${pct}%`}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-1.5">
        <Label className="text-xs text-zinc-500">Order value</Label>
        <div className="relative">
          <Input
            readOnly
            value={total ? total.toFixed(2) : ""}
            placeholder="0.00"
            className="h-11 border-zinc-800 bg-zinc-950 pr-14 font-mono"
          />
          <span className="absolute top-3 right-3 text-xs text-zinc-500">
            {quote}
          </span>
        </div>
      </div>

      <Button
        disabled={!canSubmit}
        className={cn(
          "mt-5 h-11 rounded-lg text-sm font-medium",
          canSubmit
            ? side === "buy"
              ? "bg-emerald-600 text-white hover:bg-emerald-500"
              : "bg-red-600 text-white hover:bg-red-500"
            : "bg-zinc-900 text-zinc-500 hover:bg-zinc-900"
        )}
        onClick={submit}
      >
        Place {side} order
      </Button>

      <div className="mt-4 flex gap-4">
        <label className="flex items-center gap-2 text-xs text-zinc-500">
          <input
            type="checkbox"
            checked={postOnly}
            onChange={(e) => setPostOnly(e.target.checked)}
            className="size-3.5 rounded border-zinc-700 bg-transparent"
          />
          Post only
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-500">
          <input
            type="checkbox"
            checked={ioc}
            onChange={(e) => setIoc(e.target.checked)}
            className="size-3.5 rounded border-zinc-700 bg-transparent"
          />
          IOC
        </label>
      </div>
    </div>
  );
}
