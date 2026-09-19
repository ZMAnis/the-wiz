"use client";

import { useState } from "react";

import { BookCover } from "@/components/notebook/book-cover";
import { OrderDialog } from "@/components/order/order-dialog";
import { QuantityStepper } from "@/components/order/quantity-stepper";
import { Button } from "@/components/ui/button";
import { IconArrow } from "@/components/ui/icons";
import { formatPrice, type Book } from "@/lib/catalogue";
import { product } from "@/lib/content";
import { githubPages } from "@/lib/hosting";

/**
 * The purchase card. Sells an available book, or collects interest in one
 * that has not shipped yet.
 */
export function OrderPanel({ book }: { book: Book }) {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const available = book.status === "available";

  const specs: ReadonlyArray<readonly [string, string]> = [
    ["Specialty", book.specialtyName],
    ["Year", String(book.year)],
    ...(book.pages
      ? ([["Pages", `${book.pages} pages`]] as const)
      : ([] as const)),
    // Format, paper and binding are the same across the whole series.
    ...product.physical.filter(([term]) => term !== "Format"),
  ];

  return (
    <>
      <div className="overflow-hidden rounded-panel border border-ink-08 bg-paper shadow-[var(--shadow-lift)]">
        <div className="grid lg:grid-cols-2">
          {/* ------------------------------ object */}
          <div className="relative flex items-center justify-center border-b border-ink-08 bg-ink-04 px-8 py-16 lg:border-r lg:border-b-0 lg:py-20">
            <div aria-hidden className="grain absolute inset-0" />
            <BookCover book={book} className="relative" />
          </div>

          {/* ------------------------------ details */}
          <div className="flex flex-col p-8 md:p-12">
            <p className="type-eyebrow">
              {book.kind === "bundle" ? "Year bundle" : "Subject notebook"}
            </p>
            <h3 className="mt-5 text-[clamp(1.5rem,2.6vw,1.875rem)] leading-tight">
              {book.title}
            </h3>

            {available ? (
              <div className="mt-8 flex items-baseline gap-3">
                <span className="type-display text-[clamp(2rem,4vw,2.75rem)]">
                  {formatPrice(book.price ?? 0)}
                </span>
                <span className="text-[0.8125rem] text-ink-40">
                  incl. taxes
                </span>
              </div>
            ) : (
              <p className="mt-8 inline-flex w-fit rounded-full border border-ink-12 px-4 py-1.5 text-[0.8125rem] text-ink-56">
                In preparation
              </p>
            )}

            <dl className="mt-9 border-t border-ink-08">
              {specs.map(([term, value]) => (
                <div
                  key={term}
                  className="flex items-center justify-between border-b border-ink-08 py-3.5 text-[0.875rem]"
                >
                  <dt className="text-ink-40">{term}</dt>
                  <dd className="text-ink-72">{value}</dd>
                </div>
              ))}
            </dl>

            {available ? (
              <>
                <div className="mt-9 flex flex-wrap items-center justify-between gap-5">
                  <span className="text-[0.875rem] text-ink-40">Quantity</span>
                  <QuantityStepper
                    value={quantity}
                    onChange={setQuantity}
                    max={product.maxQuantity}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-ink-08 pt-5 text-[0.9375rem]">
                  <span className="text-ink-40">Total</span>
                  <span className="type-display text-[1.25rem]">
                    {formatPrice((book.price ?? 0) * quantity)}
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-9 text-[0.9375rem] leading-relaxed text-ink-56">
                {book.summary}
              </p>
            )}

            <Button
              disabled={githubPages}
              className="mt-8 w-full"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
            >
              {githubPages ? "Online requests unavailable" : available ? "Order now" : "Tell me when it's out"}
              <IconArrow className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
            </Button>

            <p className="mt-6 text-center text-[0.8125rem] text-ink-40">
              {githubPages ? "Ordering and waitlist registration are not available on this site yet." : available
                ? product.shippingNote
                : "No payment, no commitment — just an email when it ships."}
            </p>
          </div>
        </div>

        {/* ------------------------------ payment */}
        {available ? (
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 border-t border-ink-08 bg-paper px-8 py-7">
            <span className="type-eyebrow mr-2 text-[0.625rem]">Payment</span>
            {product.paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-full border border-ink-12 px-4 py-1.5 text-[0.8125rem] text-ink-56 transition-colors duration-500 hover:border-ink-24 hover:text-ink"
              >
                {method}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <OrderDialog
        book={book}
        mode={available ? "order" : "waitlist"}
        open={open}
        onOpenChange={setOpen}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />
    </>
  );
}
