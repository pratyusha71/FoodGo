import { Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="FoodGo home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow transition-transform duration-300 group-hover:-rotate-6">
        <UtensilsCrossed className="size-5" aria-hidden />
      </span>
      <span className="font-display text-2xl font-bold text-foreground">
        Food<span className="text-brand-ink">Go</span>
      </span>
    </Link>
  );
}
