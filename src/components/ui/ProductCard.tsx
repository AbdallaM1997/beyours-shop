import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Badge } from "./Badge";
import { TeeShape } from "./TeeShape";

export function ProductCard(props: {
  href: string;
  name: string;
  details: string;
  price: string;
  color: string;
  /** Swatch colours (CSS values) for the available colours. */
  swatches?: string[];
  badge?: string;
}) {
  return (
    <Link
      href={props.href}
      className="flex flex-col gap-2 rounded-[22px] border-[3px] border-ink bg-paper p-3.5 shadow-sticker-lg transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[272/250] rounded-2xl bg-mist">
        {props.badge && <Badge className="absolute start-3 top-3">{props.badge}</Badge>}
        <TeeShape color={props.color} className="absolute inset-x-[17%] top-[10%] h-[80%] w-[66%]" />
        <Image src="/brand/bolt.png" alt="" width={34} height={57} className="absolute left-1/2 top-[38%] -translate-x-1/2" />
      </div>
      <h3 className="font-display text-xl font-semibold">{props.name}</h3>
      <p className="text-sm text-muted">{props.details}</p>
      <div className="flex items-center justify-between">
        <span className="font-display text-2xl font-bold text-brand-pink">{props.price}</span>
        <span className="flex gap-1.5" aria-hidden="true">
          {(props.swatches ?? []).map((c) => (
            <span key={c} className="size-5 rounded-full border-2 border-ink" style={{ background: c }} />
          ))}
        </span>
      </div>
    </Link>
  );
}
