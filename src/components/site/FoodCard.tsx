import { Plus, Star } from "lucide-react";
import { toast } from "sonner";

import { QuantityStepper } from "@/components/site/QuantityStepper";
import { VegMark } from "@/components/site/VegMark";
import { Button } from "@/components/ui/button";
import { CATEGORIES, type FoodItem } from "@/lib/menu";
import { formatINR } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export function FoodCard({ item }: { item: FoodItem }) {
  const { quantityOf, addToCart, setQuantity, hydrated } = useStore();
  const qty = hydrated ? quantityOf(item.id) : 0;
  const category = CATEGORIES.find((c) => c.id === item.category)?.label;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={640}
          height={480}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-bold text-foreground backdrop-blur-md">
          {category}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur-md">
          <Star className="size-3.5 fill-star text-star" aria-hidden />
          {item.rating.toFixed(1)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-2">
          <VegMark veg={item.veg} className="mt-1 shrink-0" />
          <h3 className="font-display text-lg font-semibold leading-snug text-card-foreground">{item.name}</h3>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-xl font-extrabold text-foreground">{formatINR(item.price)}</span>
          {qty > 0 ? (
            <QuantityStepper quantity={qty} name={item.name} size="sm" onChange={(n) => setQuantity(item.id, n)} />
          ) : (
            <Button
              variant="hero"
              size="sm"
              className="h-10 px-4"
              onClick={() => {
                addToCart(item.id);
                toast.success(`${item.name} added to cart`);
              }}
            >
              <Plus /> Add to Cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
