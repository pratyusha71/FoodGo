import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bike, Clock, Leaf, MousePointerClick, ShieldCheck, Star } from "lucide-react";

import heroImage from "@/assets/hero-feast.webp";
import { FoodCard } from "@/components/site/FoodCard";
import { Button } from "@/components/ui/button";
import { CATEGORIES, FOOD_ITEMS } from "@/lib/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FoodGo — Your Favourite Food, Delivered Fresh" },
      {
        name: "description",
        content: "Order biryani, pizza, burgers and Indian classics online and follow your delivery step by step with FoodGo.",
      },
      { property: "og:title", content: "FoodGo — Your Favourite Food, Delivered Fresh" },
      {
        property: "og:description",
        content: "Order biryani, pizza, burgers and Indian classics online and follow your delivery step by step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const featured = FOOD_ITEMS.filter((i) => i.featured);

const WHY = [
  { icon: Bike, title: "Fast Delivery", text: "Hot food at your door in around 30 minutes, with live status at every step." },
  { icon: Leaf, title: "Fresh Food", text: "Every dish is cooked only after you order, using fresh, quality ingredients." },
  { icon: MousePointerClick, title: "Easy Ordering", text: "Find a dish, tap Add to Cart and check out in under a minute — no sign-up needed." },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground shadow-card">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Now delivering across your city
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Your Favourite Food, <span className="italic text-brand-ink">Delivered Fresh.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Explore a menu of Indian favourites, pizzas, burgers and desserts, place your order in a few taps,
              and watch it travel from our kitchen to your door with live delivery tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/menu">
                  Explore Menu <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-card">
                <Link to="/track">
                  <Bike className="size-5" /> Track Your Order
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: "24+", v: "Dishes" },
                { k: "30 min", v: "Avg. delivery" },
                { k: "4.8★", v: "Rating" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-bold text-foreground">{s.k}</dt>
                  <dd className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-2xl" aria-hidden />
            <img
              src={heroImage}
              alt="A spread of biryani, butter chicken, paneer tikka, naan and pizza"
              width={1440}
              height={960}
              className="relative aspect-[4/3] w-full rounded-[2rem] border border-border object-cover shadow-lift"
            />
            <div className="absolute -left-3 bottom-8 flex animate-float items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 shadow-lift sm:-left-8">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Clock className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-card-foreground">30 min delivery</p>
                <p className="text-xs text-muted-foreground">Hot & on time</p>
              </div>
            </div>
            <div className="absolute -right-2 top-6 flex animate-float items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-lift [animation-delay:1.5s] sm:-right-6">
              <Star className="size-5 fill-star text-star" />
              <p className="text-sm font-bold text-card-foreground">4.8 <span className="font-medium text-muted-foreground">· 2k reviews</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <SectionHeading eyebrow="Popular categories" title="What are you craving today?" />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/menu"
              search={{ category: c.id }}
              className="group flex w-36 shrink-0 snap-start flex-col items-center rounded-3xl border border-border bg-card p-4 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift sm:w-auto"
            >
              <span className="mb-3 block size-20 overflow-hidden rounded-full ring-4 ring-primary/15 transition-all group-hover:ring-primary/40">
                <img src={c.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="font-display text-base font-semibold text-card-foreground">{c.label}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{c.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Chef's picks" title="Featured dishes" />
          <Button asChild variant="soft" className="mb-8 rounded-full">
            <Link to="/menu">
              View full menu <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-ink p-8 text-ink-foreground shadow-lift md:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-glow">Why choose us</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold md:text-4xl">Good food, made simple from cart to doorstep.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-3xl border border-ink-foreground/15 bg-ink-foreground/5 p-6 transition-colors hover:bg-ink-foreground/10">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <w.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-foreground/75">{w.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink-foreground/15 pt-8">
            <ShieldCheck className="size-5 text-primary-glow" />
            <p className="text-sm text-ink-foreground/80">Simulator project — no real payments are taken.</p>
            <Button asChild variant="hero" className="ml-auto">
              <Link to="/menu">Start your order</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-ink">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
    </div>
  );
}
