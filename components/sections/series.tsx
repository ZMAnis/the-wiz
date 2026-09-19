import { ButtonLink } from "@/components/ui/button";
import { IconArrow } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { catalogueStats, specialties, yearsOf } from "@/lib/catalogue";
import { series } from "@/lib/content";

export function Series() {
  return (
    <Section id="series">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal distance={14}>
              <p className="type-eyebrow">{series.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="type-heading mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)]">
                {series.title}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="type-lead mt-7 max-w-lg">{series.body}</p>
            </Reveal>
            <Reveal delay={0.22}>
              <ButtonLink href={series.cta.href} className="mt-10">
                {series.cta.label}
                <IconArrow className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </ButtonLink>
            </Reveal>
          </div>

          <RevealGroup as="ul" className="lg:col-span-5 lg:col-start-8">
            {specialties.map((specialty) => {
              const years = yearsOf(specialty.slug);
              return (
                <RevealItem key={specialty.slug} as="li">
                  <div className="flex items-baseline justify-between gap-6 border-t border-ink-08 py-5 last:border-b">
                    <span className="text-[1.0625rem] tracking-[-0.01em] text-ink">
                      {specialty.name}
                    </span>
                    <span className="text-[0.8125rem] text-ink-40 tabular-nums">
                      {years.length} years
                    </span>
                  </div>
                </RevealItem>
              );
            })}
            <RevealItem as="li">
              <p className="mt-6 text-[0.8125rem] text-ink-40">
                {catalogueStats.total} editions planned ·{" "}
                {catalogueStats.available} shipping now
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
