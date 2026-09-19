import type { ComponentType, SVGProps } from "react";

import { IconMedical, IconSpace, IconSummary } from "@/components/ui/icons";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { pillars } from "@/lib/content";

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  structured: IconSummary,
  space: IconSpace,
  medical: IconMedical,
};

export function Why() {
  return (
    <Section id="why" divider={false}>
      <div className="shell">
        <SectionHeader
          eyebrow="Why The Wiz"
          title={
            <>
              Not another set of notes.
              <br className="hidden sm:block" />
              <span className="text-ink-40"> A better starting point.</span>
            </>
          }
          intro="Three decisions shape the entire notebook — what goes in, what stays empty, and who it is drawn for."
        />

        <RevealGroup
          className="mt-20 grid gap-5 md:mt-28 md:grid-cols-3"
          as="ul"
          stagger={0.11}
        >
          {pillars.map((pillar) => {
            const Icon = icons[pillar.id];
            return (
              <RevealItem key={pillar.id} as="li">
                <article className="group relative flex h-full flex-col rounded-panel border border-ink-08 bg-paper p-9 transition-[transform,box-shadow,border-color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-ink-12 hover:shadow-[var(--shadow-lift-hover)] md:p-11">
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-full border border-ink-12 text-ink transition-[background-color,color,border-color] duration-[650ms] group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="type-eyebrow pt-1 text-[0.625rem]">
                      {pillar.index}
                    </span>
                  </div>

                  <h3 className="mt-16 text-[1.375rem] leading-tight md:mt-20">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-56">
                    {pillar.body}
                  </p>

                  {/* Rule that draws itself in on hover. */}
                  <span
                    aria-hidden
                    className="mt-9 block h-px w-full origin-left scale-x-0 bg-ink/20 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
