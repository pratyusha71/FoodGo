import { getFoodById } from "@/lib/menu";
import type { OrderItem } from "@/lib/orders";
import { formatINR } from "@/lib/pricing";

export function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((line) => {
        const image = getFoodById(line.id)?.image;
        return (
          <li key={line.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            {image ? (
              <img src={image} alt="" className="size-12 rounded-xl object-cover" />
            ) : (
              <span className="size-12 rounded-xl bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{line.name}</p>
              <p className="text-xs text-muted-foreground">{line.quantity} × {formatINR(line.price)}</p>
            </div>
            <span className="text-sm font-bold text-foreground">{formatINR(line.price * line.quantity)}</span>
          </li>
        );
      })}
    </ul>
  );
}
