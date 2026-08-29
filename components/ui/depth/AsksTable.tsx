export const AskTable = ({ asks }: { asks: [string, string][] }) => {
  let currentTotal = 0;
  const relevantAsks = asks.slice(0, 12);
  relevantAsks.reverse();

  const asksWithTotal: [string, string, number][] = [];
  for (let i = relevantAsks.length - 1; i >= 0; i--) {
    const [price, quantity] = relevantAsks[i];
    asksWithTotal.push([price, quantity, (currentTotal += Number(quantity))]);
  }
  const maxTotal = relevantAsks.reduce(
    (acc, [, quantity]) => acc + Number(quantity),
    0
  );
  asksWithTotal.reverse();

  return (
    <div>
      {asksWithTotal.map(([price, quantity, total]) => (
        <Ask
          maxTotal={maxTotal}
          key={price}
          price={price}
          quantity={quantity}
          total={total}
        />
      ))}
    </div>
  );
};

function Ask({
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
        className="absolute inset-y-0 left-0 bg-red-500/15"
        style={{ width: `${Math.min(100, (100 * total) / maxTotal)}%` }}
      />
      <div className="relative grid w-full grid-cols-3 px-2 font-mono text-[11px]">
        <span className="text-red-400">
          {Number(price).toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </span>
        <span className="text-right text-zinc-300">{quantity}</span>
        <span className="text-right text-zinc-500">{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
