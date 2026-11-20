import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, CalendarClock, Check, Copy, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";

import { BillSummary } from "@/components/site/BillSummary";
import { LoadingBlock } from "@/components/site/LoadingBlock";
import { OrderItemsList } from "@/components/site/OrderItemsList";
import { OrderNotFound } from "@/components/site/OrderNotFound";
import { Button } from "@/components/ui/button";
import { formatOrderDate } from "@/lib/orders";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.orderId} confirmed — FoodGo` },
      { name: "description", content: "Your FoodGo order has been placed. See your order details and start tracking." },
      { property: "og:title", content: "Order confirmed — FoodGo" },
      { property: "og:description", content: "Your FoodGo order has been placed successfully." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderId } = Route.useParams();
  const { hydrated, getOrder } = useStore();
  if (!hydrated) return <div className="px-4 py-16"><LoadingBlock /></div>;
  const order = getOrder(orderId);
  if (!order) return <OrderNotFound orderId={orderId} />;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      toast.success("Order ID copied");
    } catch {
      toast.error("Couldn't copy — please note it down");
    }
  };

  return (
    <div className="bg-gradient-hero">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <span className="mx-auto flex size-20 animate-pop items-center justify-center rounded-full bg-success text-success-foreground shadow-lift">
            <Check className="size-10" strokeWidth={3} />
          </span>
          <h1 className="mt-6 animate-fade-up font-display text-4xl font-bold text-foreground md:text-5xl">Order placed successfully!</h1>
          <p className="mt-3 text-muted-foreground">Thank you, {order.customer.name.split(" ")[0]}. The kitchen has your order.</p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card py-2 pl-5 pr-2 shadow-card">
            <span className="text-sm text-muted-foreground">Order ID</span>
            <span className="font-mono text-base font-bold tracking-wider text-foreground">{order.id}</span>
            <Button variant="soft" size="icon" className="rounded-full" aria-label="Copy order ID" onClick={copyId}>
              <Copy />
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-semibold text-card-foreground">Delivery details</h2>
            <ul className="space-y-3 text-sm">
              <Detail icon={User} label="Name" value={order.customer.name} />
              <Detail icon={Phone} label="Phone" value={`+91 ${order.customer.phone}`} />
              <Detail icon={MapPin} label="Address" value={[order.customer.address, order.customer.landmark && `Landmark: ${order.customer.landmark}`].filter(Boolean).join(" · ")} />
              <Detail icon={CalendarClock} label="Ordered on" value={formatOrderDate(order.createdAt)} />
              {order.customer.instructions && <Detail icon={Bike} label="Instructions" value={order.customer.instructions} />}
            </ul>
          </section>
          <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-semibold text-card-foreground">Your items</h2>
            <OrderItemsList items={order.items} />
            <div className="mt-5 border-t border-border pt-4">
              <BillSummary subtotal={order.subtotal} delivery={order.delivery} total={order.total} />
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="xl">
            <Link to="/track/$orderId" params={{ orderId: order.id }}>
              <Bike className="size-5" /> Track Order
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="bg-card">
            <Link to="/menu">Order more food</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-brand-ink">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="break-words font-medium text-foreground">{value}</p>
      </div>
    </li>
  );
}
