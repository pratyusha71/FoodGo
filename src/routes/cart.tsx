import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart, Trash2, Truck } from "lucide-react";

import { BillSummary } from "@/components/site/BillSummary";
import { EmptyState } from "@/components/site/EmptyState";
import { LoadingBlock } from "@/components/site/LoadingBlock";
import { PageHeader } from "@/components/site/PageHeader";
import { QuantityStepper } from "@/components/site/QuantityStepper";
import { VegMark } from "@/components/site/VegMark";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FREE_DELIVERY_THRESHOLD, formatINR } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "My Cart — FoodGo" },
      { name: "description", content: "Review the dishes in your cart, change quantities and see your total bill." },
      { property: "og:title", content: "My Cart — FoodGo" },
      { property: "og:description", content: "Review your cart and head to checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { hydrated, cartLines, cartCount, totals, setQuantity, removeFromCart, clearCart } = useStore();
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totals.subtotal);
  const progress = Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <>
      <PageHeader eyebrow="My cart" title="Your cart" description={hydrated && cartCount > 0 ? `${cartCount} ${cartCount === 1 ? "item" : "items"} ready for checkout.` : "Everything you've picked, in one place."} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!hydrated ? (
          <LoadingBlock />
        ) : cartLines.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Explore the menu and find something delicious."
            action={
              <Button asChild variant="hero" size="lg">
                <Link to="/menu">Browse the menu <ArrowRight /></Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <section aria-label="Cart items" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-foreground">Items</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 /> Clear cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                      <AlertDialogDescription>All {cartCount} items will be removed. This can't be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep items</AlertDialogCancel>
                      <AlertDialogAction onClick={clearCart} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Clear cart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {cartLines.map(({ id, quantity, item }) => (
                <article key={id} className="flex animate-fade-up gap-4 rounded-3xl border border-border bg-card p-4 shadow-card">
                  <img src={item.image} alt={item.name} className="size-24 shrink-0 rounded-2xl object-cover sm:size-28" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <VegMark veg={item.veg} className="shrink-0" />
                          <h3 className="truncate font-display text-lg font-semibold text-card-foreground">{item.name}</h3>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{formatINR(item.price)} each</p>
                      </div>
                      <Button variant="ghost" size="icon" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(id)} className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 />
                      </Button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <QuantityStepper quantity={quantity} name={item.name} size="sm" onChange={(n) => setQuantity(id, n)} />
                      <span className="text-lg font-extrabold text-foreground">{formatINR(item.price * quantity)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit space-y-5 rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-semibold text-card-foreground">Bill details</h2>
              <div className="rounded-2xl bg-muted p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Truck className="size-4 text-brand-ink" />
                  {remaining > 0 ? <>Add {formatINR(remaining)} more for free delivery</> : <>You've unlocked free delivery!</>}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                  <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <BillSummary {...totals} />
              <Button asChild variant="hero" size="xl" className="w-full">
                <Link to="/checkout">Proceed to Checkout <ArrowRight /></Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/menu">Add more items</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
