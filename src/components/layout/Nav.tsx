import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CartCount } from "@/components/cart/CartCount";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Nav() {
  const t = useTranslations("nav");
  return (
    <header className="bg-brand-blue">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-16">
        <Link href="/" aria-label="BeYours home">
          <Image src="/brand/logo.png" alt="BeYours" width={150} height={45} priority />
        </Link>
        <ul className="hidden items-center gap-8 font-bold text-paper lg:flex">
          <li><Link href="/shop">{t("shop")}</Link></li>
          <li><Link href="/shop?c=boys">{t("boys")}</Link></li>
          <li><Link href="/shop?c=girls">{t("girls")}</Link></li>
          <li><Link href="/shop?c=baby">{t("baby")}</Link></li>
          <li>
            <Link href="/studio" className="rounded-full border-2 border-ink bg-brand-lime px-3 py-1.5 font-display font-semibold text-ink">
              ✦ {t("studio")}
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-5">
          <LocaleSwitcher />
          <Link href="/account" className="hidden font-bold text-paper sm:inline">{t("account")}</Link>
          <Link href="/cart" className="rounded-full border-2 border-ink bg-brand-yellow px-4 py-2 font-display font-semibold shadow-[3px_3px_0_#000]">
            {t("cart")} · <CartCount />
          </Link>
        </div>
      </nav>
    </header>
  );
}
