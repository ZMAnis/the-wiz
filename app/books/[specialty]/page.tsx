import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import { booksBySpecialty, getSpecialty, specialties } from "@/lib/catalogue";

type Params = { specialty: string };

export function generateStaticParams(): Params[] {
  return specialties.map((specialty) => ({ specialty: specialty.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const specialty = getSpecialty(slug);
  if (!specialty) return {};

  return {
    title: `${specialty.name} books`,
    description: `The Wiz for ${specialty.name.toLowerCase()} — handwritten summaries, diagrams and note pages across all ${specialty.studyYears} taught years.`,
    alternates: { canonical: `/books/${specialty.slug}` },
  };
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { specialty: slug } = await params;
  const specialty = getSpecialty(slug);
  if (!specialty) notFound();

  const list = booksBySpecialty(specialty.slug);

  return (
    <>
      <CataloguePageHeader
        crumbs={[
          { label: "The Wiz", href: "/" },
          { label: "Books", href: "/books" },
          { label: specialty.name },
        ]}
        eyebrow={`${specialty.studyYears} taught years`}
        title={specialty.name}
        intro={
          specialty.note ??
          `Every subject of the ${specialty.name.toLowerCase()} programme, one notebook at a time.`
        }
      />

      <div className="shell pb-28 md:pb-40">
        <CatalogueBrowser books={list} lockedSpecialty={specialty.slug} />
      </div>
    </>
  );
}
