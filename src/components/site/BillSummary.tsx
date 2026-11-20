import { formatINR } from "@/lib/pricing";

export function BillSummary({ subtotal, delivery, total }: { subtotal: number; delivery: number; total: number }) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="font-semibold text-foreground">{formatINR(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Delivery charge</dt>
        <dd className={delivery === 0 ? "font-semibold text-success" : "font-semibold text-foreground"}>
          {delivery === 0 ? "FREE" : formatINR(delivery)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-dashed border-border pt-3">
        <dt className="text-base font-bold text-foreground">Grand total</dt>
        <dd className="text-2xl font-extrabold text-foreground">{formatINR(total)}</dd>
      </div>
    </dl>
  );
}
