"use client";
import { usePathname } from 'next/navigation';
import { isFrenchPath } from '@/lib/locale';
export function SkipLink() {
  const french = isFrenchPath(usePathname());
  return <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper">{french ? 'Aller au contenu' : 'Skip to content'}</a>;
}
