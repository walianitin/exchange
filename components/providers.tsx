"use client";

import type { ReactNode } from "react";
import { WalletProvider } from "@/components/wallet-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <WalletProvider>
        {children}
        <Toaster />
      </WalletProvider>
    </TooltipProvider>
  );
}
