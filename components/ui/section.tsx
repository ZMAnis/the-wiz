import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  divider = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Hairline rule that separates one section from the last. */
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-24 md:py-36 lg:py-44",
        divider && "border-t border-ink-08",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal distance={14}>
        <p className="type-eyebrow">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "type-heading mt-6 text-[clamp(2.25rem,5.2vw,4.25rem)]",
            align === "center" ? "max-w-4xl" : "max-w-3xl",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "type-lead mt-7 max-w-xl",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
