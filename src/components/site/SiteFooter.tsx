import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/site/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            FoodGo is an educational Online Food Ordering and Delivery Tracking Simulator — a college project
            showing the full journey from browsing a menu to tracking a delivery. No real payments or deliveries
            take place.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Explore</h3>
          <ul className="space-y-2 text-sm">
            {([
              { to: "/menu", label: "Food Menu" },
              { to: "/cart", label: "My Cart" },
              { to: "/orders", label: "My Orders" },
              { to: "/track", label: "Track Order" },
              { to: "/about", label: "About Project" },
            ] as const).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-brand-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Contact</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-ink" aria-hidden />
              12 MG Road, Bengaluru, Karnataka 560001
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-brand-ink" aria-hidden />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-brand-ink" aria-hidden />
              hello@foodgo.in
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} FoodGo · A college project prototype for learning purposes.
        </p>
      </div>
    </footer>
  );
}
