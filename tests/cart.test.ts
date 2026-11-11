import { describe, expect, it } from "vitest";
import { addItem, itemCount, MAX_QTY_PER_LINE, parseCart, removeItem, setQty, toPriceLines, type CartItem } from "@/lib/cart";
import { cartSubtotal } from "@/lib/price";

const tee: CartItem = {
  variantId: "v1",
  slug: "thunder-kid-tee",
  name: { ar: "تيشيرت ثاندر كيد", en: "Thunder Kid Tee" },
  size: "4-5",
  color: "white",
  unitPrice: 45000,
  qty: 1,
  maxQty: 20,
};

describe("cart", () => {
  it("adds new lines and merges the same variant", () => {
    let items = addItem([], tee);
    items = addItem(items, { ...tee, qty: 2 });
    items = addItem(items, { ...tee, variantId: "v2", size: "6-7" });
    expect(items.map((i) => [i.variantId, i.qty])).toEqual([["v1", 3], ["v2", 1]]);
    expect(itemCount(items)).toBe(4);
  });

  it("caps quantity at stock and at the per-line limit", () => {
    expect(addItem([], { ...tee, qty: 5, maxQty: 3 })[0].qty).toBe(3);
    expect(setQty([tee], "v1", 99)[0].qty).toBe(MAX_QTY_PER_LINE);
    expect(setQty([tee], "v1", 0)[0].qty).toBe(1);
  });

  it("ignores out-of-stock items", () => {
    expect(addItem([], { ...tee, maxQty: 0 })).toEqual([]);
  });

  it("removes lines", () => {
    expect(removeItem([tee, { ...tee, variantId: "v2" }], "v1").map((i) => i.variantId)).toEqual(["v2"]);
  });

  it("feeds the price helpers", () => {
    expect(cartSubtotal(toPriceLines([{ ...tee, qty: 2 }, { ...tee, variantId: "v2", unitPrice: 48000 }]))).toBe(138000);
  });

  it("parses stored carts defensively", () => {
    expect(parseCart(null)).toEqual([]);
    expect(parseCart("not json")).toEqual([]);
    expect(parseCart('{"a":1}')).toEqual([]);
    expect(parseCart(JSON.stringify([tee, { ...tee, qty: 0 }, { ...tee, unitPrice: 1.5 }, { foo: 1 }]))).toEqual([tee]);
  });
});
