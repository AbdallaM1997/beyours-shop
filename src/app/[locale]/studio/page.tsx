import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { TeeShape } from "@/components/ui/TeeShape";

// Placeholder for milestone M4: Fabric.js editor, Nano Banana generation, 3D preview.
export default function StudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <Studio />;
}

function Studio() {
  const t = useTranslations("studio");
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center">
      <h1 className="font-display text-5xl font-bold">{t("title")}</h1>
      <p className="text-lg text-muted">{t("subtitle")}</p>
      <TeeShape color="#3417c9" className="w-64" />
      <p className="rounded-full border-2 border-line bg-mist px-4 py-2 font-bold text-muted">{t("comingSoon")}</p>
    </section>
  );
}
