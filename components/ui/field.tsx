import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const control =
  "w-full rounded-2xl border border-ink-12 bg-paper px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-24 " +
  "transition-[border-color,box-shadow] duration-300 hover:border-ink-24 focus:border-ink focus:outline-none " +
  "focus:ring-1 focus:ring-ink";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="type-eyebrow text-[0.625rem] text-ink-56"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[0.75rem] text-ink" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.75rem] text-ink-40">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: ComponentPropsWithRef<"textarea">) {
  return (
    <textarea className={cn(control, "resize-none", className)} {...props} />
  );
}

/** Segmented radio group rendered as pills — used for payment method. */
export function RadioPills({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <label
            key={option}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-[0.8125rem] transition-[background-color,color,border-color] duration-300",
              active
                ? "border-ink bg-ink text-paper"
                : "border-ink-12 text-ink-56 hover:border-ink-24 hover:text-ink",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={active}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}
