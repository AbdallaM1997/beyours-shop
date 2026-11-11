import { colorToken, type CatalogProduct } from "./products";

/** Fallback catalog used when Supabase is not configured or unreachable (local dev without keys). */
export const sampleProducts: CatalogProduct[] = [
  { slug: "thunder-kid-tee", name: { ar: "تيشيرت ثاندر كيد", en: "Thunder Kid Tee" }, details: { ar: "٤–٨ سنين · قطن ١٠٠٪", en: "Ages 4–8 · 100% cotton" }, price: 45000, color: colorToken("white"), isNew: true },
  { slug: "big-mouth-tee", name: { ar: "تيشيرت بيج ماوث", en: "Big Mouth Tee" }, details: { ar: "٦–١٢ سنة · قطن ١٠٠٪", en: "Ages 6–12 · 100% cotton" }, price: 48000, color: colorToken("yellow"), isNew: true },
  { slug: "peace-out-tee", name: { ar: "تيشيرت بيس أوت", en: "Peace Out Tee" }, details: { ar: "٢–٦ سنين · قطن عضوي", en: "Ages 2–6 · organic" }, price: 42000, color: colorToken("pink"), isNew: true },
  { slug: "electric-blue-tee", name: { ar: "تيشيرت إلكتريك بلو", en: "Electric Blue Tee" }, details: { ar: "٨–١٤ سنة · قطن ١٠٠٪", en: "Ages 8–14 · 100% cotton" }, price: 49000, color: colorToken("blue"), isNew: true },
];
