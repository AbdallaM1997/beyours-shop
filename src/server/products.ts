import "server-only";
import { createClient } from "@supabase/supabase-js";
import {
  categoriesFor,
  PRODUCT_SELECT,
  toCatalogProduct,
  toProductDetail,
  type CatalogProduct,
  type ProductDetail,
  type ProductRow,
  type ShopFilter,
} from "@/lib/products";
import { sampleRows } from "@/lib/sample-products";

/**
 * Cookie-less anon client for public catalog reads (RLS applies: active products only).
 * Not tied to a user session, so pages using it can be statically rendered and revalidated.
 */
export function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function sampleList(filter?: ShopFilter, limit?: number) {
  const cats = filter ? categoriesFor(filter) : undefined;
  const rows = sampleRows.filter((r) => !cats || cats.includes(r.category));
  return rows.slice(0, limit ?? rows.length);
}

/** Active products, newest first. Falls back to sample data without Supabase. */
export async function listProducts(opts: { filter?: ShopFilter; limit?: number } = {}): Promise<CatalogProduct[]> {
  const supabase = publicClient();
  if (!supabase) return sampleList(opts.filter, opts.limit).map((r) => toCatalogProduct(r));

  let query = supabase.from("products").select(PRODUCT_SELECT).eq("is_active", true).order("created_at", { ascending: false });
  if (opts.filter) query = query.in("category", categoriesFor(opts.filter));
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query.returns<ProductRow[]>();
  if (error) {
    console.error("listProducts: falling back to sample products", error.message);
    return sampleList(opts.filter, opts.limit).map((r) => toCatalogProduct(r));
  }
  return data.map((row) => toCatalogProduct(row));
}

/** Newest active products for the Home "New drop" row. */
export function getNewDrop(limit = 4) {
  return listProducts({ limit });
}

/** One active product with its variants, or null when it doesn't exist. */
export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const supabase = publicClient();
  const sample = () => {
    const row = sampleRows.find((r) => r.slug === slug);
    return row ? toProductDetail(row) : null;
  };
  if (!supabase) return sample();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle<ProductRow>();
  if (error) {
    console.error("getProduct: falling back to sample products", error.message);
    return sample();
  }
  return data ? toProductDetail(data) : null;
}

export type ShippingZone = { governorate: { ar: string; en: string }; fee: number; days: string };

/** Shipping fees per governorate (public table). Empty without Supabase. */
export async function listShippingZones(): Promise<ShippingZone[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("shipping_zones")
    .select("governorate_ar, governorate_en, fee, days")
    .order("fee")
    .order("governorate_en");
  if (error) {
    console.error("listShippingZones", error.message);
    return [];
  }
  return data.map((z) => ({ governorate: { ar: z.governorate_ar, en: z.governorate_en }, fee: z.fee, days: z.days }));
}
