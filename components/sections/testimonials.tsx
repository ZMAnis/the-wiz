import { IconQuote } from "@/components/ui/icons";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <Section id="testimonials">
      <div className="shell">
        <SectionHeader
          eyebrow="From students"
          title={
            <>
              Used through a full year
              <br className="hidden md:block" />{" "}
              <span className="text-ink-40">of first-year medicine.</span>
            </>
          }
        />

        <RevealGroup
          as="ul"
          className="mt-20 grid gap-5 md:mt-28 md:grid-cols-3"
          stagger={0.1}
        >
          {testimonials.map((testimonial) => (
            <RevealItem key={testimonial.quote} as="li" className="h-full">
              <figure className="group flex h-full flex-col justify-between rounded-panel border border-ink-08 bg-paper p-9 transition-[transform,box-shadow,border-color] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-ink-12 hover:shadow-[var(--shadow-lift-hover)] md:p-11">
                <IconQuote className="h-6 w-6 text-ink-24 transition-colors duration-[650ms] group-hover:text-ink-56" />

                <blockquote className="type-heading mt-14 text-[1.375rem] leading-[1.28] font-normal md:mt-20 md:text-[1.5rem]">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-9 flex items-center gap-3 border-t border-ink-08 pt-6 text-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-ink-12 text-[0.6875rem] font-medium text-ink-56">
                    {testimonial.name.charAt(0)}
                  </span>
                  <span className="text-ink">{testimonial.name}</span>
                  <span className="text-ink-40">— {testimonial.detail}</span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
