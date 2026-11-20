import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bike, PackageSearch, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { EmptyState } from "@/components/site/EmptyState";
import { LoadingBlock } from "@/components/site/LoadingBlock";
import { PageHeader } from "@/components/site/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatOrderDate } from "@/lib/orders";
import { formatINR } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/track/")({
  head: () => ({
    meta: [
      { title: "Track Your Order — FoodGo" },
      { name: "description", content: "Track your most recent FoodGo order or look up a previous order by its order ID." },
      { property: "og:title", content: "Track Your Order — FoodGo" },
      { property: "og:description", content: "Track your latest order or find a previous one by ID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackLookupPage,
});

function TrackLookupPage() {
  const { hydrated, orders, getOrder } = useStore();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const latest = orders[0];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = code.trim().toUpperCase();
    if (!id) return setError("Please enter an order ID");
    if (!getOrder(id)) return setError(`No order found with ID ${id}`);
    navigate({ to: "/track/$orderId", params: { orderId: id } });
  };

  return (
    <>
      <PageHeader eyebrow="Delivery tracking" title="Track your order" description="Follow your latest order or look up an earlier one using its order ID." />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
        <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <label htmlFor="order-code" className="text-sm font-semibold text-foreground">Order ID</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="order-code"
                value={code}
                maxLength={20}
                onChange={(e) => { setCode(e.target.value); setError(""); }}
                placeholder="e.g. FG261120-AB12"
                aria-invalid={!!error}
                className="h-12 rounded-full bg-background pl-11 font-mono uppercase placeholder:font-sans placeholder:normal-case"
              />
            </div>
            <Button type="submit" variant="hero" size="xl">Track</Button>
          </div>
          {error && <p role="alert" className="mt-2 text-sm font-medium text-destructive">{error}</p>}
        </form>

        {!hydrated ? (
          <LoadingBlock />
        ) : !latest ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders to track yet"
            description="Place your first order and you'll be able to follow it here, step by step."
            action={<Button asChild variant="hero" size="lg"><Link to="/menu">Explore menu <ArrowRight /></Link></Button>}
          />
        ) : (
          <>
            <section className="overflow-hidden rounded-3xl bg-gradient-ink p-6 text-ink-foreground shadow-lift md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-glow">Most recent order</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-2xl font-bold tracking-wide">{latest.id}</p>
                  <p className="mt-1 text-sm text-ink-foreground/75">
                    {formatOrderDate(latest.createdAt)} · {latest.items.reduce((n, i) => n + i.quantity, 0)} items · {formatINR(latest.total)}
                  </p>
                </div>
                <Button asChild variant="hero" size="xl">
                  <Link to="/track/$orderId" params={{ orderId: latest.id }}>
                    <Bike className="size-5" /> Track now
                  </Link>
                </Button>
              </div>
            </section>
            {orders.length > 1 && (
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Previous orders</h2>
                <ul className="space-y-3">
                  {orders.slice(1).map((o) => (
                    <li key={o.id}>
                      <Link
                        to="/track/$orderId"
                        params={{ orderId: o.id }}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50"
                      >
                        <div>
                          <p className="font-mono font-bold text-foreground">{o.id}</p>
                          <p className="text-xs text-muted-foreground">{formatOrderDate(o.createdAt)} · {formatINR(o.total)}</p>
                        </div>
                        <StatusBadge statusIndex={o.statusIndex} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
