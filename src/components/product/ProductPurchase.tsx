"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { cart } from "@/components/cart/cart-store";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TeeShape } from "@/components/ui/TeeShape";
import { cn } from "@/lib/cn";
import { MAX_QTY_PER_LINE } from "@/lib/cart";
import { formatPrice } from "@/lib/price";
import { colorToken, findVariant, sizeLabel, type ProductDetail } from "@/lib/products";
import type { Locale } from "@/i18n/routing";

export function ProductPurchase({ product }: { product: ProductDetail }) {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const defaultColor = product.colors.find((c) => colorToken(c) === product.color) ?? product.colors[0] ?? "white";

  const [color, setColor] = useState(defaultColor);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = size ? findVariant(product.variants, size, color) : undefined;
  const stockOf = (s: string) => findVariant(product.variants, s, color)?.stock ?? 0;
  const maxQty = Math.min(MAX_QTY_PER_LINE, variant?.stock ?? MAX_QTY_PER_LINE);

  function pickColor(c: string) {
    setColor(c);
    setAdded(false);
    // Keep the size only if it's still in stock in the new colour.
    if (size && (findVariant(product.variants, size, c)?.stock ?? 0) < 1) setSize(null);
  }

  function addToCart() {
    if (!variant || variant.stock < 1) return;
    cart.add({
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      size: variant.size,
      color: variant.color,
      unitPrice: product.price,
      qty: Math.min(qty, maxQty),
      maxQty: variant.stock,
    });
    setAdded(true);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-14">
      <div className="relative aspect-square rounded-3xl border-[3px] border-ink bg-mist shadow-sticker-lg">
        {product.isNew && <Badge className="absolute start-4 top-4 z-10 text-base">{t("new")}</Badge>}
        <TeeShape color={colorToken(color)} className="absolute inset-[12%]" />
        <Image src="/brand/bolt.png" alt="" width={70} height={118} className="absolute left-1/2 top-[36%] w-[16%] -translate-x-1/2" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{product.name[locale]}</h1>
          <p className="font-display text-3xl font-bold text-brand-pink">{formatPrice(product.price, locale)}</p>
          {product.description[locale] && <p className="text-lg text-muted">{product.description[locale]}</p>}
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 font-extrabold">
            {t("color")}: <span className="font-normal">{t(`colors.${color}` as "colors.white")}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickColor(c)}
                aria-pressed={c === color}
                aria-label={t(`colors.${c}` as "colors.white")}
                className={cn(
                  "size-11 rounded-full border-[3px] border-ink transition-transform",
                  c === color ? "scale-110 shadow-sticker ring-2 ring-brand-pink ring-offset-2" : "hover:scale-105",
                )}
                style={{ background: colorToken(c) }}
              />
            ))}
          </div>
        </fieldset>

        <div role="group" aria-labelledby="size-label" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span id="size-label" className="font-extrabold">{t("size")}</span>
            <Link href="/size-guide" className="font-bold text-brand-pink underline">{t("sizeGuide")}</Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {product.sizes.map((s) => {
              const out = stockOf(s) < 1;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={out}
                  onClick={() => {
                    setSize(s);
                    setAdded(false);
                  }}
                  aria-pressed={s === size}
                  className={cn(
                    "rounded-2xl border-[3px] border-ink px-2 py-2.5 font-display font-semibold",
                    s === size ? "bg-brand-yellow shadow-sticker" : "bg-paper",
                    out && "cursor-not-allowed border-line text-muted line-through",
                  )}
                >
                  {sizeLabel(s)[locale]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="font-extrabold">{t("qty")}</span>
          <QtyStepper value={Math.min(qty, maxQty)} max={maxQty} onChange={setQty} />
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={addToCart} disabled={!variant || variant.stock < 1} className="w-full">
            {!size ? t("chooseSize") : variant && variant.stock > 0 ? t("addToCart") : t("outOfStock")}
          </Button>
          {added && (
            <p role="status" className="flex items-center justify-between rounded-2xl border-2 border-ink bg-brand-lime px-4 py-3 font-bold">
              {t("added")}
              <Link href="/cart" className="underline">{t("viewCart")}</Link>
            </p>
          )}
          <p className="text-sm text-muted">{t("codNote")}</p>
        </div>
      </div>
    </div>
  );
}
