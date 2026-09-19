import type { CSSProperties } from "react";

import { NotebookCover } from "@/components/notebook/notebook-3d";
import type { Book } from "@/lib/catalogue";
import { yearLabel } from "@/lib/catalogue";
import { cn } from "@/lib/utils";
import { frenchYear, type Locale } from '@/lib/locale';

/**
 * Cover text derived from a catalogue entry. The wordmark never changes —
 * the brand is The Wiz, and the subject is the edition beneath it.
 */
export function coverPropsFor(book: Book) {
  return {
    edition: yearLabel(book.year),
    wordmark: ["THE", "WIZ"] as const,
    meta:
      book.kind === "bundle"
        ? [`Complete year ${book.year}`, book.specialtyName]
        : [book.subject, book.specialtyName],
    footnote: "Summaries · Diagrams · Notes",
  };
}

/**
 * A flat, non-3D cover at a given width. `width` must be a CSS length —
 * it drives both the box and the em-based cover typography.
 */
export function BookCover({
  book,
  width = "min(15rem, 60vw)",
  className,
  tilt = true,
  locale = 'en',
}: {
  book: Book;
  width?: string;
  className?: string;
  tilt?: boolean;
  locale?: Locale;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[1/1.4] rounded-l-[3px] rounded-r-[14px] shadow-[var(--shadow-object)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        tilt && "rotate-[-4deg] hover:rotate-0 hover:scale-[1.02]",
        className,
      )}
      style={
        {
          width,
          "--bw": width,
          fontSize: `calc(${width} * 0.09)`,
        } as CSSProperties
      }
    >
      <NotebookCover {...coverPropsFor(book)} {...(locale === 'fr' ? { edition: frenchYear(book.year), meta: [book.subject, book.specialtyName], footnote: 'Résumés · Schémas · Notes' } : {})} />
    </div>
  );
}
