import type { Metadata } from "next";
import "@fontsource/fredoka/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/800.css";
import "../globals.css";

export const metadata: Metadata = { title: "BeYours Admin", robots: { index: false } };

// The admin area is English-only for now and sits outside the [locale] routes.
// TODO (M3): protect with Supabase auth + staff role check.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const items = ["Overview", "Orders", "Custom designs", "Products", "Customers", "Settings"];
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-mist">
        <aside className="w-60 shrink-0 bg-brand-blue p-5">
          <p className="mb-8 font-display text-2xl font-bold text-paper">BeYours Admin</p>
          <ul className="flex flex-col gap-1.5">
            {items.map((i) => (
              <li key={i} className={`rounded-xl px-3.5 py-3 font-extrabold ${i === "Orders" ? "bg-paper text-ink" : "text-paper"}`}>{i}</li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 p-7">{children}</main>
      </body>
    </html>
  );
}
