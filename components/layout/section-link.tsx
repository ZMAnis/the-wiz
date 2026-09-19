"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isFrenchPath } from '@/lib/locale';

/**
 * Landing-page sections are addressed by hash (`#why`). Off the landing page
 * that hash means nothing, so rewrite it to `/#why`. On the landing page the
 * bare hash is kept, which lets Lenis ease the jump.
 */
export function SectionLink({
  href,
  className,
  children,
  ...props
}: {
  href: string;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "children">) {
  const pathname = usePathname();
  const french = isFrenchPath(pathname);
  const home = french ? '/fr' : '/';
  const isHash = href.startsWith("#");

  if (isHash && (pathname.replace(/\/$/, '') || '/') === home) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={isHash ? `${french ? '/fr/' : '/'}${href}` : french && href.startsWith('/') && !isFrenchPath(href) ? `/fr${href}` : href} className={className} {...props}>
      {children}
    </Link>
  );
}
