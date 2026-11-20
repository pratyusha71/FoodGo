import { Link } from "@tanstack/react-router";
import { Menu as MenuIcon, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/cart", label: "My Cart" },
  { to: "/orders", label: "My Orders" },
  { to: "/about", label: "About" },
] as const;

function CartButton() {
  const { cartCount, hydrated } = useStore();
  return (
    <Link
      to="/cart"
      aria-label={`Cart, ${cartCount} items`}
      className="relative flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-transform hover:-translate-y-0.5"
    >
      <ShoppingBag className="size-5" aria-hidden />
      {hydrated && cartCount > 0 && (
        <span
          key={cartCount}
          className="absolute -right-1.5 -top-1.5 flex min-w-5 animate-pop items-center justify-center rounded-full bg-gradient-primary px-1.5 text-xs font-bold leading-5 text-primary-foreground"
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-primary/12 !text-brand-ink" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <CartButton />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">
                  Food<span className="text-brand-ink">Go</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    className="rounded-xl px-4 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
                    activeProps={{ className: "bg-primary/12 !text-brand-ink" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 rounded-2xl border border-border bg-card p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Appearance</p>
                <ThemeToggle showLabel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
