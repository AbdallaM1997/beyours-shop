import { describe, expect, it } from "vitest";
import {
  ageRange,
  categoriesFor,
  colorToken,
  findVariant,
  parseShopFilter,
  sizeLabel,
  toCatalogProduct,
  toProductDetail,
  type ProductRow,
} from "@/lib/products";

const row: ProductRow = {
  id: "p1",
  slug: "big-mouth-tee",
  name_ar: "تيشيرت بيج ماوث",
  name_en: "Big Mouth Tee",
  description_ar: null,
  description_en: "Big lips.",
  category: "unisex",
  base_price: 48000,
  display_color: "yellow",
  is_customizable: true,
  created_at: "2026-11-01T00:00:00Z",
  product_variants: [
    { id: "v1", age_size: "12-14", color: "pink", stock: 3 },
    { id: "v2", age_size: "6-7", color: "yellow", stock: 0 },
    { id: "v3", age_size: "8-9", color: "white", stock: 5 },
    { id: "v4", age_size: "6-7", color: "pink", stock: 2 },
  ],
};

describe("products", () => {
  it("builds the age range from variant sizes", () => {
    expect(ageRange(["6-7", "12-14", "8-9"])).toEqual({ en: "Ages 6–14", ar: "٦–١٤ سنة" });
    expect(ageRange(["2-3", "4-5"])).toEqual({ en: "Ages 2–5", ar: "٢–٥ سنين" });
    expect(ageRange([])).toEqual({ en: "", ar: "" });
  });

  it("labels a single size", () => {
    expect(sizeLabel("4-5")).toEqual({ en: "4–5 yrs", ar: "٤–٥ سنين" });
    expect(sizeLabel("12-14").ar).toBe("١٢–١٤ سنة");
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
      colors: ["white", "pink", "yellow"],
      isNew: true,
    });
  });

  it("only marks products from the last 30 days as new", () => {
    expect(toCatalogProduct(row, new Date("2026-12-15T00:00:00Z")).isNew).toBe(false);
    expect(toCatalogProduct({ ...row, product_variants: null }, new Date("2026-11-02T00:00:00Z")).details.en).toBe("");
  });

  it("builds product detail with sizes in age order and finds variants", () => {
    const d = toProductDetail(row);
    expect(d.sizes).toEqual(["6-7", "8-9", "12-14"]);
    expect(d.description).toEqual({ ar: "", en: "Big lips." });
    expect(findVariant(d.variants, "6-7", "pink")?.id).toBe("v4");
    expect(findVariant(d.variants, "6-7", "white")).toBeUndefined();
  });

  it("maps shop filters to categories, showing unisex for boys and girls", () => {
    expect(categoriesFor("boys")).toEqual(["boys", "unisex"]);
    expect(categoriesFor("girls")).toEqual(["girls", "unisex"]);
    expect(categoriesFor("baby")).toEqual(["baby"]);
    expect(parseShopFilter("girls")).toBe("girls");
    expect(parseShopFilter("unisex")).toBeUndefined();
    expect(parseShopFilter(undefined)).toBeUndefined();
  });
});
