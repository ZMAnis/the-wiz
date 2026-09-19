"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { ButtonLink } from "@/components/ui/button";
import { IconArrow } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { insideFeatures, insideSpreads } from "@/lib/content";

/** Each spread drifts at its own rate as the column passes the viewport. */
function Spread({
  src,
  alt,
  caption,
  index,
}: {
  src: string;
  alt: string;
  caption: string;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const drift = [-48, -26, -64][index % 3];
  const y = useTransform(scrollYProgress, [0, 1], [0, drift]);

  return (
    <motion.figure
      ref={ref}
      className="group"
      style={reduced ? undefined : { y }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden rounded-panel border border-ink-08 bg-[#fbfbfb] shadow-[var(--shadow-lift)] transition-shadow duration-[900ms] group-hover:shadow-[var(--shadow-lift-hover)]">
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1250}
          sizes="(min-width: 1024px) 42vw, 90vw"
          className="h-auto w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-[0.8125rem] text-ink-40">
        <span>{caption}</span>
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </figcaption>
    </motion.figure>
  );
}

export function Inside() {
  return (
    <Section id="inside">
      <div className="shell">
        <SectionHeader
          eyebrow="Inside the notebook"
          title={
            <>
              Drawn by hand,
              <br className="hidden md:block" />{" "}
              <span className="text-ink-40">ordered like an exam.</span>
            </>
          }
          intro="Every edition is built the same way, whichever subject is on the cover."
        />

        <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* previews */}
          <div className="flex flex-col gap-14 lg:col-span-7">
            {insideSpreads.map((spread, index) => (
              <Spread key={spread.src} {...spread} index={index} />
            ))}
          </div>

          {/* feature list */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className="type-eyebrow">What you get</p>
              </Reveal>

              <RevealGroup as="ul" className="mt-10" stagger={0.06}>
                {insideFeatures.map((feature, index) => (
                  <RevealItem key={feature} as="li">
                    <div className="group flex items-baseline gap-6 border-t border-ink-08 py-5 transition-colors duration-500 last:border-b hover:border-ink-24">
                      <span className="type-eyebrow w-6 shrink-0 text-[0.625rem] tabular-nums transition-colors duration-500 group-hover:text-ink">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[1.0625rem] tracking-[-0.01em] text-ink-72 transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-ink">
                        {feature}
                      </span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.1}>
                <p className="mt-10 max-w-sm text-[0.9375rem] leading-relaxed text-ink-56">
                  Nothing is padded out. If a page is in the notebook, it is
                  either something you need to know or somewhere you need to
                  write.
                </p>
              </Reveal>

              <Reveal delay={0.16}>
                <ButtonLink href="#order" variant="outline" className="mt-10">
                  See the edition
                  <IconArrow className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
