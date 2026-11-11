import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InfoPage } from "@/components/layout/InfoPage";
import { sizeLabel } from "@/lib/products";
import { sizeChart } from "@/lib/size-guide";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sizeGuide" });
  return { title: `${t("title")} · BeYours` };
}

export default async function SizeGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sizeGuide");
  const num = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en");
  // Height ranges are strings like "92–98"; localise the digits.
  const range = (r: string) => r.split("–").map((n) => num.format(Number(n))).join("–");

  return (
    <InfoPage title={t("title")} intro={t("intro")}>
      <div className="overflow-x-auto rounded-3xl border-[3px] border-ink shadow-sticker-lg">
        <table className="w-full min-w-[480px] text-start">
          <thead className="bg-brand-blue font-display text-paper">
            <tr>
              <th scope="col" className="px-4 py-3 text-start">{t("age")}</th>
              <th scope="col" className="px-4 py-3 text-start">{t("height")}</th>
              <th scope="col" className="px-4 py-3 text-start">{t("chest")}</th>
              <th scope="col" className="px-4 py-3 text-start">{t("length")}</th>
            </tr>
          </thead>
          <tbody>
            {sizeChart.map((row) => (
              <tr key={row.size} className="border-t-2 border-line odd:bg-paper even:bg-mist">
                <th scope="row" className="px-4 py-3 text-start font-display font-semibold">{sizeLabel(row.size)[locale]}</th>
                <td className="px-4 py-3">{range(row.height)}</td>
                <td className="px-4 py-3">{num.format(row.chest)}</td>
                <td className="px-4 py-3">{num.format(row.length)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InfoPage>
  );
}
