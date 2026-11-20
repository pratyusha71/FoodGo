import { describe, expect, it } from "vitest";

import { advanceOrderStatus, checkoutSchema, generateOrderId, LAST_STAGE_INDEX, type Order } from "@/lib/orders";

const base = { name: "Priya Sharma", address: "12 MG Road, Bengaluru 560001" };

describe("checkout phone validation", () => {
  it("accepts a 10-digit mobile number starting with 6-9", () => {
    expect(checkoutSchema.safeParse({ ...base, phone: "9876543210" }).success).toBe(true);
  });
  it("accepts +91 prefix and spaces", () => {
    const r = checkoutSchema.safeParse({ ...base, phone: "+91 98765 43210" });
    expect(r.success && r.data.phone).toBe("9876543210");
  });
  it("rejects numbers starting with 0-5", () => {
    expect(checkoutSchema.safeParse({ ...base, phone: "5876543210" }).success).toBe(false);
  });
  it("rejects numbers that are too short", () => {
    expect(checkoutSchema.safeParse({ ...base, phone: "98765" }).success).toBe(false);
  });
  it("requires a name and address", () => {
    expect(checkoutSchema.safeParse({ name: "", phone: "9876543210", address: "" }).success).toBe(false);
  });
});

describe("order ids", () => {
  it("never repeats an existing id", () => {
    const ids: string[] = [];
    for (let i = 0; i < 200; i++) ids.push(generateOrderId(ids, new Date(2026, 10, 20)));
    expect(new Set(ids).size).toBe(200);
    expect(ids[0]).toMatch(/^FG261120-[A-Z2-9]{4}$/);
  });
});

describe("tracking", () => {
  const order: Order = {
    id: "FG261120-ABCD",
    createdAt: new Date().toISOString(),
    customer: { name: "A", phone: "9876543210", address: "x" },
    items: [],
    subtotal: 0,
    delivery: 0,
    total: 0,
    statusIndex: 0,
    statusTimes: [new Date().toISOString(), null, null, null, null],
  };
  it("moves one stage forward per simulate click", () => {
    expect(advanceOrderStatus(order).statusIndex).toBe(1);
  });
  it("stays on Delivered once delivered", () => {
    const delivered = { ...order, statusIndex: LAST_STAGE_INDEX };
    expect(advanceOrderStatus(delivered).statusIndex).toBe(LAST_STAGE_INDEX);
  });
});
