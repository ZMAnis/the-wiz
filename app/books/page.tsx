import type { Metadata } from "next";
import Link from "next/link";

import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import { Reveal } from "@/components/ui/reveal";
import { books, catalogueStats, specialties } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "All books",
  description:
    "Every edition of The Wiz — structured handwritten summaries with dedicated note pages, across medicine, pharmacy and dental surgery, year by year and subject by subject.",
  alternates: { canonical: "/books" },
};

export default function BooksPage() {
  return (
    <>
      <CataloguePageHeader
        crumbs={[{ label: "The Wiz", href: "/" }, { label: "Books" }]}
        eyebrow="The catalogue"
        title={
          <>
            Every year.
            <br />
            <span className="text-ink-40">Every subject.</span>
          </>
        }
        intro={`${catalogueStats.total} editions planned across ${catalogueStats.specialties} specialties. ${catalogueStats.available} shipping today — the rest are being written.`}
      />

      <div className="shell pb-28 md:pb-40">
        <Link href="/courses" className="mb-10 flex items-center justify-between gap-5 rounded-2xl border border-ink-12 bg-ink-04 p-7">
          <span><span className="block text-xl">Explore the MedWIZ course library</span><span className="mt-2 block text-sm text-ink-56">Browse by year and read the first 10 pages of every course.</span></span><span aria-hidden>↗</span>
        </Link>
        <CatalogueBrowser books={books} />
      </div>

      <section className="shell pb-28 md:pb-40">
        <Reveal>
          <div className="rounded-panel border border-ink-08 p-8 md:p-12">
            <p className="type-eyebrow">How the series is built</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {specialties.map((specialty) => (
                <div key={specialty.slug}>
                  <h2 className="text-[1.125rem] tracking-[-0.02em]">
                    {specialty.name}
                  </h2>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-56">
                    {specialty.degreeYears} years in total
                    {specialty.note ? `. ${specialty.note}` : "."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
