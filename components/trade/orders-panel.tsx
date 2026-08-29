"use client";

import { Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/components/wallet-provider";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OrdersPanel({ market }: { market: string }) {
  const { orders, cancelOrder } = useWallet();
  const mine = orders.filter((order) => order.market === market);
  const open = mine.filter((order) => order.status === "open");
  const history = mine.filter((order) => order.status !== "open");

  return (
    <div className="border-t border-zinc-800 bg-black">
      <Tabs defaultValue="open" className="px-4 py-3">
        <TabsList>
          <TabsTrigger value="open">Open orders ({open.length})</TabsTrigger>
          <TabsTrigger value="history">History ({history.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <OrderTable
            rows={open}
            empty="No open orders. Place a limit order from the ticket."
            onCancel={cancelOrder}
          />
        </TabsContent>
        <TabsContent value="history">
          <OrderTable
            rows={history}
            empty="Filled and cancelled orders show up here."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderTable({
  rows,
  empty,
  onCancel,
}: {
  rows: ReturnType<typeof useWallet>["orders"];
  empty: string;
  onCancel?: (id: string) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
        <Inbox className="size-4" />
        {empty}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Side</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Status</TableHead>
          {onCancel && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((order) => (
          <TableRow key={order.id}>
            <TableCell
              className={cn(
                "font-medium uppercase",
                order.side === "buy" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {order.side}
            </TableCell>
            <TableCell className="capitalize">{order.type}</TableCell>
            <TableCell className="text-right">{formatUsd(order.price, 4)}</TableCell>
            <TableCell className="text-right">{order.quantity}</TableCell>
            <TableCell className="text-right">{formatUsd(order.total)}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {order.status}
              </Badge>
            </TableCell>
            {onCancel && (
              <TableCell className="text-right">
                {order.status === "open" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCancel(order.id)}
                  >
                    Cancel
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
