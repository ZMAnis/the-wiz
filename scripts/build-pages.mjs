import { rename, writeFile, readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { PDFDocument } from 'pdf-lib';

const courses = JSON.parse(await readFile('lib/courses.generated.json', 'utf8'));
for (const course of courses) {
  const pdf = await PDFDocument.load(await readFile(`public/course-previews/${course.id}.pdf`));
  if (pdf.getPageCount() !== course.previewPages || course.previewPages > 10) {
    throw new Error(`Invalid public preview: ${course.id}`);
  }
}

// Preserve the server endpoint for normal Next.js deployments.
const route = 'app/api/order/route.ts';
await rename(route, `${route}.disabled`);
try {
  const build = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
    stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_GITHUB_PAGES: 'true' },
  });
  if (build.status !== 0) throw new Error('GitHub Pages build failed');
  await writeFile('.next-pages/.nojekyll', '');
  async function setFrenchLanguage(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await setFrenchLanguage(path);
      else if (entry.name.endsWith('.html')) {
        const html = await readFile(path, 'utf8');
        await writeFile(path, html.replace('<html lang="en"', '<html lang="fr"').replace('Skip to content', 'Aller au contenu'));
      }
    }
  }
  await setFrenchLanguage('.next-pages/fr');
} finally {
  await rename(`${route}.disabled`, route);
}
