import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/price";
import { colorToken, parseShopFilter, SHOP_FILTERS } from "@/lib/products";
import { listProducts } from "@/server/products";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ c?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return { title: `${t("title")} · BeYours` };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filter = parseShopFilter((await searchParams).c);
  const [t, tn, tp, products] = await Promise.all([
    getTranslations("shop"),
    getTranslations("nav"),
    getTranslations("product"),
    listProducts({ filter }),
  ]);

  const tabs = [{ key: undefined, label: t("all") }, ...SHOP_FILTERS.map((f) => ({ key: f, label: tn(f) }))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-16 md:py-14">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{filter ? tn(filter) : t("title")}</h1>
        <p className="text-muted">{t("subtitle")}</p>
      </header>

      <nav aria-label={t("title")} className="-mx-4 mb-8 flex gap-3 overflow-x-auto px-4 pb-2">
        {tabs.map((tab) => {
          const active = tab.key === filter;
          return (
            <Link
              key={tab.label}
              href={tab.key ? { pathname: "/shop", query: { c: tab.key } } : "/shop"}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border-[3px] border-ink px-5 py-2 font-display font-semibold",
                active ? "bg-brand-blue text-paper shadow-sticker" : "bg-paper",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <p className="mb-4 font-bold text-muted">{t("count", { count: products.length })}</p>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-3xl border-[3px] border-ink bg-mist p-10 text-center">
          <p className="font-display text-2xl font-semibold">{t("empty")}</p>
          <ButtonLink href="/studio">✦ {t("emptyCta")}</ButtonLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              href={`/product/${p.slug}`}
              name={p.name[locale]}
              details={p.details[locale]}
              price={formatPrice(p.price, locale)}
              color={p.color}
              swatches={p.colors.map(colorToken)}
              badge={p.isNew ? tp("new") : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
