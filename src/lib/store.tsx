import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { getFoodById, type FoodItem } from "@/lib/menu";
import { advanceOrderStatus, generateOrderId, ORDER_STAGES, type Customer, type Order } from "@/lib/orders";
import { calcTotals } from "@/lib/pricing";

export const CART_STORAGE_KEY = "foodgo-cart";
export const ORDERS_STORAGE_KEY = "foodgo-orders";

export interface CartLine {
  id: string;
  quantity: number;
}

export interface CartDetailLine extends CartLine {
  item: FoodItem;
}

interface StoreValue {
  hydrated: boolean;
  cart: CartLine[];
  cartLines: CartDetailLine[];
  cartCount: number;
  totals: { subtotal: number; delivery: number; total: number };
  orders: Order[];
  quantityOf: (id: string) => number;
  addToCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (customer: Customer) => Order | null;
  advanceOrder: (orderId: string) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const StoreContext = createContext<StoreValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: keep working in memory.
  }
}

function sanitizeCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (l): l is CartLine =>
      l && typeof l.id === "string" && !!getFoodById(l.id) && Number.isInteger(l.quantity) && l.quantity > 0,
  );
}

function sanitizeOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (o): o is Order =>
      o && typeof o.id === "string" && Array.isArray(o.items) && typeof o.total === "number" && typeof o.statusIndex === "number",
  );
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const ordersRef = useRef<Order[]>([]);
  ordersRef.current = orders;

  useEffect(() => {
    setCart(sanitizeCart(readJson(CART_STORAGE_KEY, [])));
    setOrders(sanitizeOrders(readJson(ORDERS_STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJson(CART_STORAGE_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) writeJson(ORDERS_STORAGE_KEY, orders);
  }, [orders, hydrated]);

  const cartLines = useMemo<CartDetailLine[]>(
    () =>
      cart.flatMap((line) => {
        const item = getFoodById(line.id);
        return item ? [{ ...line, item }] : [];
      }),
    [cart],
  );

  const totals = useMemo(
    () => calcTotals(cartLines.map((l) => ({ price: l.item.price, quantity: l.quantity }))),
    [cartLines],
  );

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.quantity, 0), [cart]);

  const quantityOf = useCallback((id: string) => cart.find((l) => l.id === id)?.quantity ?? 0, [cart]);

  const addToCart = useCallback((id: string) => {
    if (!getFoodById(id)) return;
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(l.quantity + 1, 20) } : l));
      return [...prev, { id, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(quantity, 20) } : l)),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((prev) => prev.filter((l) => l.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback(
    (customer: Customer): Order | null => {
      if (cartLines.length === 0) return null;
      const now = new Date();
      const order: Order = {
        id: generateOrderId(ordersRef.current.map((o) => o.id), now),
        createdAt: now.toISOString(),
        customer,
        items: cartLines.map((l) => ({ id: l.id, name: l.item.name, price: l.item.price, quantity: l.quantity })),
        ...totals,
        statusIndex: 0,
        statusTimes: ORDER_STAGES.map((_, i) => (i === 0 ? now.toISOString() : null)),
      };
      const nextOrders = [order, ...ordersRef.current];
      ordersRef.current = nextOrders;
      setOrders(nextOrders);
      setCart([]);
      writeJson(ORDERS_STORAGE_KEY, nextOrders);
      writeJson(CART_STORAGE_KEY, []);
      return order;
    },
    [cartLines, totals],
  );

  const advanceOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? advanceOrderStatus(o) : o)));
  }, []);

  const getOrder = useCallback((orderId: string) => orders.find((o) => o.id === orderId), [orders]);

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      cartLines,
      cartCount,
      totals,
      orders,
      quantityOf,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      advanceOrder,
      getOrder,
    }),
    [hydrated, cart, cartLines, cartCount, totals, orders, quantityOf, addToCart, setQuantity, removeFromCart, clearCart, placeOrder, advanceOrder, getOrder],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
