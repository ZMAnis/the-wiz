import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import {
  booksByYear,
  getSpecialty,
  parseYearSlug,
  specialties,
  yearLabel,
  yearOrdinal,
  yearSlug,
  yearsOf,
} from "@/lib/catalogue";

type Params = { specialty: string; year: string };

export function generateStaticParams(): Params[] {
  return specialties.flatMap((specialty) =>
    yearsOf(specialty.slug).map((year) => ({
      specialty: specialty.slug,
      year: yearSlug(year),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { specialty: slug, year: yearParam } = await params;
  const specialty = getSpecialty(slug);
  const year = parseYearSlug(yearParam);
  if (!specialty || year === null) return {};

  return {
    title: `${specialty.name}, ${yearLabel(year).toLowerCase()}`,
    description: `Every ${specialty.name.toLowerCase()} ${yearOrdinal(year)} subject as a Wiz notebook — summaries, diagrams, mnemonics and dedicated note pages.`,
    alternates: { canonical: `/books/${specialty.slug}/${yearSlug(year)}` },
  };
}

export default async function YearPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { specialty: slug, year: yearParam } = await params;
  const specialty = getSpecialty(slug);
  const year = parseYearSlug(yearParam);
  if (!specialty || year === null) notFound();

  const list = booksByYear(specialty.slug, year);
  if (list.length === 0) notFound();

  return (
    <>
      <CataloguePageHeader
        crumbs={[
          { label: "The Wiz", href: "/" },
          { label: "Books", href: "/books" },
          { label: specialty.name, href: `/books/${specialty.slug}` },
          { label: yearLabel(year) },
        ]}
        eyebrow={specialty.name}
        title={
          <>
            {yearLabel(year)}
            <span className="text-ink-24">.</span>
          </>
        }
        intro={`The ${yearOrdinal(year)} of ${specialty.name.toLowerCase()}, subject by subject.`}
      />

      <div className="shell pb-28 md:pb-40">
        <CatalogueBrowser
          books={list}
          lockedSpecialty={specialty.slug}
          lockedYear={year}
        />
      </div>
    </>
  );
}
