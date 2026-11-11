"use client";

import { useLocale, useTranslations } from "next-intl";

/** − qty + control. Clamps to 1..max. */
export function QtyStepper({ value, max, onChange }: { value: number; max: number; onChange: (qty: number) => void }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const btn =
    "grid size-10 place-items-center rounded-full border-[3px] border-ink bg-paper font-display text-xl font-bold disabled:opacity-40";
  return (
    <div className="inline-flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t("decrease")}>
        −
      </button>
      <span className="min-w-6 text-center font-display text-xl font-bold" aria-live="polite">
        {new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en").format(value)}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t("increase")}>
        +
      </button>
    </div>
  );
}
