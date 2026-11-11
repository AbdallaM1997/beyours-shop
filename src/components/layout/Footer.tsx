import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Item = { label: string; href?: string };

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const cols: { title: string; items: Item[] }[] = [
    {
      title: t("shop"),
      items: [
        { label: nav("boys"), href: "/shop?c=boys" },
        { label: nav("girls"), href: "/shop?c=girls" },
        { label: nav("baby"), href: "/shop?c=baby" },
      ],
    },
    {
      title: t("help"),
      items: [
        { label: t("sizeGuide"), href: "/size-guide" },
        { label: t("shipping"), href: "/shipping" },
        { label: t("faq"), href: "/faq" },
        // TODO: link to the BeYours WhatsApp number once it's confirmed.
        { label: t("whatsapp") },
      ],
    },
    { title: t("payWith"), items: [{ label: t("cod") }, { label: t("cards") }, { label: t("wallets") }] },
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
            {c.items.map((i) =>
              i.href ? (
                <Link key={i.label} href={i.href} className="text-sm hover:underline">{i.label}</Link>
              ) : (
                <span key={i.label} className="text-sm">{i.label}</span>
              ),
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
