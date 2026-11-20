import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md animate-fade-up flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-card">
      <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/12 text-brand-ink">
        <Icon className="size-8" aria-hidden />
      </span>
      <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
