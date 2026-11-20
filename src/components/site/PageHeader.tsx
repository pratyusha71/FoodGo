import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string | undefined; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-ink">{eyebrow}</p>
        )}
        <h1 className="animate-fade-up font-display text-4xl font-bold text-foreground md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  );
}
