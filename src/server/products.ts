import "server-only";
import { createClient } from "@supabase/supabase-js";
import { toCatalogProduct, type CatalogProduct, type ProductRow } from "@/lib/products";
import { sampleProducts } from "@/lib/sample-products";

/**
 * Cookie-less anon client for public catalog reads (RLS applies: active products only).
 * Not tied to a user session, so pages using it can be statically rendered and revalidated.
 */
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Newest active products for the Home "New drop" row. Falls back to sample data without Supabase. */
export async function getNewDrop(limit = 4): Promise<CatalogProduct[]> {
  const supabase = publicClient();
  if (!supabase) return sampleProducts.slice(0, limit);

  const { data, error } = await supabase
    .from("products")
    .select("slug, name_ar, name_en, base_price, display_color, created_at, product_variants(age_size)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<ProductRow[]>();

  if (error) {
    console.error("getNewDrop: falling back to sample products", error.message);
    return sampleProducts.slice(0, limit);
  }
  return data.map((row) => toCatalogProduct(row));
}
