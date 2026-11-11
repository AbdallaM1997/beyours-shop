import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { TeeShape } from "@/components/ui/TeeShape";
import { formatPrice } from "@/lib/price";
import type { Locale } from "@/i18n/routing";

// Internal component gallery for checking tokens and shared UI in both locales (LTR + RTL).
// Not available in production builds.
export const metadata = { title: "BeYours UI", robots: { index: false } };

const colors = [
  { name: "brand-blue", cls: "bg-brand-blue" },
  { name: "brand-blue-light", cls: "bg-brand-blue-light" },
  { name: "brand-pink", cls: "bg-brand-pink" },
  { name: "brand-yellow", cls: "bg-brand-yellow" },
  { name: "brand-lime", cls: "bg-brand-lime" },
  { name: "ink", cls: "bg-ink" },
  { name: "paper", cls: "bg-paper" },
  { name: "mist", cls: "bg-mist" },
  { name: "muted", cls: "bg-muted" },
  { name: "line", cls: "bg-line" },
];

// TeeShape takes a raw fill, so read it from the CSS tokens.
const teeColors = [
  "var(--color-paper)",
  "var(--color-brand-blue-light)",
  "var(--color-brand-pink)",
  "var(--color-brand-yellow)",
  "var(--color-brand-lime)",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-b-2 border-line py-8">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default async function DevUiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-16">
      <h1 className="font-display text-4xl font-bold">UI components</h1>
      <p className="text-muted">
        Locale: <b>{locale}</b> · direction: <b>{locale === "ar" ? "rtl" : "ltr"}</b>. Switch language in the nav to check RTL.
      </p>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {colors.map((c) => (
            <div key={c.name} className="flex flex-col gap-1.5">
              <span className={`h-16 rounded-2xl border-[3px] border-ink ${c.cls}`} />
              <code className="text-sm">{c.name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <p className="font-display text-5xl font-bold">Wear your own idea. · البس فكرتك</p>
        <p className="font-display text-2xl font-semibold">Display 600 — Fredoka / Baloo Bhaijaan 2</p>
        <p>Body 400 — Nunito / Cairo. تيشيرتات جريئة للأطفال من ٢ لـ ١٤ سنة.</p>
        <p className="font-extrabold">Body 800 — extra bold</p>
        <p className="text-muted">Muted text</p>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="yellow">Yellow</Button>
          <Button disabled>Disabled</Button>
          <ButtonLink href="/studio">✦ Link button</ButtonLink>
        </div>
      </Section>

      <Section title="Badges & shadows">
        <div className="flex flex-wrap items-center gap-6">
          <Badge>NEW</Badge>
          <Badge className="bg-brand-lime">جديد</Badge>
          <Badge className="bg-brand-pink text-paper">SALE</Badge>
          <span className="rounded-2xl border-[3px] border-ink bg-paper px-4 py-3 shadow-sticker">shadow-sticker</span>
          <span className="rounded-2xl border-[3px] border-ink bg-paper px-4 py-3 shadow-sticker-lg">shadow-sticker-lg</span>
        </div>
      </Section>

      <Section title="TeeShape">
        <div className="flex flex-wrap gap-4">
          {teeColors.map((c) => (
            <div key={c} className="w-28 rounded-2xl bg-mist p-3">
              <TeeShape color={c} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="ProductCard">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard href="/product/thunder-kid-tee" name="Thunder Kid Tee" details="Ages 4–8 · 100% cotton" price={formatPrice(45000, locale)} color="var(--color-paper)" badge="NEW" />
          <ProductCard href="/product/peace-out-tee" name="تيشيرت بيس أوت" details="٢–٦ سنين · قطن عضوي" price={formatPrice(42050, locale)} color="var(--color-brand-pink)" />
        </div>
      </Section>
    </div>
  );
}
