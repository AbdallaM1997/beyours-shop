import { describe, expect, it } from "vitest";
import { cartSubtotal, formatPrice, orderTotal } from "@/lib/price";

describe("price", () => {
  it("adds custom print price per unit", () => {
    expect(cartSubtotal([{ unitPrice: 45000, qty: 2 }, { unitPrice: 45000, qty: 1, customPrint: 15000 }])).toBe(150000);
  });

  it("adds shipping to the total", () => {
    expect(orderTotal([{ unitPrice: 48000, qty: 1 }], 6000)).toBe(54000);
  });

  it("rejects bad quantities", () => {
    expect(() => cartSubtotal([{ unitPrice: 1000, qty: 0 }])).toThrow();
    expect(() => cartSubtotal([{ unitPrice: 1000, qty: 1.5 }])).toThrow();
  });

  it("formats EGP in both locales", () => {
    expect(formatPrice(45000, "en")).toMatch(/450/);
    expect(formatPrice(45000, "ar")).toMatch(/٤٥٠|450/);
  });
});
