import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InfoPage } from "@/components/layout/InfoPage";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

const QUESTIONS = [1, 2, 3, 4, 5, 6] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: `${t("title")} · BeYours` };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <InfoPage title={t("title")}>
      <div className="flex flex-col gap-4">
        {QUESTIONS.map((n) => (
          <details key={n} className="group rounded-3xl border-[3px] border-ink bg-paper shadow-sticker open:bg-mist">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-lg font-semibold">
              {t(`items.q${n}`)}
              <span aria-hidden="true" className="text-2xl text-brand-pink transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-5 pb-5">{t(`items.a${n}`)}</p>
          </details>
        ))}
      </div>
    </InfoPage>
  );
}
