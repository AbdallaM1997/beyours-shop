"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TeeShape } from "@/components/ui/TeeShape";
import { MAX_QTY_PER_LINE, toPriceLines } from "@/lib/cart";
import { cartSubtotal, formatPrice } from "@/lib/price";
import { colorToken, sizeLabel } from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import { cart, useCart } from "./cart-store";
import { QtyStepper } from "./QtyStepper";

const noop = () => () => {};

export function CartView() {
  const t = useTranslations("cart");
  const tp = useTranslations("product");
  const locale = useLocale() as Locale;
  const items = useCart();
  // The cart lives in localStorage, so render nothing cart-specific until hydrated.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  if (!hydrated) return <div className="min-h-64" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border-[3px] border-ink bg-mist p-10 text-center">
        <TeeShape color="var(--color-paper)" className="w-32" />
        <p className="font-display text-2xl font-semibold">{t("empty")}</p>
        <ButtonLink href="/shop">{t("emptyCta")}</ButtonLink>
      </div>
    );
  }

  const subtotal = cartSubtotal(toPriceLines(items));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="flex flex-col gap-4">
        {items.map((i) => (
          <li key={i.variantId} className="flex gap-4 rounded-3xl border-[3px] border-ink bg-paper p-4 shadow-sticker">
            <Link href={`/product/${i.slug}`} className="relative size-24 shrink-0 rounded-2xl bg-mist">
              <TeeShape color={colorToken(i.color)} className="absolute inset-[12%]" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/product/${i.slug}`} className="font-display text-lg font-semibold">{i.name[locale]}</Link>
                <span className="shrink-0 font-display text-lg font-bold text-brand-pink">{formatPrice(i.unitPrice * i.qty, locale)}</span>
              </div>
              <p className="text-sm text-muted">
                {t("size")}: {sizeLabel(i.size)[locale]} · {t("color")}: {tp(`colors.${i.color}` as "colors.white")}
              </p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                <QtyStepper value={i.qty} max={Math.min(MAX_QTY_PER_LINE, i.maxQty)} onChange={(q) => cart.setQty(i.variantId, q)} />
                <button type="button" onClick={() => cart.remove(i.variantId)} className="font-bold text-muted underline">
                  {t("remove")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="flex h-fit flex-col gap-4 rounded-3xl border-[3px] border-ink bg-brand-yellow p-6 shadow-sticker-lg">
        <div className="flex items-center justify-between font-display text-2xl font-bold">
          <span>{t("subtotal")}</span>
          <span>{formatPrice(subtotal, locale)}</span>
        </div>
        <p className="text-sm">{t("shippingNote")}</p>
        {/* Checkout, Paymob and COD arrive in M3. */}
        <Button disabled className="w-full">{t("checkout")}</Button>
        <p className="text-center text-sm font-bold">{t("checkoutSoon")}</p>
        <Link href="/shop" className="text-center font-bold underline">{t("continue")}</Link>
      </aside>
    </div>
  );
}
