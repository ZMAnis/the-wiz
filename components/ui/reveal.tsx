"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element starts. */
  delay?: number;
  /** Travel distance in px. Set to 0 for a pure fade. */
  distance?: number;
  as?: ElementType;
  once?: boolean;
};

/** Fade-up on scroll. The page's single entrance gesture. */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  as = "div",
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that releases its RevealItem children one after another. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: ElementType;
}) {
  const MotionTag = motion[as as "div"] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {children}
    </MotionTag>
  );
}

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  return (
    <MotionTag
      className={className}
      variants={
        reduced
          ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
          : revealItemVariants
      }
    >
      {children}
    </MotionTag>
  );
}
