import { Bike, Check, ChefHat, ClipboardCheck, PackageCheck, ReceiptText } from "lucide-react";

import { formatTime, ORDER_STAGES } from "@/lib/orders";
import { cn } from "@/lib/utils";

const ICONS = [ReceiptText, ClipboardCheck, ChefHat, Bike, PackageCheck];

export function OrderTracker({ statusIndex, statusTimes }: { statusIndex: number; statusTimes: (string | null)[] }) {
  const progress = (statusIndex / (ORDER_STAGES.length - 1)) * 100;

  return (
    <div>
      {/* Desktop: horizontal */}
      <div className="relative hidden md:block">
        <div className="absolute left-[10%] right-[10%] top-7 h-1.5 rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-primary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <ol className="relative grid grid-cols-5">
          {ORDER_STAGES.map((stage, i) => {
            const Icon = ICONS[i] ?? ReceiptText;
            const done = i < statusIndex || (i === statusIndex && i === ORDER_STAGES.length - 1);
            const current = i === statusIndex && !done;
            const time = statusTimes[i];
            return (
              <li key={stage.key} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    "relative z-10 flex size-14 items-center justify-center rounded-full border-2 transition-all duration-500",
                    done && "border-primary bg-gradient-primary text-primary-foreground",
                    current && "animate-pulse-ring border-primary bg-card text-brand-ink",
                    !done && !current && "border-border bg-card text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-6" /> : <Icon className="size-6" />}
                </span>
                <span className={cn("mt-3 text-sm font-bold", i <= statusIndex ? "text-foreground" : "text-muted-foreground")}>
                  {stage.label}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">{time ? formatTime(time) : "Pending"}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical */}
      <ol className="space-y-0 md:hidden">
        {ORDER_STAGES.map((stage, i) => {
          const Icon = ICONS[i] ?? ReceiptText;
          const done = i < statusIndex || (i === statusIndex && i === ORDER_STAGES.length - 1);
          const current = i === statusIndex && !done;
          const time = statusTimes[i];
          const last = i === ORDER_STAGES.length - 1;
          return (
            <li key={stage.key} className="relative flex gap-4 pb-6 last:pb-0">
              {!last && (
                <span className={cn("absolute left-6 top-12 h-[calc(100%-3rem)] w-1 -translate-x-1/2 rounded-full", i < statusIndex ? "bg-primary" : "bg-muted")} />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",
                  done && "border-primary bg-gradient-primary text-primary-foreground",
                  current && "animate-pulse-ring border-primary bg-card text-brand-ink",
                  !done && !current && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="size-5" /> : <Icon className="size-5" />}
              </span>
              <div className="pt-2">
                <p className={cn("text-sm font-bold", i <= statusIndex ? "text-foreground" : "text-muted-foreground")}>{stage.label}</p>
                <p className="text-xs text-muted-foreground">{time ? formatTime(time) : "Pending"}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
