import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookCard } from "@/components/catalogue/book-card";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import { BookCover } from "@/components/notebook/book-cover";
import { OrderPanel } from "@/components/order/order-panel";
import { IconCheck } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import {
  books,
  booksByYear,
  getBook,
  getSpecialty,
  parseYearSlug,
  yearLabel,
  yearOrdinal,
  yearSlug,
} from "@/lib/catalogue";
import { insideFeatures, site } from "@/lib/content";

type Params = { specialty: string; year: string; subject: string };

export function generateStaticParams(): Params[] {
  return books.map((book) => ({
    specialty: book.specialty,
    year: yearSlug(book.year),
    subject: book.slug,
  }));
}

async function resolve(params: Promise<Params>) {
  const { specialty: specialtySlug, year: yearParam, subject } = await params;
  const specialty = getSpecialty(specialtySlug);
  const year = parseYearSlug(yearParam);
  if (!specialty || year === null) return null;

  const book = getBook(specialty.slug, year, subject);
  if (!book) return null;

  return { specialty, year, book };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};

  const { book } = resolved;
  return {
    title: book.title,
    description: book.summary,
    alternates: { canonical: book.href },
    openGraph: {
      type: "website",
      url: `${site.url}${book.href}`,
      title: `${book.title} — ${site.name}`,
      description: book.summary,
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolved = await resolve(params);
  if (!resolved) notFound();

  const { specialty, year, book } = resolved;
  const available = book.status === "available";

  const siblings = booksByYear(specialty.slug, year)
    .filter((entry) => entry.id !== book.id)
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: book.title,
    brand: { "@type": "Brand", name: site.name },
    description: book.summary,
    category: "Study notebook",
    offers: {
      "@type": "Offer",
      priceCurrency: "DZD",
      ...(book.price ? { price: book.price } : {}),
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      url: `${site.url}${book.href}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <CataloguePageHeader
        crumbs={[
          { label: "The Wiz", href: "/" },
          { label: "Books", href: "/books" },
          { label: specialty.name, href: `/books/${specialty.slug}` },
          {
            label: yearLabel(year),
            href: `/books/${specialty.slug}/${yearSlug(year)}`,
          },
          { label: book.subject },
        ]}
        eyebrow={`${specialty.name} · ${yearOrdinal(year)}`}
        title={book.subject}
        intro={book.summary}
      />

      {/* ------------------------------------------------ object + contents */}
      <section className="shell pb-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative flex items-center justify-center overflow-hidden rounded-panel border border-ink-08 bg-ink-04 px-8 py-20">
              <div aria-hidden className="grain absolute inset-0" />
              <BookCover
                book={book}
                width="min(17rem, 62vw)"
                className="relative"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal distance={14}>
              <p className="type-eyebrow">What is inside</p>
            </Reveal>

            <RevealGroup as="ul" className="mt-9" stagger={0.05}>
              {insideFeatures.map((feature) => (
                <RevealItem key={feature} as="li">
                  <div className="flex items-center gap-4 border-t border-ink-08 py-4 last:border-b">
                    <IconCheck className="h-4 w-4 shrink-0 text-ink-40" />
                    <span className="text-[0.9375rem] text-ink-72">
                      {feature}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            {!available ? (
              <Reveal delay={0.1}>
                <p className="mt-9 max-w-md text-[0.9375rem] leading-relaxed text-ink-56">
                  This edition is still being written. Leave your email and you
                  will hear the day it is printed — nothing else.
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ order */}
      <Section id="order" divider={false} className="pt-20 md:pt-24">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-5xl">
              <OrderPanel book={book} />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------ siblings */}
      {siblings.length > 0 ? (
        <Section id="more">
          <div className="shell">
            <SectionHeader
              eyebrow={`Also in ${yearLabel(year).toLowerCase()}`}
              title={
                <>
                  The rest of the{" "}
                  <span className="text-ink-40">{yearOrdinal(year)}.</span>
                </>
              }
            />

            <ul className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {siblings.map((entry) => (
                <li key={entry.id}>
                  <BookCard book={entry} />
                </li>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <Link
                href={`/books/${specialty.slug}/${yearSlug(year)}`}
                className="group mt-12 inline-flex items-center gap-3 text-[0.9375rem] text-ink"
              >
                <span className="border-b border-ink-24 pb-1 transition-colors duration-500 group-hover:border-ink">
                  See all of {yearLabel(year).toLowerCase()}
                </span>
              </Link>
            </Reveal>
          </div>
        </Section>
      ) : null}
    </>
  );
}
