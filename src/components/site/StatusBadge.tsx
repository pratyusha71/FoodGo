import { LAST_STAGE_INDEX, ORDER_STAGES } from "@/lib/orders";
import { cn } from "@/lib/utils";

export function StatusBadge({ statusIndex }: { statusIndex: number }) {
  const delivered = statusIndex >= LAST_STAGE_INDEX;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        delivered ? "bg-success/15 text-success" : "bg-primary/12 text-brand-ink",
      )}
    >
      <span className={cn("size-1.5 rounded-full", delivered ? "bg-success" : "animate-pulse bg-primary")} />
      {ORDER_STAGES[Math.min(statusIndex, LAST_STAGE_INDEX)]?.label}
    </span>
  );
}
