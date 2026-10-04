import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="site-container grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-[var(--accent)]">404</p>
        <h1 className="mt-5 font-serif text-5xl tracking-[-0.04em] sm:text-7xl">This path ends here.</h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[var(--muted)]">The page may have moved, or the link may be incomplete. The homepage is a good place to find your bearings.</p>
        <Link href="/" className="button button--primary mt-8">Return home <ArrowRightIcon className="size-4" /></Link>
      </div>
    </section>
  );
}
