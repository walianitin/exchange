export default function BidsTable({ bids }: { bids: [string, string][] }) {
  let currentTotal = 0;
  const relevantBids = bids.slice(0, 12);
  const bidsWithTotal: [string, string, number][] = relevantBids.map(
    ([price, quantity]) => [price, quantity, (currentTotal += Number(quantity))]
  );
  const maxTotal = relevantBids.reduce(
    (acc, [, quantity]) => acc + Number(quantity),
    0
  );

  return (
    <div>
      {bidsWithTotal.map(([price, quantity, total]) => (
        <Bid
          maxTotal={maxTotal}
          total={total}
          key={price}
          price={price}
          quantity={quantity}
        />
      ))}
    </div>
  );
}

function Bid({
  price,
  quantity,
  total,
  maxTotal,
}: {
  price: string;
  quantity: string;
  total: number;
  maxTotal: number;
}) {
  return (
    <div className="relative flex h-6 items-center overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-emerald-500/15"
        style={{ width: `${Math.min(100, (100 * total) / maxTotal)}%` }}
      />
      <div className="relative grid w-full grid-cols-3 px-2 font-mono text-[11px]">
        <span className="text-emerald-400">
          {Number(price).toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </span>
        <span className="text-right text-zinc-300">{quantity}</span>
        <span className="text-right text-zinc-500">{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
