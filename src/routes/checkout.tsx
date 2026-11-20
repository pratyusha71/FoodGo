import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { BillSummary } from "@/components/site/BillSummary";
import { EmptyState } from "@/components/site/EmptyState";
import { LoadingBlock } from "@/components/site/LoadingBlock";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { checkoutSchema } from "@/lib/orders";
import { formatINR } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FoodGo" },
      { name: "description", content: "Enter your delivery details, review your bill and place your FoodGo order." },
      { property: "og:title", content: "Checkout — FoodGo" },
      { property: "og:description", content: "Enter delivery details and place your order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

type Field = "name" | "phone" | "address" | "landmark" | "instructions";
const EMPTY: Record<Field, string> = { name: "", phone: "", address: "", landmark: "", instructions: "" };

function CheckoutPage() {
  const { hydrated, cartLines, totals, placeOrder } = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      document.getElementById(`field-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    const { landmark, instructions, ...rest } = parsed.data;
    const order = placeOrder({ ...rest, landmark: landmark || undefined, instructions: instructions || undefined });
    if (!order) {
      setSubmitting(false);
      toast.error("Your cart is empty");
      return;
    }
    toast.success("Order placed successfully!");
    navigate({ to: "/order-confirmation/$orderId", params: { orderId: order.id } });
  };

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Almost there!" description="Tell us where to deliver. No payment is needed — this is a simulator." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!hydrated ? (
          <LoadingBlock />
        ) : cartLines.length === 0 && !submitting ? (
          <EmptyState
            icon={ShoppingCart}
            title="Nothing to check out"
            description="Your cart is empty. Add a few dishes from the menu first."
            action={<Button asChild variant="hero" size="lg"><Link to="/menu">Go to menu <ArrowRight /></Link></Button>}
          />
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <section className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <h2 className="font-display text-2xl font-semibold text-card-foreground">Delivery details</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField id="name" label="Full name" required error={errors.name}>
                  <Input id="field-name" autoComplete="name" maxLength={60} value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Priya Sharma" aria-invalid={!!errors.name} className={inputCls(errors.name)} />
                </FormField>
                <FormField id="phone" label="Phone number" required error={errors.phone}>
                  <Input id="field-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={16} value={values.phone} onChange={(e) => update("phone", e.target.value.replace(/[^\d+\s-]/g, ""))} placeholder="10-digit mobile number" aria-invalid={!!errors.phone} className={inputCls(errors.phone)} />
                </FormField>
              </div>
              <FormField id="address" label="Delivery address" required error={errors.address}>
                <Textarea id="field-address" autoComplete="street-address" maxLength={250} rows={3} value={values.address} onChange={(e) => update("address", e.target.value)} placeholder="House / flat no., street, area, city, PIN code" aria-invalid={!!errors.address} className={inputCls(errors.address)} />
              </FormField>
              <FormField id="landmark" label="Landmark" hint="Optional" error={errors.landmark}>
                <Input id="field-landmark" maxLength={100} value={values.landmark} onChange={(e) => update("landmark", e.target.value)} placeholder="e.g. Near City Mall" className={inputCls(errors.landmark)} />
              </FormField>
              <FormField id="instructions" label="Delivery instructions" hint="Optional" error={errors.instructions}>
                <Textarea id="field-instructions" maxLength={200} rows={2} value={values.instructions} onChange={(e) => update("instructions", e.target.value)} placeholder="e.g. Ring the bell twice, leave at the door" className={inputCls(errors.instructions)} />
              </FormField>
              <p className="flex items-center gap-2 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                <ShieldCheck className="size-5 shrink-0 text-success" />
                Payment: Cash on delivery (simulated). No real payment is collected.
              </p>
            </section>

            <aside className="h-fit space-y-5 rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-semibold text-card-foreground">Order summary</h2>
              <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {cartLines.map(({ id, quantity, item }) => (
                  <li key={id} className="flex items-center gap-3">
                    <img src={item.image} alt="" className="size-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{quantity} × {formatINR(item.price)}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">{formatINR(item.price * quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4">
                <BillSummary {...totals} />
              </div>
              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : null}
                Place Order · {formatINR(totals.total)}
              </Button>
            </aside>
          </form>
        )}
      </div>
    </>
  );
}

function inputCls(error?: string | undefined) {
  return cn("rounded-xl bg-background text-base", error && "border-destructive focus-visible:ring-destructive");
}

function FormField({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean | undefined; hint?: string | undefined; error?: string | undefined; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`field-${id}`} className="flex items-center gap-1 text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-muted-foreground">({hint})</span>}
      </Label>
      {children}
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
