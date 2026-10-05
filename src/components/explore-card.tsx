import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/icons";
import type { ExploreItem } from "@/content/portfolio";

type ExploreCardProps = {
  item: ExploreItem;
  index: number;
  wide?: boolean;
};

export function ExploreCard({ item, index, wide = false }: ExploreCardProps) {
  return (
    <article
      className={`explore-card explore-card--${(index % 4) + 1} ${wide ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10" : ""}`}
    >
      <div className="explore-card__visual relative overflow-hidden" aria-hidden={!item.image}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt ?? ""}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={item.imageFit === "contain" ? "bg-white object-contain p-3 sm:p-5" : "object-cover"}
          />
        ) : (
          <div className="explore-art">
            <span className="explore-art__number">0{index + 1}</span>
            <span className="explore-art__line explore-art__line--one" />
            <span className="explore-art__line explore-art__line--two" />
            <span className="explore-art__dot" />
          </div>
        )}
      </div>
      <div className={wide ? "pt-5 md:pt-0" : "pt-5"}>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{item.category}</p>
          {item.date ? <span className="font-mono text-[10px] text-[var(--muted)]">{item.date}</span> : null}
        </div>
        <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em]">{item.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">{item.description}</p>
        {item.links?.length ? (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            {item.links.map((link) => (
              <a
                key={link.href}
                className="text-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} <ArrowUpRightIcon className="size-4" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
