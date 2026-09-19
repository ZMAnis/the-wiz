import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { about } from "@/lib/content";

export function About() {
  return (
    <Section id="about">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-4">
            <figure>
              <div className="relative overflow-hidden rounded-panel border border-ink-08 bg-ink-04">
                <Image
                  src={about.portrait}
                  alt={`Portrait of the founder of ${about.name}`}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 30vw, 80vw"
                  className="h-auto w-full grayscale"
                />
                <div
                  aria-hidden
                  className="grain pointer-events-none absolute inset-0"
                />
              </div>
              <figcaption className="mt-5 text-[0.8125rem] text-ink-40">
                {about.role}
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal distance={14}>
              <p className="type-eyebrow">About</p>
            </Reveal>

            <Reveal delay={0.08}>
              <blockquote className="type-heading mt-8 text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.2] font-normal">
                “{about.quote}”
              </blockquote>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-10 flex items-center gap-4 border-t border-ink-08 pt-7">
                <span className="type-display text-[0.9375rem]">
                  {about.name}
                </span>
                <span className="h-px w-8 bg-ink-24" />
                <span className="text-[0.8125rem] text-ink-40">
                  {about.role}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
