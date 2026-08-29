"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function TokenAvatar({
  src,
  symbol,
  size = 32,
  className,
}: {
  src?: string | null;
  symbol: string;
  size?: number;
  className?: string;
}) {
  const initials = symbol.slice(0, 2).toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={symbol}
        width={size}
        height={size}
        className={cn("rounded-full bg-muted object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground flex items-center justify-center rounded-full text-[10px] font-semibold",
        className
      )}
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}
