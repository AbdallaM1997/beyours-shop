/** Shared shell for simple content pages (size guide, shipping, FAQ). */
export function InfoPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 md:py-14">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {intro && <p className="text-lg text-muted">{intro}</p>}
      </header>
      {children}
    </div>
  );
}
