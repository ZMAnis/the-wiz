import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FrenchHome } from '@/components/french/home';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { CatalogueBrowser } from '@/components/catalogue/catalogue-browser';
import { CourseLibrary } from '@/components/catalogue/course-library';
import { BookCover } from '@/components/notebook/book-cover';
import { BookCard } from '@/components/catalogue/book-card';
import { courses, courseYears, courseHref } from '@/lib/courses';
import { books, specialties, yearsOf, formatPrice } from '@/lib/catalogue';
import { frenchBooks, specialtyNames, features } from '@/lib/french';
import { frenchYear } from '@/lib/locale';
import { site } from '@/lib/content';

type Params = { path?: string[] };
export const dynamicParams = false;
const frenchPaths = [
  '/', '/courses', '/books',
  ...courseYears.map(year => `/courses/year-${year}`), ...courses.map(courseHref),
  ...specialties.flatMap(s => [`/books/${s.slug}`, ...yearsOf(s.slug).map(y => `/books/${s.slug}/year-${y}`)]),
  ...books.map(book => book.href),
];
export function generateStaticParams() { return frenchPaths.map(path => ({ path: path === '/' ? [] : path.slice(1).split('/') })); }

function pageTitle(path: string) {
  if (path === '/') return 'Des carnets pour mieux apprendre';
  if (path === '/courses') return 'Bibliothèque de cours MedWIZ';
  if (path === '/books') return 'Tous les livres';
  const course = courses.find(c => courseHref(c) === path);
  if (course) return `${course.title} · Aperçu MedWIZ`;
  const book = frenchBooks.find(b => b.href === `/fr${path}`);
  if (book) return book.title;
  const parts = path.split('/');
  const year = Number(parts[3]?.replace('year-', '') || parts[2]?.replace('year-', ''));
  return `${parts[1] === 'courses' ? 'MedWIZ' : specialtyNames[parts[2]] ?? 'The Wiz'}${Number.isFinite(year) && year ? ` · ${frenchYear(year)}` : ''}`;
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const path = '/' + ((await params).path ?? []).join('/');
  const canonical = `/fr${path === '/' ? '' : path}`;
  return { title: pageTitle(path), description: 'Découvrez les carnets The Wiz et les cours MedWIZ, classés par année. Consultez les 10 premières pages de chaque cours.', alternates: { canonical, languages: { en: path, fr: canonical } }, openGraph: { title: `${pageTitle(path)} — The Wiz`, description: 'Des résumés clairs et des cours classés par année pour vos études de santé.', locale: 'fr_FR', url: `${site.url}${canonical}` } };
}
export default async function FrenchPage({ params }: { params: Promise<Params> }) {
  const path = '/' + ((await params).path ?? []).join('/');
  if (!frenchPaths.includes(path)) notFound();
  if (path === '/') return <div lang="fr"><FrenchHome /></div>;
  const parts = path.slice(1).split('/');
  if (parts[0] === 'courses') {
    const year = parts[1] ? Number(parts[1].replace('year-', '')) : undefined;
    const course = courses.find(c => courseHref(c) === path);
    const crumbs = [{ label: 'The Wiz', href: '/fr' }, { label: 'Cours', href: '/fr/courses' }, ...(year ? [{ label: frenchYear(year), href: `/fr/courses/year-${year}` }] : []), ...(course ? [{ label: course.title }] : [])];
    return <div lang="fr"><CataloguePageHeader locale="fr" crumbs={crumbs} eyebrow={course ? `MedWIZ · ${frenchYear(course.year)} · ${course.category === 'Integrated units' ? 'Unités d’enseignement intégrées' : 'Modules'}` : 'Bibliothèque MedWIZ · Médecine'} title={course ? course.title : year ? <>{frenchYear(year)}.<br /><span className="text-ink-40">Une matière à la fois.</span></> : <>Votre année.<br /><span className="text-ink-40">Votre prochain chapitre.</span></>} intro={course ? `Un aperçu du cours : les pages 1 à ${course.previewPages} sur ${course.pages}. Prenez le temps de découvrir les notes et de préparer votre prochaine séance de révision.` : 'Retrouvez vos cours et découvrez leur contenu. Consultez les 10 premières pages de nos notes originales de médecine, classées par année.'} />
      {course ? <section className="shell pb-28" aria-label="Aperçu du cours"><div className="overflow-hidden rounded-2xl border border-ink-12 bg-ink-04"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-12 bg-paper p-5 sm:px-8"><p className="text-sm">Aperçu · Les {course.previewPages} premières pages uniquement</p><a href={course.previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">Ouvrir l’aperçu PDF ↗</a></div><object data={`${course.previewUrl}#view=FitH`} type="application/pdf" aria-label={`${course.title} : les ${course.previewPages} premières pages`} className="block h-[75vh] min-h-96 w-full"><div className="px-6 py-24 text-center"><p>Ouvrez cet aperçu dans un nouvel onglet.</p><a href={course.previewUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-paper">Lire l’aperçu de {course.previewPages} pages ↗</a></div></object></div><div className="mt-6 flex flex-wrap justify-between gap-4 text-sm text-ink-56"><p>Vous consultez un aperçu limité de ce cours.</p><Link href={`/fr/courses/year-${course.year}`} className="underline underline-offset-4">← Retour à la {frenchYear(course.year)}</Link></div></section> : <CourseLibrary year={year} locale="fr" />}
    </div>;
  }
  const specialty = parts[1];
  const year = parts[2] ? Number(parts[2].replace('year-', '')) : undefined;
  const book = frenchBooks.find(b => b.href === `/fr${path}`);
  const selected = frenchBooks.filter(b => (!specialty || b.specialty === specialty) && (!year || b.year === year));
  const crumbs = [{ label: 'The Wiz', href: '/fr' }, { label: 'Livres', href: '/fr/books' }, ...(specialty ? [{ label: specialtyNames[specialty], href: `/fr/books/${specialty}` }] : []), ...(year ? [{ label: frenchYear(year), href: `/fr/books/${specialty}/year-${year}` }] : []), ...(book ? [{ label: book.subject }] : [])];
  return <div lang="fr"><CataloguePageHeader locale="fr" crumbs={crumbs} eyebrow={specialty ? specialtyNames[specialty] : 'Le catalogue'} title={book ? book.subject : year ? frenchYear(year) : specialty ? specialtyNames[specialty] : <>Chaque année.<br /><span className="text-ink-40">Chaque matière.</span></>} intro={book ? book.summary : specialty ? `Découvrez les carnets de ${specialtyNames[specialty].toLowerCase()}${year ? ` de ${frenchYear(year)}` : ''}, matière par matière.` : `${books.length} éditions prévues en médecine, pharmacie et chirurgie dentaire. Une édition disponible, les autres en préparation.`} />
    {book ? <><section className="shell pb-24"><div className="grid gap-12 md:grid-cols-2"><div className="flex justify-center rounded-panel border border-ink-08 bg-ink-04 py-20"><BookCover book={book} locale="fr" /></div><div><h2 className="text-2xl">À l’intérieur</h2><ul className="mt-8">{features.map(f => <li key={f} className="border-t border-ink-08 py-4">✓ {f}</li>)}</ul><p className="mt-8 text-ink-56">{book.status === 'available' ? `${formatPrice(book.price ?? 0)} · ${book.pages} pages` : 'Cette édition est en préparation.'}</p><div id="order" className="mt-8 scroll-mt-28 rounded-2xl bg-ink-04 p-6"><p className="font-medium">Commande et liste d’attente</p><p className="mt-3 text-sm leading-relaxed text-ink-56">La commande en ligne et l’inscription aux listes d’attente ne sont pas encore disponibles sur la version française.</p></div></div></div></section><section className="shell pb-28"><h2 className="mb-8 text-2xl">Dans la même année</h2><div className="grid gap-5 md:grid-cols-3">{selected.filter(b => b.id !== book.id).slice(0,3).map(b => <BookCard key={b.id} book={b} locale="fr" />)}</div><Link href={`/fr/books/${specialty}/year-${year}`} className="mt-8 inline-block underline underline-offset-4">Tous les livres de {frenchYear(year!)}</Link></section></> : <div className="shell pb-28"><Link href="/fr/courses" className="mb-10 block rounded-2xl border border-ink-12 bg-ink-04 p-7"><span className="block text-xl">Explorez les cours MedWIZ ↗</span><span className="mt-2 block text-sm text-ink-56">Parcourez les années et lisez les 10 premières pages de chaque cours.</span></Link><CatalogueBrowser books={selected} lockedSpecialty={specialty} lockedYear={year} locale="fr" /></div>}
  </div>;
}
