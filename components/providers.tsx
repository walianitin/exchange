"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { WalletProvider } from "@/components/wallet-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TooltipProvider>
        <WalletProvider>
          {children}
          <Toaster />
        </WalletProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
