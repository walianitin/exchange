import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowLeftRight,
  BookOpen,
  LineChart,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: LineChart,
    title: "Live charts",
    body: "Hourly candles from the market feed, sized for a trading terminal.",
  },
  {
    icon: BookOpen,
    title: "Order book",
    body: "Bids and asks stream in over websocket with depth totals.",
  },
  {
    icon: ArrowLeftRight,
    title: "Spot ticket",
    body: "Limit or market, buy or sell — orders show up in the blotter below.",
  },
  {
    icon: Wallet,
    title: "Paper wallet",
    body: "Deposit USDC, star favorites, and keep balances in local storage.",
  },
];

export default function Advertisment() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden py-0">
          <div className="grid items-center gap-6 p-6 sm:grid-cols-[220px_1fr] sm:p-8">
            <div className="bg-muted relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl">
              <Image
                src="/advertise.png"
                alt="Buy and sell crypto"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                <Activity className="size-4" />
                Spot desk
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Turn paper USDC into a real trading flow
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Markets list every coin. Trade opens the chart, book, and
                ticket. Favorites and orders persist in this browser.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/market">Browse markets</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/trade/SOL_USDC">Trade SOL</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What&apos;s wired</CardTitle>
            <CardDescription>
              The three screens share one nav, one wallet, and one theme.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-3">
                <div className="bg-secondary text-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
                  <feature.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-muted-foreground text-sm">{feature.body}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
