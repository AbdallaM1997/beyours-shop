import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-block -rotate-3 rounded-lg border-2 border-ink bg-brand-yellow px-2.5 py-1 font-display text-xs font-bold", className)}>
      {children}
    </span>
  );
}
