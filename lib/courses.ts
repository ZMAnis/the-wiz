import data from './courses.generated.json';
import { assetPath } from './hosting';

export const courses = data.map(course => ({ ...course, previewUrl: assetPath(course.previewUrl) }));
export type Course = (typeof courses)[number];
export const courseYears = [...new Set(courses.map(course => course.year))].sort((a, b) => a - b);
export const courseHref = (course: Course) => `/courses/year-${course.year}/${course.slug}`;
