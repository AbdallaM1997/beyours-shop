import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InfoPage } from "@/components/layout/InfoPage";
import { formatPrice } from "@/lib/price";
import { listShippingZones } from "@/server/products";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shipping" });
  return { title: `${t("title")} · BeYours` };
}

export default async function ShippingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, zones] = await Promise.all([getTranslations("shipping"), listShippingZones()]);
  const num = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en");
  const days = (d: string) => d.split("-").map((n) => num.format(Number(n))).join("–");

  return (
    <InfoPage title={t("title")} intro={t("intro")}>
      {zones.length === 0 ? (
        <p className="rounded-2xl border-2 border-line bg-mist px-4 py-3 font-bold text-muted">{t("noZones")}</p>
      ) : (
        <div className="overflow-hidden rounded-3xl border-[3px] border-ink shadow-sticker-lg">
          <table className="w-full">
            <thead className="bg-brand-blue font-display text-paper">
              <tr>
                <th scope="col" className="px-4 py-3 text-start">{t("governorate")}</th>
                <th scope="col" className="px-4 py-3 text-start">{t("fee")}</th>
                <th scope="col" className="px-4 py-3 text-start">{t("days")}</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.governorate.en} className="border-t-2 border-line odd:bg-paper even:bg-mist">
                  <th scope="row" className="px-4 py-2.5 text-start font-bold">{z.governorate[locale]}</th>
                  <td className="px-4 py-2.5">{formatPrice(z.fee, locale)}</td>
                  <td className="px-4 py-2.5">{t("daysValue", { days: days(z.days) })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="flex flex-col gap-2 rounded-3xl border-[3px] border-ink bg-brand-lime p-6">
        <h2 className="font-display text-2xl font-bold">{t("customTitle")}</h2>
        <p>{t("customBody")}</p>
      </section>
      <section className="flex flex-col gap-2 rounded-3xl border-[3px] border-ink bg-brand-yellow p-6">
        <h2 className="font-display text-2xl font-bold">{t("returnsTitle")}</h2>
        <p>{t("returnsBody")}</p>
      </section>
    </InfoPage>
  );
}
