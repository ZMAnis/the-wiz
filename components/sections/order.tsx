import Link from "next/link";

import { OrderPanel } from "@/components/order/order-panel";
import { IconArrow } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { catalogueStats, flagship } from "@/lib/catalogue";

export function Order() {
  const inPreparation = catalogueStats.total - catalogueStats.available;

  return (
    <Section id="order">
      <div className="shell">
        <SectionHeader
          eyebrow="Order"
          title={
            <>
              Start with what is
              <br className="hidden md:block" />{" "}
              <span className="text-ink-40">already printed.</span>
            </>
          }
          intro="One edition is shipping today. The rest of the series is in preparation — pick yours in the catalogue and we will tell you the day it lands."
          align="center"
          className="mx-auto"
        />

        <Reveal delay={0.12} className="mt-20 md:mt-24">
          <div className="mx-auto max-w-5xl">
            <OrderPanel book={flagship} />
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-12 text-center text-[0.9375rem] text-ink-56">
            <Link
              href="/books"
              className="group inline-flex items-center gap-2.5 text-ink"
            >
              <span className="border-b border-ink-24 pb-1 transition-colors duration-500 group-hover:border-ink">
                Browse the other {inPreparation} editions
              </span>
              <IconArrow className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
            </Link>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
