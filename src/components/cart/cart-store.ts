"use client";

import { useSyncExternalStore } from "react";
import { addItem, parseCart, removeItem, setQty, type CartItem } from "@/lib/cart";

const KEY = "beyours-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (items === null) {
    try {
      items = parseCart(window.localStorage.getItem(KEY));
    } catch {
      items = [];
    }
  }
  return items;
}

function write(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode / storage full: keep the in-memory cart for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      items = parseCart(e.newValue);
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Cart lines from localStorage. Empty during server render and hydration. */
export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const cart = {
  add: (item: CartItem) => write(addItem(read(), item)),
  setQty: (variantId: string, qty: number) => write(setQty(read(), variantId, qty)),
  remove: (variantId: string) => write(removeItem(read(), variantId)),
};
