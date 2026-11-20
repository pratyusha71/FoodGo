import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bike, CalendarClock, ReceiptText } from "lucide-react";

import { EmptyState } from "@/components/site/EmptyState";
import { LoadingBlock } from "@/components/site/LoadingBlock";
import { PageHeader } from "@/components/site/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatOrderDate } from "@/lib/orders";
import { formatINR } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — FoodGo" },
      { name: "description", content: "See every order you've placed on FoodGo with its items, amount and delivery status." },
      { property: "og:title", content: "My Orders — FoodGo" },
      { property: "og:description", content: "All your FoodGo orders with their delivery status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { hydrated, orders } = useStore();

  return (
    <>
      <PageHeader eyebrow="Order history" title="My orders" description={hydrated && orders.length > 0 ? `You've placed ${orders.length} ${orders.length === 1 ? "order" : "orders"}.` : "All your past and current orders appear here."} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {!hydrated ? (
          <LoadingBlock />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No orders yet"
            description="When you place an order it will show up here so you can track it any time."
            action={<Button asChild variant="hero" size="lg"><Link to="/menu">Order your first meal <ArrowRight /></Link></Button>}
          />
        ) : (
          <ul className="space-y-5">
            {orders.map((order) => {
              const count = order.items.reduce((n, i) => n + i.quantity, 0);
              return (
                <li key={order.id} className="animate-fade-up rounded-3xl border border-border bg-card p-6 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</p>
                      <p className="font-mono text-lg font-bold tracking-wide text-card-foreground">{order.id}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarClock className="size-4" /> {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge statusIndex={order.statusIndex} />
                  </div>
                  <p className="mt-4 text-sm text-foreground">
                    {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "item" : "items"} · <span className="text-lg font-extrabold text-foreground">{formatINR(order.total)}</span>
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="rounded-full">
                        <Link to="/order-confirmation/$orderId" params={{ orderId: order.id }}>Details</Link>
                      </Button>
                      <Button asChild variant="hero">
                        <Link to="/track/$orderId" params={{ orderId: order.id }}>
                          <Bike /> Track Order
                        </Link>
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
