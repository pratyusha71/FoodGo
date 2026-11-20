import { z } from "zod";

export const ORDER_STAGES = [
  { key: "placed", label: "Order Placed", message: "We've received your order and sent it to the restaurant." },
  { key: "confirmed", label: "Order Confirmed", message: "The restaurant has accepted your order." },
  { key: "preparing", label: "Food Preparing", message: "Our chefs are cooking your food fresh right now." },
  { key: "out", label: "Out for Delivery", message: "Your delivery partner is on the way with your food." },
  { key: "delivered", label: "Delivered", message: "Your food has been delivered. Enjoy your meal!" },
] as const;

export const LAST_STAGE_INDEX = ORDER_STAGES.length - 1;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  landmark?: string | undefined;
  instructions?: string | undefined;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  statusIndex: number;
  /** ISO time each stage was reached; null until reached. */
  statusTimes: (string | null)[];
}

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderId(existingIds: string[], now = new Date()): string {
  const datePart =
    String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const taken = new Set(existingIds);
  for (;;) {
    let suffix = "";
    for (let i = 0; i < 4; i++) suffix += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length));
    const id = `FG${datePart}-${suffix}`;
    if (!taken.has(id)) return id;
  }
}

/** Moves an order one stage forward; a delivered order stays delivered. */
export function advanceOrderStatus(order: Order, now = new Date()): Order {
  if (order.statusIndex >= LAST_STAGE_INDEX) return order;
  const next = order.statusIndex + 1;
  const statusTimes = [...order.statusTimes];
  statusTimes[next] = now.toISOString();
  return { ...order, statusIndex: next, statusTimes };
}

/** Accepts "98765 43210", "+91 9876543210" or "09876543210" and keeps the 10 digits. */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/[\s-]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(60, "Name must be under 60 characters")
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Name can only contain letters and spaces"),
  phone: z
    .string()
    .transform(normalizePhone)
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number starting with 6–9")),
  address: z
    .string()
    .trim()
    .min(10, "Please enter your full delivery address")
    .max(250, "Address must be under 250 characters"),
  landmark: z.string().trim().max(100, "Landmark must be under 100 characters").optional(),
  instructions: z.string().trim().max(200, "Instructions must be under 200 characters").optional(),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}
