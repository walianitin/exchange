"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { useWallet } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const links = [
  { href: "/market", label: "Markets" },
  { href: "/trade/SOL_USDC", label: "Trade" },
];

export default function Appbar() {
  const pathname = usePathname();
  const { balances, deposit, withdraw } = useWallet();
  const [mode, setMode] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("1000");
  const [open, setOpen] = useState(false);
  const usdc = balances.USDC ?? 0;

  function submitFunds() {
    const value = Number(amount);
    const ok = mode === "deposit" ? deposit(value) : withdraw(value);
    if (ok) {
      setMode(null);
      setAmount("1000");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 lg:max-w-[1400px]">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-1 md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-black">
            <SheetHeader>
              <SheetTitle>Exchange</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm"
              >
                Home
              </Link>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-zinc-400",
                    isActive(pathname, link.href) && "text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-white text-xs font-semibold text-black">
            Ex
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Exchange
          </span>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-medium text-zinc-500 transition-colors hover:text-white",
                isActive(pathname, link.href) && "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 px-3.5 text-[13px]" onClick={() => setMode("deposit")}>
            Deposit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-zinc-700 bg-transparent px-3.5 text-[13px] text-white hover:bg-zinc-900"
            onClick={() => setMode("withdraw")}
          >
            Withdraw
          </Button>
        </div>
      </div>

      <Dialog open={mode !== null} onOpenChange={(next) => !next && setMode(null)}>
        <DialogContent className="bg-zinc-950 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === "deposit" ? "Deposit USDC" : "Withdraw USDC"}
            </DialogTitle>
            <DialogDescription>
              Paper wallet in this browser. Available {formatUsd(usdc)}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="fund-amount" className="text-zinc-400">
              Amount
            </Label>
            <Input
              id="fund-amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button onClick={submitFunds}>
              {mode === "deposit" ? "Deposit" : "Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function isActive(pathname: string, href: string) {
  if (href.startsWith("/trade")) return pathname.startsWith("/trade");
  return pathname === href || pathname.startsWith(`${href}/`);
}
