/** Orders at or above this subtotal get free delivery. */
export const FREE_DELIVERY_THRESHOLD = 499;
/** Flat delivery charge below the free-delivery threshold. */
export const DELIVERY_FEE = 40;

export interface PricedLine {
  price: number;
  quantity: number;
}

export function calcSubtotal(lines: PricedLine[]): number {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function calcDeliveryCharge(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function calcTotals(lines: PricedLine[]) {
  const subtotal = calcSubtotal(lines);
  const delivery = calcDeliveryCharge(subtotal);
  return { subtotal, delivery, total: subtotal + delivery };
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
