import type { Piasters } from "./price";

/** Product as shown on cards (Home "New drop", shop grid). */
export type CatalogProduct = {
  slug: string;
  name: { ar: string; en: string };
  details: { ar: string; en: string };
  price: Piasters;
  /** CSS colour for the tee thumbnail (a brand token). */
  color: string;
  isNew?: boolean;
};

/** Row shape returned by `products` select with nested `product_variants`. */
export type ProductRow = {
  slug: string;
  name_ar: string;
  name_en: string;
  base_price: number;
  display_color: string;
  created_at: string;
  product_variants: { age_size: string }[] | null;
};

/** Variant colour names (DB) → brand tokens. */
const colorTokens: Record<string, string> = {
  white: "var(--color-paper)",
  blue: "var(--color-brand-blue-light)",
  pink: "var(--color-brand-pink)",
  yellow: "var(--color-brand-yellow)",
  lime: "var(--color-brand-lime)",
  black: "var(--color-ink)",
};

export function colorToken(name: string): string {
  return colorTokens[name] ?? colorTokens.white;
}

export const NEW_PRODUCT_DAYS = 30;

/** "Ages 2–8" / "٢–٨ سنين" from variant sizes like "2-3", "6-7". Empty when there are no sizes. */
export function ageRange(sizes: string[]): { ar: string; en: string } {
  const bounds = sizes.flatMap((s) => s.split("-").map(Number)).filter(Number.isFinite);
  if (bounds.length === 0) return { ar: "", en: "" };
  const min = Math.min(...bounds);
  const max = Math.max(...bounds);
  const ar = new Intl.NumberFormat("ar-EG");
  // Arabic plural: 3–10 takes "سنين", 11+ takes "سنة".
  const years = max <= 10 ? "سنين" : "سنة";
  return { en: `Ages ${min}–${max}`, ar: `${ar.format(min)}–${ar.format(max)} ${years}` };
}

export function toCatalogProduct(row: ProductRow, now: Date = new Date()): CatalogProduct {
  const ageMs = now.getTime() - new Date(row.created_at).getTime();
  return {
    slug: row.slug,
    name: { ar: row.name_ar, en: row.name_en },
    details: ageRange((row.product_variants ?? []).map((v) => v.age_size)),
    price: row.base_price,
    color: colorToken(row.display_color),
    isNew: ageMs >= 0 && ageMs <= NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000,
  };
}
