import type { MetadataRoute } from "next";

import { books, specialties, yearSlug, yearsOf } from "@/lib/catalogue";
import { site } from "@/lib/content";
import { courses, courseYears, courseHref } from "@/lib/courses";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const specialtyRoutes = specialties.flatMap((specialty) => [
    {
      url: `${site.url}/books/${specialty.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...yearsOf(specialty.slug).map((year) => ({
      url: `${site.url}/books/${specialty.slug}/${yearSlug(year)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  const bookRoutes = books.map((book) => ({
    url: `${site.url}${book.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    // Books you can actually buy outrank the ones still being written.
    priority: book.status === "available" ? 0.9 : 0.5,
  }));

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/books`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...specialtyRoutes,
    ...bookRoutes,
    ...["/courses", ...courseYears.map(year => `/courses/year-${year}`), ...courses.map(courseHref)].map(href => ({ url: `${site.url}${href}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...["", "/books", "/courses", ...specialties.flatMap(s => [`/books/${s.slug}`, ...yearsOf(s.slug).map(year => `/books/${s.slug}/${yearSlug(year)}`)]), ...books.map(b => b.href), ...courseYears.map(year => `/courses/year-${year}`), ...courses.map(courseHref)].map(href => ({ url: `${site.url}/fr${href}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
