import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function QuantityStepper({
  quantity,
  onChange,
  name,
  size = "md",
}: {
  quantity: number;
  onChange: (next: number) => void;
  name: string;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "size-8" : "size-9";
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 p-1">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`Decrease ${name} quantity`}
        className={cn(btn, "flex items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-primary/20")}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold tabular-nums text-foreground" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= 20}
        aria-label={`Increase ${name} quantity`}
        className={cn(btn, "flex items-center justify-center rounded-full bg-gradient-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
