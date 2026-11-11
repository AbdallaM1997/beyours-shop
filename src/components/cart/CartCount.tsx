"use client";

import { useLocale } from "next-intl";
import { itemCount } from "@/lib/cart";
import { useCart } from "./cart-store";

export function CartCount() {
  const locale = useLocale();
  const count = itemCount(useCart());
  return <span aria-live="polite">{new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en").format(count)}</span>;
}
