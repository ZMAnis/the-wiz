"use client";

import { IconMinus, IconPlus } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const button =
    "grid h-10 w-10 place-items-center rounded-full text-ink transition-[background-color,color,transform] duration-300 hover:bg-ink hover:text-paper active:scale-95 disabled:pointer-events-none disabled:text-ink-24";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-ink-12 p-1",
        className,
      )}
    >
      <button
        type="button"
        className={button}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <IconMinus className="h-4 w-4" />
      </button>

      <span
        aria-live="polite"
        className="type-display w-9 text-center text-[1rem] tabular-nums"
      >
        {value}
      </span>

      <button
        type="button"
        className={button}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <IconPlus className="h-4 w-4" />
      </button>
    </div>
  );
}
