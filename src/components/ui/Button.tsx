import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "yellow";

const variants: Record<Variant, string> = {
  primary: "bg-brand-pink text-paper",
  secondary: "bg-paper text-ink",
  yellow: "bg-brand-yellow text-ink",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-ink px-7 py-3.5 font-display text-lg font-semibold shadow-sticker transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50";

export function Button({ variant = "primary", className, ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({ variant = "primary", className, ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
