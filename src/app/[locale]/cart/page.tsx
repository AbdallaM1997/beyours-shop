import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CartView } from "@/components/cart/CartView";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  return { title: `${t("title")} · BeYours`, robots: { index: false } };
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-16 md:py-14">
      <h1 className="mb-8 font-display text-4xl font-bold md:text-5xl">{t("title")}</h1>
      <CartView />
    </div>
  );
}
