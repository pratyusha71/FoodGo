import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, SearchX, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/site/EmptyState";
import { FoodCard } from "@/components/site/FoodCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, filterMenu, isCategoryId, type CategoryId } from "@/lib/menu";
import { formatINR } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>): { category?: CategoryId } =>
    isCategoryId(search["category"]) ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Food Menu — FoodGo" },
      { name: "description", content: "Search and filter 24 dishes across Indian, pizza, burgers, biryani, snacks, desserts and beverages." },
      { property: "og:title", content: "Food Menu — FoodGo" },
      { property: "og:description", content: "Search and filter 24 dishes and add your favourites to the cart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/menu" });
  const [query, setQuery] = useState("");
  const active: CategoryId | "all" = category ?? "all";
  const items = useMemo(() => filterMenu(query, active), [query, active]);
  const { cartCount, totals, hydrated } = useStore();

  const pick = (id: CategoryId | "all") =>
    navigate({ search: id === "all" ? {} : { category: id }, replace: true, resetScroll: false });

  return (
    <>
      <PageHeader eyebrow="Our menu" title="Hungry? Pick your favourites." description="Fresh dishes with honest prices. Search by name or filter by category." />

      <div className="sticky top-16 z-30 border-b border-border bg-surface backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center">
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 60))}
              placeholder="Search food by name…"
              aria-label="Search food by name"
              className="h-11 rounded-full bg-card pl-11 pr-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Categories">
            {[{ id: "all" as const, label: "All" }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active === c.id}
                onClick={() => pick(c.id)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  active === c.id
                    ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card text-foreground hover:border-primary/50",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="mb-6 text-sm text-muted-foreground">
          Showing <span className="font-bold text-foreground">{items.length}</span> {items.length === 1 ? "dish" : "dishes"}
          {active !== "all" && <> in <span className="font-bold text-foreground">{CATEGORIES.find((c) => c.id === active)?.label}</span></>}
          {query.trim() && <> matching “<span className="font-bold text-foreground">{query.trim()}</span>”</>}
        </p>
        {items.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No dishes found"
            description="Try a different name or switch to another category."
            action={
              <Button variant="hero" onClick={() => { setQuery(""); pick("all"); }}>
                Show all dishes
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {hydrated && cartCount > 0 && (
        <div className="pointer-events-none sticky bottom-4 z-30 px-4">
          <Link
            to="/cart"
            className="pointer-events-auto mx-auto flex max-w-md animate-fade-up items-center justify-between gap-4 rounded-full bg-ink py-3 pl-6 pr-3 text-ink-foreground shadow-lift transition-transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <ShoppingBag className="size-5 text-primary-glow" />
              {cartCount} {cartCount === 1 ? "item" : "items"} · {formatINR(totals.subtotal)}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              View Cart <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      )}
    </>
  );
}
