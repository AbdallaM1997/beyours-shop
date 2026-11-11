import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { TeeShape } from "@/components/ui/TeeShape";
import { formatPrice } from "@/lib/price";
import { sampleProducts } from "@/lib/sample-products";
import type { Locale } from "@/i18n/routing";

export default function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <Home />;
}

function Home() {
  const t = useTranslations("home");
  const tp = useTranslations("product");
  const locale = useLocale() as Locale;

  const categories = [
    { title: t("categories.boys"), sub: t("categories.ages414"), href: "/shop?c=boys", cls: "bg-brand-blue text-paper" },
    { title: t("categories.girls"), sub: t("categories.ages414"), href: "/shop?c=girls", cls: "bg-brand-pink text-paper" },
    { title: t("categories.baby"), sub: t("categories.ages24"), href: "/shop?c=baby", cls: "bg-brand-yellow" },
    { title: t("categories.custom"), sub: t("categories.studio"), href: "/studio", cls: "bg-brand-lime" },
  ];
  const steps = [
    { n: 1, title: t("steps.s1Title"), body: t("steps.s1Body") },
    { n: 2, title: t("steps.s2Title"), body: t("steps.s2Body") },
    { n: 3, title: t("steps.s3Title"), body: t("steps.s3Body") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-sunburst overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-16 md:py-24">
          <div className="flex flex-col items-start gap-6">
            <span className="-rotate-3 rounded-md bg-brand-pink px-3.5 py-1.5 font-display font-bold text-paper">{t("tag")}</span>
            <h1 className="font-display text-5xl font-bold leading-[0.95] text-paper md:text-7xl">{t("title")}</h1>
            <p className="max-w-md text-lg text-paper md:text-xl">{t("subtitle")}</p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/shop">{t("shopCta")}</ButtonLink>
              <ButtonLink href="/studio" variant="secondary">✦ {t("studioCta")}</ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <TeeShape className="absolute inset-[6%]" />
            <Image src="/brand/peace-hand.png" alt="" width={170} height={117} className="absolute left-1/2 top-[40%] -translate-x-1/2 -rotate-6" />
            <Image src="/brand/bolt.png" alt="" width={70} height={118} className="absolute start-0 top-0 rotate-12" />
            <Image src="/brand/lips.png" alt="" width={110} height={87} className="absolute end-0 top-4" />
            <span className="absolute bottom-2 start-0 rotate-3 rounded-2xl border-[3px] border-ink bg-paper px-4 py-3 font-display font-semibold shadow-sticker-lg">
              <span className="text-brand-pink">✦</span> {t("promptBubble")}
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pt-14 md:grid-cols-4 md:gap-6 md:px-16">
        {categories.map((c) => (
          <Link key={c.href} href={c.href} className={`rounded-[22px] border-[3px] border-ink p-6 shadow-sticker-lg ${c.cls}`}>
            <span className="block font-display text-2xl font-bold md:text-3xl">{c.title}</span>
            <span className="font-bold">{c.sub} →</span>
          </Link>
        ))}
      </section>

      {/* New drop */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-16">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="font-display text-4xl font-bold">{t("newDrop")} ⚡</h2>
          <Link href="/shop" className="font-extrabold text-brand-pink">{t("viewAll")} →</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sampleProducts.map((p) => (
            <ProductCard
              key={p.slug}
              href={`/product/${p.slug}`}
              name={p.name[locale]}
              details={p.details[locale]}
              price={formatPrice(p.price, locale)}
              color={p.color}
              badge={p.isNew ? tp("new") : undefined}
            />
          ))}
        </div>
      </section>

      {/* How custom works */}
      <section className="bg-brand-yellow">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 md:px-16">
          <h2 className="text-center font-display text-4xl font-bold">{t("howTitle")}</h2>
          <div className="grid w-full gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-start gap-3 rounded-3xl border-[3px] border-ink bg-paper p-7 shadow-sticker-lg">
                <span className="rounded-full border-2 border-ink bg-brand-pink px-3.5 py-0.5 font-display text-xl font-bold text-paper">{s.n}</span>
                <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                <p className="text-muted">{s.body}</p>
              </div>
            ))}
          </div>
          <ButtonLink href="/studio">{t("startDesigning")}</ButtonLink>
        </div>
      </section>
    </>
  );
}
