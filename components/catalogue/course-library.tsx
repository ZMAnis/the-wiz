"use client";

import Link from 'next/link';
import { useState } from 'react';
import { courses, courseYears, courseHref } from '@/lib/courses';
import { localizedPath, frenchYear, type Locale } from '@/lib/locale';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function CourseLibrary({ year, locale = 'en' }: { year?: number; locale?: Locale }) {
  const fr = locale === 'fr';
  const href = (path: string) => localizedPath(path, locale);
  const yearName = (value: number) => fr ? frenchYear(value) : `Year ${value}`;
  const [query, setQuery] = useState('');
  const visible = courses.filter(course => (!year || course.year === year) && normalize(course.title).includes(normalize(query.trim())));
  return <div className="shell pb-28">
    <nav aria-label={fr ? 'Années de médecine' : 'Course years'} className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {courseYears.map(value => <Link key={value} href={href(`/courses/year-${value}`)} aria-current={year === value ? 'page' : undefined} className={`group rounded-2xl border p-6 transition-colors ${year === value ? 'border-ink bg-ink text-paper' : 'border-ink-12 hover:bg-ink-04'}`}>
        <span className="text-xs opacity-60">{fr ? 'MÉDECINE' : 'MEDICINE'}</span>
        <span className="mt-4 block text-2xl tracking-tight sm:text-3xl">{yearName(value)} <span aria-hidden className="float-right text-xl opacity-50">↗</span></span>
        <span className="mt-3 block text-sm opacity-60">{courses.filter(c => c.year === value).length} {fr ? 'cours' : courses.filter(c => c.year === value).length === 1 ? 'course' : 'courses'}</span>
      </Link>)}
    </nav>
    <div className="mt-14 flex flex-col gap-5 border-b border-ink-12 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><h2 className="text-2xl">{fr ? year ? `Les cours de ${frenchYear(year)}` : 'La collection de cours' : year ? `Year ${year} courses` : 'The course collection'}</h2><p className="mt-2 text-sm text-ink-56">{fr ? 'Des notes originales. Une longueur d’avance.' : 'Original notes. A little head start.'}</p></div>
      <div className="w-full sm:w-80"><label htmlFor="course-search" className="mb-2 block text-xs text-ink-56">{fr ? 'Rechercher un cours' : 'Find a course'}</label><input id="course-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={fr ? 'Rechercher une matière…' : 'Search by subject…'} className="w-full rounded-xl border border-ink-12 bg-ink-04 px-4 py-3 text-sm" /></div>
    </div>
    <div className="my-6 flex justify-between text-sm text-ink-56"><p aria-live="polite">{visible.length} {fr ? 'cours' : visible.length === 1 ? 'course' : 'courses'}</p>{year && <Link href={href('/courses')} className="underline underline-offset-4">{fr ? 'Toutes les années' : 'View all years'}</Link>}</div>
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map(course => <li key={course.id}>
      <Link href={href(courseHref(course))} className="group flex h-full min-h-64 flex-col rounded-2xl border border-ink-12 p-7 transition-all hover:-translate-y-1 hover:border-ink-40 hover:shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-56"><span>{yearName(course.year).toUpperCase()} / {fr && course.category === 'Integrated units' ? 'UEI' : course.category.toUpperCase()}</span><span className="rounded-full bg-ink-04 px-3 py-1.5">{fr ? `Aperçu de ${course.previewPages} pages` : `${course.previewPages}-page preview`}</span></div>
        <h3 lang="fr" className="mt-8 text-2xl leading-snug">{course.title}</h3>
        <p className="mt-3 text-sm text-ink-56">MedWIZ · {fr ? `${course.pages} pages dans le cours complet` : `${course.pages} pages in the full course`}</p>
        <span className="mt-auto flex items-center justify-between pt-8 text-sm">{fr ? 'Lire l’aperçu' : 'Read the preview'} <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span></span>
      </Link>
    </li>)}</ul>
    {!visible.length && <div className="py-20 text-center"><p>{fr ? `Aucun cours ne correspond à « ${query} ».` : `No courses match “${query}”.`}</p><button className="mt-4 underline underline-offset-4" onClick={() => setQuery('')}>{fr ? 'Effacer la recherche' : 'Clear search'}</button></div>}
  </div>;
}
