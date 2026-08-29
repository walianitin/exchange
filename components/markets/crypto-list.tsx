"use client";

import { useRouter } from "next/navigation";

import { TokenAvatar } from "@/components/token-avatar";
import { formatUsd, toTradeMarket } from "@/lib/format";
import type { CombinedCryptoData } from "@/app/utils/types";

export function CryptoList({
  items,
}: {
  items: CombinedCryptoData[];
}) {
  const router = useRouter();

  if (items.length === 0) {
    return <p className="px-1 py-6 text-sm text-zinc-500">No coins yet.</p>;
  }

  return (
    <ul>
      {items.map((crypto) => (
        <li key={crypto.id}>
          <button
            type="button"
            onClick={() => router.push(`/trade/${toTradeMarket(crypto.symbol)}`)}
            className="flex w-full items-center justify-between rounded-lg px-1 py-2.5 text-left hover:bg-zinc-900/80"
          >
            <div className="flex items-center gap-3">
              <TokenAvatar src={crypto.image} symbol={crypto.symbol} size={28} />
              <span className="text-sm font-medium text-white uppercase">
                {crypto.symbol}
              </span>
            </div>
            <span className="font-mono text-sm text-zinc-200">
              {formatUsd(crypto.current_price)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
