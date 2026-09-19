import Link from "next/link";

import { BookCover } from "@/components/notebook/book-cover";
import { IconArrow } from "@/components/ui/icons";
import { formatPrice, yearLabel, type Book } from "@/lib/catalogue";
import { frenchYear, type Locale } from '@/lib/locale';

export function BookCard({ book, locale = 'en' }: { book: Book; locale?: Locale }) {
  const fr = locale === 'fr';
  const available = book.status === "available";

  return (
    <Link
      href={book.href}
      className="group flex h-full items-start gap-6 rounded-panel border border-ink-08 bg-paper p-6 transition-[transform,box-shadow,border-color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-ink-12 hover:shadow-[var(--shadow-lift-hover)] md:p-7"
    >
      <BookCover
        book={book}
        locale={locale}
        width="clamp(4.5rem, 14vw, 6rem)"
        tilt={false}
        className="shrink-0 shadow-[var(--shadow-lift)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-2"
      />

      <div className="flex min-w-0 flex-1 flex-col self-stretch">
        <p className="type-eyebrow text-[0.625rem]">
          {book.specialtyName} · {fr ? frenchYear(book.year) : yearLabel(book.year)}
        </p>

        <h3 className="mt-3 text-[1.125rem] leading-snug tracking-[-0.02em]">
          {book.subject}
        </h3>

        <p className="mt-2.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-40">
          {book.summary}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <span className="text-[0.8125rem] text-ink-56">
            {available ? formatPrice(book.price ?? 0) : fr ? 'En préparation' : "In preparation"}
          </span>
          <IconArrow className="h-4 w-4 shrink-0 text-ink-24 transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-ink" />
        </div>
      </div>
    </Link>
  );
}
