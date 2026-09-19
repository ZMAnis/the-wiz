export const githubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';
export const assetPath = (path: string) => `${githubPages ? '/the-wiz' : ''}${path}`;
