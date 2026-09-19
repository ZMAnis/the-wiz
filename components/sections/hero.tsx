"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Notebook3D } from "@/components/notebook/notebook-3d";
import { ButtonLink } from "@/components/ui/button";
import { IconArrow, IconArrowDown } from "@/components/ui/icons";
import { catalogueStats, specialties, yearsOf } from "@/lib/catalogue";
import { hero } from "@/lib/content";

const yearsCovered = specialties.reduce(
  (total, specialty) => total + yearsOf(specialty.slug).length,
  0,
);

/** Series-level facts, not one book's spec sheet. */
const stats: ReadonlyArray<readonly [string, string]> = [
  ["Specialties", String(catalogueStats.specialties)],
  ["Years covered", String(yearsCovered)],
  ["Editions planned", String(catalogueStats.total)],
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Copy drifts up a touch faster than the page — quiet parallax.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const objectY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32"
    >
      <div className="shell">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
          {/* ------------------------------- copy */}
          <motion.div
            className="lg:col-span-7 xl:col-span-6"
            style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="type-eyebrow"
            >
              {specialties.map((specialty) => specialty.name).join(" · ")}
            </motion.p>

            <h1 className="mt-7 flex flex-wrap gap-x-[0.22em] text-[clamp(3.75rem,13vw,10.5rem)] type-display">
              <span className="sr-only">{hero.title}</span>
              {hero.title.split(" ").map((word, wordIndex) => (
                <span key={word} className="inline-flex overflow-hidden pb-[0.06em]">
                  {word.split("").map((letter, index) => (
                    <motion.span
                      key={`${word}-${index}`}
                      aria-hidden
                      className="inline-block"
                      initial={{ y: "105%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        duration: 1,
                        ease: EASE,
                        delay: 0.24 + wordIndex * 0.09 + index * 0.045,
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
              className="type-lead mt-8 max-w-lg"
            >
              {hero.subtitle}
            </motion.p>

            <ul className="mt-10 max-w-md space-y-1.5">
              {hero.description.map((line, index) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: EASE,
                    delay: 0.72 + index * 0.07,
                  }}
                  className="text-[0.9375rem] leading-relaxed text-ink-72"
                >
                  {line}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1 }}
              className="mt-12 flex flex-wrap items-center gap-3"
            >
              <ButtonLink href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <IconArrow className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="outline">
                {hero.secondaryCta.label}
              </ButtonLink>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 1.2 }}
              className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink-08 pt-7"
            >
              {stats.map(([term, value]) => (
                <div key={term}>
                  <dt className="type-eyebrow text-[0.625rem]">{term}</dt>
                  <dd className="type-display mt-2 text-[1.375rem] tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="type-eyebrow text-[0.625rem]">Shipping now</dt>
                <dd className="type-display mt-2 text-[1.375rem] tabular-nums">
                  {catalogueStats.available}
                </dd>
              </div>
            </motion.dl>
          </motion.div>

          {/* ------------------------------- object */}
          <motion.div
            className="relative lg:col-span-5 xl:col-span-6"
            style={reduced ? undefined : { y: objectY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
          >
            <Notebook3D
              progress={scrollYProgress}
              className="mx-auto lg:mr-0 lg:ml-auto"
            />
          </motion.div>
        </div>

        <motion.a
          href="#why"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-20 hidden items-center gap-3 text-xs tracking-[0.18em] text-ink-40 uppercase transition-colors duration-300 hover:text-ink md:inline-flex"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-ink-12">
            <motion.span
              animate={reduced ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <IconArrowDown className="h-3.5 w-3.5" />
            </motion.span>
          </span>
          Scroll
        </motion.a>
      </div>
    </section>
  );
}
