import { IconCheck } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { audience } from "@/lib/content";

export function Audience() {
  return (
    <Section id="who">
      <div className="shell">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal distance={14}>
            <p className="type-eyebrow">Who is it for</p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="type-display mt-8 text-[clamp(2.75rem,8vw,6.5rem)]">
              Perfect if you<span className="text-ink-24">...</span>
            </h2>
          </Reveal>
        </div>

        <RevealGroup
          as="ul"
          className="mx-auto mt-20 max-w-3xl md:mt-28"
          stagger={0.1}
        >
          {audience.items.map((item) => (
            <RevealItem key={item} as="li">
              <div className="group flex items-center gap-6 border-t border-ink-08 py-8 last:border-b md:gap-9 md:py-10">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink-12 text-ink transition-[background-color,color,border-color,transform] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                  <IconCheck className="h-4 w-4" />
                </span>
                <p className="type-heading text-[clamp(1.25rem,2.6vw,1.875rem)] font-normal text-ink-72 transition-colors duration-500 group-hover:text-ink">
                  {item}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
