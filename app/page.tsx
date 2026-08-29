"use client";

import { MarketsOverview } from "@/components/markets/overview";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:max-w-[1400px]">
      <MarketsOverview />
    </div>
  );
}
