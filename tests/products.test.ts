import { describe, expect, it } from "vitest";
import { ageRange, colorToken, toCatalogProduct, type ProductRow } from "@/lib/products";

const row: ProductRow = {
  slug: "big-mouth-tee",
  name_ar: "تيشيرت بيج ماوث",
  name_en: "Big Mouth Tee",
  base_price: 48000,
  display_color: "yellow",
  created_at: "2026-11-01T00:00:00Z",
  product_variants: [{ age_size: "6-7" }, { age_size: "12-14" }, { age_size: "8-9" }, { age_size: "6-7" }],
};

describe("products", () => {
  it("builds the age range from variant sizes", () => {
    expect(ageRange(["6-7", "12-14", "8-9"])).toEqual({ en: "Ages 6–14", ar: "٦–١٤ سنة" });
    expect(ageRange(["2-3", "4-5"])).toEqual({ en: "Ages 2–5", ar: "٢–٥ سنين" });
    expect(ageRange([])).toEqual({ en: "", ar: "" });
  });

  it("maps colour names to brand tokens with a white fallback", () => {
    expect(colorToken("pink")).toBe("var(--color-brand-pink)");
    expect(colorToken("tartan")).toBe("var(--color-paper)");
  });

  it("maps a database row to a catalog product", () => {
    const p = toCatalogProduct(row, new Date("2026-11-11T00:00:00Z"));
    expect(p).toEqual({
      slug: "big-mouth-tee",
      name: { ar: "تيشيرت بيج ماوث", en: "Big Mouth Tee" },
      details: { en: "Ages 6–14", ar: "٦–١٤ سنة" },
      price: 48000,
      color: "var(--color-brand-yellow)",
      isNew: true,
    });
  });

  it("only marks products from the last 30 days as new", () => {
    expect(toCatalogProduct(row, new Date("2026-12-15T00:00:00Z")).isNew).toBe(false);
    expect(toCatalogProduct({ ...row, product_variants: null }, new Date("2026-11-02T00:00:00Z")).details.en).toBe("");
  });
});
