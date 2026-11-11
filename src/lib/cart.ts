import type { Localized } from "./products";
import type { CartLine as PriceLine, Piasters } from "./price";

/**
 * A line in the browser cart. Prices here are for display only:
 * the server recalculates everything from the database at checkout (M3).
 */
export type CartItem = {
  variantId: string;
  slug: string;
  name: Localized;
  size: string;
  color: string;
  unitPrice: Piasters;
  qty: number;
  /** Stock when added; caps the quantity stepper. */
  maxQty: number;
};

export const MAX_QTY_PER_LINE = 10;

function clampQty(qty: number, maxQty: number) {
  const cap = Math.min(MAX_QTY_PER_LINE, Math.max(1, maxQty));
  return Math.min(cap, Math.max(1, Math.floor(qty)));
}

/** Add an item; merges with an existing line for the same variant. */
export function addItem(items: CartItem[], item: CartItem): CartItem[] {
  if (item.maxQty < 1) return items;
  const existing = items.find((i) => i.variantId === item.variantId);
  if (!existing) return [...items, { ...item, qty: clampQty(item.qty, item.maxQty) }];
  return items.map((i) =>
    i.variantId === item.variantId ? { ...item, qty: clampQty(i.qty + item.qty, item.maxQty) } : i,
  );
}

export function setQty(items: CartItem[], variantId: string, qty: number): CartItem[] {
  return items.map((i) => (i.variantId === variantId ? { ...i, qty: clampQty(qty, i.maxQty) } : i));
}

export function removeItem(items: CartItem[], variantId: string): CartItem[] {
  return items.filter((i) => i.variantId !== variantId);
}

export function itemCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function toPriceLines(items: CartItem[]): PriceLine[] {
  return items.map((i) => ({ unitPrice: i.unitPrice, qty: i.qty }));
}

/** Parse stored JSON defensively: drop anything that isn't a valid line. */
export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (i): i is CartItem =>
        typeof i === "object" &&
        i !== null &&
        typeof i.variantId === "string" &&
        typeof i.slug === "string" &&
        typeof i.name?.ar === "string" &&
        typeof i.name?.en === "string" &&
        typeof i.size === "string" &&
        typeof i.color === "string" &&
        Number.isInteger(i.unitPrice) &&
        i.unitPrice >= 0 &&
        Number.isInteger(i.qty) &&
        i.qty >= 1 &&
        Number.isInteger(i.maxQty),
    );
  } catch {
    return [];
  }
}
