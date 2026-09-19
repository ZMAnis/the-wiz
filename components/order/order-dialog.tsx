"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

import { useScrollLock } from "@/components/providers/smooth-scroll";
import { QuantityStepper } from "@/components/order/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Field, Input, RadioPills, Textarea } from "@/components/ui/field";
import { IconArrow, IconCheck, IconClose } from "@/components/ui/icons";
import { formatPrice, type Book } from "@/lib/catalogue";
import { product } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "submitting" | "done" | "error";

export type OrderMode = "order" | "waitlist";

export function OrderDialog({
  book,
  mode = "order",
  open,
  onOpenChange,
  quantity,
  onQuantityChange,
}: {
  book: Book;
  mode?: OrderMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quantity: number;
  onQuantityChange: (next: number) => void;
}) {
  const isOrder = mode === "order";
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const { lock, unlock } = useScrollLock();

  const [payment, setPayment] = useState<string>(product.paymentMethods[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Escape closes; focus moves into the panel; the page underneath freezes.
  useEffect(() => {
    if (!open) return;

    lock();
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 120);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (event.key !== "Tab") return;

      // Keep focus inside the dialog.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      unlock();
    };
  }, [open, lock, unlock, onOpenChange]);

  // Reset back to the form a moment after the dialog closes.
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => {
      setStatus("idle");
      setReference(null);
      setMessage(null);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const data = new FormData(event.currentTarget);
    const field = (key: string) => String(data.get(key) ?? "").trim();

    const payload = isOrder
      ? {
          intent: "order" as const,
          bookId: book.id,
          name: field("name"),
          email: field("email"),
          phone: field("phone"),
          city: field("city"),
          address: field("address"),
          note: field("note"),
          payment,
          quantity,
        }
      : {
          intent: "waitlist" as const,
          bookId: book.id,
          name: field("name"),
          email: field("email"),
          note: field("note"),
        };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        reference?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setReference(result.reference ?? null);
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        // Keyed motion element as the direct child — AnimatePresence needs it
        // to own the unmount, otherwise the overlay lingers and eats clicks.
        <motion.div
          key="order-dialog"
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div
            className="absolute inset-0 bg-paper/70 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-panel border border-ink-08 bg-paper shadow-[0_40px_120px_-40px_rgba(10,10,10,0.4)] sm:rounded-panel"
            initial={{ y: 32, scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.99 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <header className="flex items-start justify-between gap-6 border-b border-ink-08 px-7 py-6 md:px-9">
              <div>
                <p className="type-eyebrow text-[0.625rem]">
                  {status === "done"
                    ? isOrder
                      ? "Order received"
                      : "You're on the list"
                    : isOrder
                      ? "Order form"
                      : "Get notified"}
                </p>
                <h2
                  id={`${id}-title`}
                  className="mt-2.5 text-[1.25rem] leading-tight"
                >
                  {book.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="-mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-12 text-ink-56 transition-[background-color,color,border-color] duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </header>

            {status === "done" ? (
              <div className="flex flex-col items-center px-7 py-14 text-center md:px-9">
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-ink text-paper"
                >
                  <IconCheck className="h-6 w-6" />
                </motion.span>

                <h3 className="mt-8 text-[1.5rem]">Thank you.</h3>
                <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-ink-56">
                  {isOrder
                    ? "Your order has been recorded. We will email you within 24 hours to confirm payment and delivery."
                    : `We will email you the moment ${book.subject} is printed. Nothing else — no list, no noise.`}
                </p>

                {reference ? (
                  <p className="type-eyebrow mt-8 text-[0.625rem]">
                    Reference — <span className="text-ink">{reference}</span>
                  </p>
                ) : null}

                <Button
                  variant="outline"
                  className="mt-10"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto px-7 py-7 md:grid-cols-2 md:px-9">
                  <Field label="Full name" htmlFor={`${id}-name`}>
                    <Input
                      ref={firstFieldRef}
                      id={`${id}-name`}
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="Amina Bensalah"
                    />
                  </Field>

                  <Field label="Email" htmlFor={`${id}-email`}>
                    <Input
                      id={`${id}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@university.edu"
                    />
                  </Field>

                {isOrder ? (
                    <>
                      <Field label="Phone" htmlFor={`${id}-phone`}>
                        <Input
                          id={`${id}-phone`}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          placeholder="+213 000 00 00 00"
                        />
                      </Field>

                      <Field label="City" htmlFor={`${id}-city`}>
                        <Input
                          id={`${id}-city`}
                          name="city"
                          autoComplete="address-level2"
                          required
                          placeholder="Algiers"
                        />
                      </Field>

                      <Field
                        label="Delivery address"
                        htmlFor={`${id}-address`}
                        className="md:col-span-2"
                      >
                        <Textarea
                          id={`${id}-address`}
                          name="address"
                          rows={2}
                          autoComplete="street-address"
                          required
                          placeholder="Street, building, apartment"
                        />
                      </Field>

                      <Field
                        label="Payment method"
                        htmlFor={`${id}-payment`}
                        className="md:col-span-2"
                      >
                        <div id={`${id}-payment`}>
                          <RadioPills
                            name="payment"
                            options={product.paymentMethods}
                            value={payment}
                            onChange={setPayment}
                          />
                        </div>
                      </Field>
                    </>
                  ) : null}

                  <Field
                    label="Note (optional)"
                    htmlFor={`${id}-note`}
                    className="md:col-span-2"
                  >
                    <Textarea
                      id={`${id}-note`}
                      name="note"
                      rows={2}
                      placeholder={
                        isOrder
                          ? "Anything we should know"
                          : "Which year are you starting?"
                      }
                    />
                  </Field>

                  {isOrder ? (
                    <div className="flex items-center justify-between gap-4 md:col-span-2">
                      <span className="type-eyebrow text-[0.625rem] text-ink-56">
                        Quantity
                      </span>
                      <QuantityStepper
                        value={quantity}
                        onChange={onQuantityChange}
                        max={product.maxQuantity}
                      />
                    </div>
                  ) : null}
                </div>

                <footer className="border-t border-ink-08 px-7 py-6 md:px-9">
                  {message ? (
                    <p
                      role="alert"
                      className="mb-4 rounded-2xl border border-ink-24 px-4 py-3 text-[0.8125rem] text-ink"
                    >
                      {message}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between gap-4">
                    {isOrder ? (
                      <div>
                        <p className="type-eyebrow text-[0.625rem]">Total</p>
                        <p className="type-display mt-1.5 text-[1.25rem]">
                          {formatPrice((book.price ?? 0) * quantity)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="type-eyebrow text-[0.625rem]">Edition</p>
                        <p className="mt-1.5 text-[0.9375rem] text-ink-72">
                          {book.subject}
                        </p>
                      </div>
                    )}

                    <Button type="submit" disabled={status === "submitting"}>
                      {status === "submitting"
                        ? "Sending…"
                        : isOrder
                          ? "Place order"
                          : "Notify me"}
                      <IconArrow className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                    </Button>
                  </div>

                  <p className="mt-5 text-[0.75rem] leading-relaxed text-ink-40">
                    {isOrder
                      ? `${product.shippingNote} No payment is taken here — we confirm everything by email first.`
                      : "One email when it ships. We never share your address."}
                  </p>
                </footer>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
