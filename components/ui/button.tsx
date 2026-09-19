import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap " +
  "transition-[transform,box-shadow,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper shadow-[0_1px_2px_rgba(10,10,10,0.16)]",
  outline: "border border-ink-24 text-ink hover:border-ink",
  ghost: "text-ink-56 hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-[0.9375rem]",
};

/**
 * The hover: a paper-coloured disc wipes up from the bottom on solid
 * buttons, an ink disc on outline ones. Label sits above it.
 */
function Wash({ variant }: { variant: Variant }) {
  if (variant === "ghost") return null;
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-0 translate-y-full rounded-full transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0",
        variant === "solid" ? "bg-paper" : "bg-ink",
      )}
    />
  );
}

const label = (variant: Variant) =>
  cn(
    "relative z-10 inline-flex items-center gap-2.5 transition-colors duration-[450ms]",
    variant === "solid" && "group-hover:text-ink",
    variant === "outline" && "group-hover:text-paper",
  );

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "solid",
  size = "lg",
  className,
  children,
  ...props
}: SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "children"> & {
    href: string;
  }) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <Wash variant={variant} />
      <span className={label(variant)}>{children}</span>
    </Link>
  );
}

export function Button({
  variant = "solid",
  size = "lg",
  className,
  children,
  type = "button",
  ...props
}: SharedProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <Wash variant={variant} />
      <span className={label(variant)}>{children}</span>
    </button>
  );
}
