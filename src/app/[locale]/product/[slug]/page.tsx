import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { getProduct } from "@/server/products";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// Pages are rendered on first visit and refreshed at most every 5 minutes.
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return { title: `${product.name[locale]} · BeYours`, description: product.description[locale] || undefined };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProduct(slug);
  if (!product) notFound();
  const t = await getTranslations("product");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-16 md:py-14">
      <ProductPurchase product={product} />

      {product.isCustomizable && (
        <section className="mt-14 flex flex-col items-start gap-4 rounded-3xl border-[3px] border-ink bg-brand-lime p-7 shadow-sticker-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">{t("designTitle")}</h2>
            <p>{t("designBody")}</p>
          </div>
          <ButtonLink href="/studio" variant="secondary">✦ {t("designCta")}</ButtonLink>
        </section>
      )}
    </div>
  );
}
