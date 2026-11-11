import type { Piasters } from "./price";

export type Localized = { ar: string; en: string };

export const CATEGORIES = ["boys", "girls", "baby", "unisex"] as const;
export type Category = (typeof CATEGORIES)[number];

/** Shop filters shown to customers. Unisex tees appear under both boys and girls. */
export const SHOP_FILTERS = ["boys", "girls", "baby"] as const;
export type ShopFilter = (typeof SHOP_FILTERS)[number];

export function categoriesFor(filter: ShopFilter): Category[] {
  if (filter === "baby") return ["baby"];
  return [filter, "unisex"];
}

export function parseShopFilter(value: unknown): ShopFilter | undefined {
  return SHOP_FILTERS.find((f) => f === value);
}

/** Age sizes in display order (matches the DB check constraint). */
export const AGE_SIZES = ["2-3", "4-5", "6-7", "8-9", "10-11", "12-14"] as const;

/** Product as shown on cards (Home "New drop", shop grid). */
export type CatalogProduct = {
  slug: string;
  name: Localized;
  details: Localized;
  price: Piasters;
  /** CSS colour for the tee thumbnail (a brand token). */
  color: string;
  /** Available colour names, in display order. */
  colors: string[];
  isNew?: boolean;
};

export type Variant = { id: string; size: string; color: string; stock: number };

export type ProductDetail = CatalogProduct & {
  id: string;
  category: Category;
  description: Localized;
  isCustomizable: boolean;
  sizes: string[];
  variants: Variant[];
};

/** Row shape returned by `products` select with nested `product_variants`. */
export type ProductRow = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  category: Category;
  base_price: number;
  display_color: string;
  is_customizable: boolean;
  created_at: string;
  product_variants: { id: string; age_size: string; color: string; stock: number }[] | null;
};

export const PRODUCT_SELECT =
  "id, slug, name_ar, name_en, description_ar, description_en, category, base_price, display_color, is_customizable, created_at, product_variants(id, age_size, color, stock)";

/** Variant colour names (DB) → brand tokens. */
const colorTokens: Record<string, string> = {
  white: "var(--color-paper)",
  blue: "var(--color-brand-blue-light)",
  pink: "var(--color-brand-pink)",
  yellow: "var(--color-brand-yellow)",
  lime: "var(--color-brand-lime)",
  black: "var(--color-ink)",
};
const COLOR_ORDER = Object.keys(colorTokens);

export function colorToken(name: string): string {
  return colorTokens[name] ?? colorTokens.white;
}

export const NEW_PRODUCT_DAYS = 30;

const arDigits = new Intl.NumberFormat("ar-EG");

/** Arabic counted noun for years: 3–10 takes "سنين", 11+ takes "سنة". */
function arYears(max: number) {
  return max <= 10 ? "سنين" : "سنة";
}

/** "Ages 2–8" / "٢–٨ سنين" from variant sizes like "2-3", "6-7". Empty when there are no sizes. */
export function ageRange(sizes: string[]): Localized {
  const bounds = sizes.flatMap((s) => s.split("-").map(Number)).filter(Number.isFinite);
  if (bounds.length === 0) return { ar: "", en: "" };
  const min = Math.min(...bounds);
  const max = Math.max(...bounds);
  return { en: `Ages ${min}–${max}`, ar: `${arDigits.format(min)}–${arDigits.format(max)} ${arYears(max)}` };
}

/** Label for one size button: "4–5 yrs" / "٤–٥ سنين". */
export function sizeLabel(size: string): Localized {
  const [min, max] = size.split("-").map(Number);
  return { en: `${min}–${max} yrs`, ar: `${arDigits.format(min)}–${arDigits.format(max)} ${arYears(max)}` };
}

function uniqueOrdered(values: string[], order: readonly string[]) {
  const rank = (v: string) => (order.indexOf(v) === -1 ? order.length : order.indexOf(v));
  return [...new Set(values)].sort((a, b) => rank(a) - rank(b));
}

export function toCatalogProduct(row: ProductRow, now: Date = new Date()): CatalogProduct {
  const variants = row.product_variants ?? [];
  const ageMs = now.getTime() - new Date(row.created_at).getTime();
  return {
    slug: row.slug,
    name: { ar: row.name_ar, en: row.name_en },
    details: ageRange(variants.map((v) => v.age_size)),
    price: row.base_price,
    color: colorToken(row.display_color),
    colors: uniqueOrdered(variants.map((v) => v.color), COLOR_ORDER),
    isNew: ageMs >= 0 && ageMs <= NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000,
  };
}

export function toProductDetail(row: ProductRow, now: Date = new Date()): ProductDetail {
  const variants = (row.product_variants ?? []).map((v) => ({ id: v.id, size: v.age_size, color: v.color, stock: v.stock }));
  return {
    ...toCatalogProduct(row, now),
    id: row.id,
    category: row.category,
    description: { ar: row.description_ar ?? "", en: row.description_en ?? "" },
    isCustomizable: row.is_customizable,
    sizes: uniqueOrdered(variants.map((v) => v.size), AGE_SIZES),
    variants,
  };
}

export function findVariant(variants: Variant[], size: string, color: string): Variant | undefined {
  return variants.find((v) => v.size === size && v.color === color);
}
