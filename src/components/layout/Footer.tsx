import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const cols = [
    { title: t("shop"), items: [nav("boys"), nav("girls"), nav("baby")] },
    { title: t("help"), items: [t("sizeGuide"), t("shipping"), t("faq"), t("whatsapp")] },
    { title: t("payWith"), items: [t("cod"), t("cards"), t("wallets")] },
  ];
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-16">
        <div className="flex flex-col gap-4">
          <Image src="/brand/logo.png" alt="BeYours" width={170} height={51} />
          <p className="text-sm">{t("tagline")}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="flex flex-col gap-2.5">
            <h3 className="font-display text-lg font-semibold text-brand-yellow">{c.title}</h3>
            {c.items.map((i) => (
              <span key={i} className="text-sm">{i}</span>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
