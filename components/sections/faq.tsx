"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { IconPlus } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { faqs, site } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal distance={14}>
                <p className="type-eyebrow">FAQ</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="type-heading mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)]">
                  Everything else.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-7 max-w-xs text-[0.9375rem] leading-relaxed text-ink-56">
                  Still unsure about something? Write to{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-ink underline decoration-ink-24 underline-offset-4 transition-colors duration-300 hover:decoration-ink"
                  >
                    {site.email}
                  </a>
                  .
                </p>
              </Reveal>
            </div>
          </div>

          <RevealGroup as="ul" className="lg:col-span-8" stagger={0.07}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <RevealItem key={faq.question} as="li">
                  <div className="border-t border-ink-08 last:border-b">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        className="group flex w-full items-center justify-between gap-8 py-7 text-left md:py-8"
                      >
                        <span className="type-heading text-[clamp(1.0625rem,1.9vw,1.375rem)] font-normal text-ink-72 transition-colors duration-500 group-hover:text-ink">
                          {faq.question}
                        </span>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-12 text-ink transition-[background-color,color,border-color] duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="grid place-items-center"
                          >
                            <IconPlus className="h-4 w-4" />
                          </motion.span>
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={`faq-panel-${index}`}
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.55, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-xl pr-14 pb-8 text-[0.9375rem] leading-relaxed text-ink-56">
                            {faq.answer}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
