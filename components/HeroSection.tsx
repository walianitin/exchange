"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  CandlestickChart,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-20 pb-12 text-center">
      <Badge variant="secondary" className="mb-6 gap-1.5">
        <Zap className="size-3.5" />
        Live spot markets
      </Badge>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        An exchange you&apos;ll actually want to use
      </h1>
      <p className="text-muted-foreground mt-5 max-w-2xl text-base sm:text-lg">
        Store, buy, and sell crypto with a live order book, candlestick charts,
        and paper trading — all in a black and grey workspace.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" onClick={() => router.push("/market")}>
          <CandlestickChart className="size-4" />
          Start trading
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/trade/SOL_USDC">
            <ArrowLeftRight className="size-4" />
            Open SOL / USDC
          </Link>
        </Button>
      </div>
      <div className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
        <ShieldCheck className="size-4" />
        Paper wallet in this browser — deposit to fund a trade
      </div>
    </section>
  );
}
