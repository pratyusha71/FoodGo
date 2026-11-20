import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bike, ClipboardList, Database, Moon, Receipt, Search, ShoppingCart } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — FoodGo" },
      { name: "description", content: "FoodGo is an educational simulator of online food ordering and delivery tracking, built as a college project." },
      { property: "og:title", content: "About the Project — FoodGo" },
      { property: "og:description", content: "An educational simulator of online food ordering and delivery tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const FEATURES = [
  { icon: Search, title: "Menu browsing", text: "24 dishes across 7 categories with live search and category filters." },
  { icon: ShoppingCart, title: "Cart management", text: "Add, increase, decrease and remove items. The cart is saved after a refresh." },
  { icon: Receipt, title: "Billing", text: "Automatic subtotal, delivery charge (free above ₹499) and grand total." },
  { icon: ClipboardList, title: "Order placement", text: "Validated checkout form and a unique order ID for every order." },
  { icon: Bike, title: "Delivery tracking", text: "Five-stage tracker you can move forward with “Simulate Next Status”." },
  { icon: Moon, title: "Light & dark mode", text: "A sun/moon switch that remembers your choice on this device." },
];

const FLOW = ["Home", "Menu", "Add to Cart", "Cart", "Checkout", "Place Order", "Confirmation", "Track Delivery"];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the project"
        title="Online Food Ordering & Delivery Tracking Simulator"
        description="FoodGo is an educational college project that shows, step by step, how an online food ordering app works — from browsing a menu to watching a delivery arrive."
      />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6">
        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="font-display text-3xl font-bold text-foreground">What is it?</h2>
            <p>
              This simulator demonstrates the complete customer journey of a food delivery platform: menu browsing,
              cart management, billing, order placement and simulated delivery tracking.
            </p>
            <p>
              Nothing here is real — there is no payment, no restaurant and no rider. Instead, you move the order through
              each delivery stage yourself to see how a tracking system updates.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-card-foreground">
              <Database className="size-5 text-brand-ink" /> How data is stored
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              There is no server or login. Your cart, orders, tracking progress and theme choice are saved in your
              browser's local storage, so they stay after a refresh but only on this device.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Built with</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "localStorage"].map((t) => (
                <span key={t} className="rounded-full bg-primary/12 px-3 py-1 text-xs font-bold text-brand-ink">{t}</span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-8 font-display text-3xl font-bold text-foreground">What it demonstrates</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-gradient-ink p-8 text-ink-foreground shadow-lift md:p-12">
          <h2 className="font-display text-3xl font-bold">The complete flow</h2>
          <ol className="mt-8 flex flex-wrap items-center gap-3">
            {FLOW.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full border border-ink-foreground/20 bg-ink-foreground/5 px-4 py-2 text-sm font-semibold">
                  <span className="flex size-6 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                  {step}
                </span>
                {i < FLOW.length - 1 && <ArrowRight className="size-4 text-primary-glow" aria-hidden />}
              </li>
            ))}
          </ol>
          <Button asChild variant="hero" size="xl" className="mt-10">
            <Link to="/menu">Try it now <ArrowRight /></Link>
          </Button>
        </section>
      </div>
    </>
  );
}
