import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, FastForward, MapPin, PartyPopper } from "lucide-react";
import { toast } from "sonner";

import { BillSummary } from "@/components/site/BillSummary";
import { LoadingBlock } from "@/components/site/LoadingBlock";
import { OrderItemsList } from "@/components/site/OrderItemsList";
import { OrderNotFound } from "@/components/site/OrderNotFound";
import { OrderTracker } from "@/components/site/OrderTracker";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatOrderDate, LAST_STAGE_INDEX, ORDER_STAGES } from "@/lib/orders";
import { formatINR } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/track/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Tracking ${params.orderId} — FoodGo` },
      { name: "description", content: "Follow your FoodGo order from kitchen to doorstep with the live delivery tracker." },
      { property: "og:title", content: "Track your order — FoodGo" },
      { property: "og:description", content: "Follow your order from kitchen to doorstep." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const { orderId } = Route.useParams();
  const { hydrated, getOrder, advanceOrder, orders } = useStore();
  if (!hydrated) return <div className="px-4 py-16"><LoadingBlock /></div>;
  const order = getOrder(orderId);
  if (!order) return <OrderNotFound orderId={orderId} />;

  const stage = ORDER_STAGES[order.statusIndex] ?? ORDER_STAGES[0];
  const delivered = order.statusIndex >= LAST_STAGE_INDEX;
  const others = orders.filter((o) => o.id !== order.id).slice(0, 4);

  const next = () => {
    advanceOrder(order.id);
    const upcoming = ORDER_STAGES[order.statusIndex + 1];
    if (upcoming) toast.success(`Status updated: ${upcoming.label}`);
  };

  return (
    <>
      <section className="border-b border-border bg-gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-ink">Live delivery tracking</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                Order <span className="font-mono tracking-wide">{order.id}</span>
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="size-4" /> Placed {formatOrderDate(order.createdAt)}
              </p>
            </div>
            <StatusBadge statusIndex={order.statusIndex} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-10">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current status</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-card-foreground">{stage.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{stage.message}</p>
            </div>
            <Button variant="hero" size="xl" onClick={next} disabled={delivered}>
              <FastForward className="size-5" />
              {delivered ? "Order Delivered" : "Simulate Next Status"}
            </Button>
          </div>
          <OrderTracker statusIndex={order.statusIndex} statusTimes={order.statusTimes} />

          {delivered && (
            <div className="mt-10 flex animate-pop flex-col items-center gap-3 rounded-3xl border border-success/40 bg-success/10 p-8 text-center">
              <PartyPopper className="size-10 text-success" />
              <h3 className="font-display text-2xl font-bold text-foreground">Delivered! Enjoy your meal 🎉</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Your order reached {order.customer.address.split(",")[0]}. Thank you for ordering with FoodGo!
              </p>
              <Button asChild variant="hero" className="mt-2">
                <Link to="/menu">Order again</Link>
              </Button>
            </div>
          )}
        </section>

        <div className="grid gap-6 md:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-semibold text-card-foreground">Ordered items</h2>
            <OrderItemsList items={order.items} />
            <div className="mt-5 border-t border-border pt-4">
              <BillSummary subtotal={order.subtotal} delivery={order.delivery} total={order.total} />
            </div>
          </section>
          <aside className="space-y-6">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-semibold text-card-foreground">Delivering to</h2>
              <p className="font-semibold text-foreground">{order.customer.name}</p>
              <p className="mt-1 flex gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-ink" />
                {order.customer.address}
              </p>
            </section>
            {others.length > 0 && (
              <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <h2 className="mb-3 font-display text-lg font-semibold text-card-foreground">Track another order</h2>
                <ul className="space-y-2">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link to="/track/$orderId" params={{ orderId: o.id }} className="flex items-center justify-between gap-2 rounded-xl p-2 text-sm transition-colors hover:bg-muted">
                        <span className="font-mono font-semibold text-foreground">{o.id}</span>
                        <span className="text-muted-foreground">{formatINR(o.total)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/orders" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
                  All orders <ArrowRight className="size-4" />
                </Link>
              </section>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
