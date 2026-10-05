import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/icons";

type OrganizationLinkProps = {
  name: string;
  href: string;
  logo: string;
  logoKind?: "wordmark" | "symbol" | "cropped-symbol";
};

export function OrganizationLink({
  name,
  href,
  logo,
  logoKind = "symbol",
}: OrganizationLinkProps) {
  const frameClass = logoKind === "wordmark" ? "h-12 w-28 px-2 py-1.5" : "size-12 p-1.5";
  const imageClass = logoKind === "cropped-symbol"
    ? "size-full object-cover object-left"
    : "size-full object-contain";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex w-fit items-center gap-3 text-sm font-semibold tracking-[0.06em] text-[var(--ink)] uppercase hover:text-[var(--accent)]"
      aria-label={`${name} website`}
    >
      <span className={`grid shrink-0 place-items-center overflow-hidden border border-[var(--line)] bg-white ${frameClass}`}>
        <Image
          src={logo}
          alt=""
          width={logoKind === "wordmark" ? 104 : 40}
          height={40}
          className={imageClass}
        />
      </span>
      <span>{name}</span>
      <ArrowUpRightIcon className="size-3.5 text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
    </a>
  );
}
