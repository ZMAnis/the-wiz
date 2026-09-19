import type { SVGProps } from "react";

/**
 * Hand-drawn hairline icon set. 24px grid, 1px strokes, round caps —
 * they should read as drawn with the same pen as the notebook.
 */
const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  xmlns: "http://www.w3.org/2000/svg",
};

type IconProps = SVGProps<SVGSVGElement>;

/** Condensed, ordered lines — structured summaries. */
export function IconSummary(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="2.5" width="17" height="19" rx="2.5" />
      <path d="M7.5 7.5h9M7.5 11h9M7.5 14.5h5.5" />
      <path d="M7.5 18h3" opacity="0.45" />
    </svg>
  );
}

/** An open, ruled field — space to think. */
export function IconSpace(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 2.5H4.75A1.25 1.25 0 0 0 3.5 3.75V5.5M17.5 2.5h1.75A1.25 1.25 0 0 1 20.5 3.75V5.5M6.5 21.5H4.75A1.25 1.25 0 0 1 3.5 20.25V18.5M17.5 21.5h1.75a1.25 1.25 0 0 0 1.25-1.25V18.5" />
      <path d="M7.5 9h9M7.5 12.5h9M7.5 16h6" opacity="0.45" />
    </svg>
  );
}

/** Cross and pulse — built for medical students. */
export function IconMedical(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 7.5v9M7.5 12h9" opacity="0.45" />
      <path d="M3.2 12h3.1l1.4-2.6 1.9 5 1.6-3.4 1.2 2.4h1.5" />
    </svg>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.25} {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowDown(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.25} {...props}>
      <path d="M12 4.5v15M6 13.5l6 6 6-6" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.25} {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

export function IconQuote(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1} {...props}>
      <path d="M9.5 5.5C6.4 7 4.5 9.9 4.5 13.2c0 3 1.7 5.3 4.2 5.3 2 0 3.5-1.5 3.5-3.4 0-1.9-1.4-3.3-3.2-3.3-.4 0-.8.1-1.1.2.3-2 1.6-3.8 3.5-5ZM20.5 5.5c-3.1 1.5-5 4.4-5 7.7 0 3 1.7 5.3 4.2 5.3 2 0 3.5-1.5 3.5-3.4 0-1.9-1.4-3.3-3.2-3.3-.4 0-.8.1-1.1.2.3-2 1.6-3.8 3.5-5Z" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.25} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.25} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.25} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTikTok(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13.8 3.2v11.3a3.6 3.6 0 1 1-3.6-3.6c.35 0 .69.05 1 .15" />
      <path d="M13.8 3.2c.3 2.4 2 4.2 4.5 4.5" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.75" y="5" width="18.5" height="14" rx="2.5" />
      <path d="m3.75 7 7.1 5.3a2 2 0 0 0 2.3 0L20.25 7" />
    </svg>
  );
}
