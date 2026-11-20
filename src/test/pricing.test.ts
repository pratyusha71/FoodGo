import { describe, expect, it } from "vitest";

import { calcDeliveryCharge, calcTotals, formatINR } from "@/lib/pricing";

describe("delivery charge", () => {
  it("charges ₹40 delivery below ₹499", () => {
    expect(calcDeliveryCharge(498)).toBe(40);
  });
  it("gives free delivery at ₹499 and above", () => {
    expect(calcDeliveryCharge(499)).toBe(0);
  });
  it("charges nothing for an empty cart", () => {
    expect(calcDeliveryCharge(0)).toBe(0);
  });
});

describe("bill totals", () => {
  it("adds delivery to the subtotal for the grand total", () => {
    expect(calcTotals([{ price: 140, quantity: 2 }, { price: 60, quantity: 1 }])).toEqual({ subtotal: 340, delivery: 40, total: 380 });
  });
  it("formats rupees in Indian style", () => {
    expect(formatINR(1499)).toBe("₹1,499");
  });
});
