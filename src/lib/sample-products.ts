import { AGE_SIZES, type Category, type ProductRow } from "./products";

/** Fallback catalog used when Supabase is not configured or unreachable (local dev without keys). */
type Sample = Omit<ProductRow, "id" | "created_at" | "product_variants" | "is_customizable"> & { sizes: readonly string[] };

const samples: Sample[] = [
  { slug: "thunder-kid-tee", name_ar: "تيشيرت ثاندر كيد", name_en: "Thunder Kid Tee", description_ar: "قطن ١٠٠٪ وطبعة صاعقة جريئة.", description_en: "100% cotton with a bold lightning-bolt print.", category: "boys" as Category, base_price: 45000, display_color: "white", sizes: ["4-5", "6-7", "8-9"] },
  { slug: "big-mouth-tee", name_ar: "تيشيرت بيج ماوث", name_en: "Big Mouth Tee", description_ar: "قطن ١٠٠٪ وطبعة شفايف كبيرة.", description_en: "100% cotton with a big-lips print.", category: "unisex" as Category, base_price: 48000, display_color: "yellow", sizes: ["6-7", "8-9", "10-11", "12-14"] },
  { slug: "peace-out-tee", name_ar: "تيشيرت بيس أوت", name_en: "Peace Out Tee", description_ar: "قطن عضوي ناعم لأصغر الأبطال.", description_en: "Soft organic cotton for the littlest ones.", category: "girls" as Category, base_price: 42000, display_color: "pink", sizes: ["2-3", "4-5", "6-7"] },
  { slug: "electric-blue-tee", name_ar: "تيشيرت إلكتريك بلو", name_en: "Electric Blue Tee", description_ar: "قطن ١٠٠٪ بلون أزرق كهربائي.", description_en: "100% cotton in electric blue.", category: "boys" as Category, base_price: 49000, display_color: "blue", sizes: ["8-9", "10-11", "12-14"] },
];

const createdAt = new Date().toISOString();
const colors = ["white", "blue", "pink", "yellow"];

export const sampleRows: ProductRow[] = samples.map(({ sizes, ...s }) => ({
  ...s,
  id: `sample-${s.slug}`,
  is_customizable: true,
  created_at: createdAt,
  product_variants: AGE_SIZES.filter((size) => sizes.includes(size)).flatMap((size) =>
    colors.map((color) => ({ id: `sample-${s.slug}-${size}-${color}`, age_size: size, color, stock: 20 })),
  ),
}));
