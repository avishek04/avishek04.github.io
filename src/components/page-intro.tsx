type PageIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  index: string;
};

export function PageIntro({ eyebrow, title, description, index }: PageIntroProps) {
  return (
    <section className="site-container page-intro">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <p className="eyebrow">{eyebrow}</p>
        <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--muted)]">{index}</span>
      </div>
      <div className={description ? "grid gap-6 pt-8 md:grid-cols-[1.35fr_0.65fr] md:items-end md:gap-14" : "pt-8"}>
        <h1 className="display-title max-w-4xl">{title}</h1>
        {description ? <p className="max-w-lg text-base leading-7 text-[var(--muted)] md:pb-2">{description}</p> : null}
      </div>
    </section>
  );
}
