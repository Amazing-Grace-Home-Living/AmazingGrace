import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));

describe('The 2027 Rebellion library integration', () => {
  it('registers the story with preview-safe relative path metadata', () => {
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];
    const entry = entries.find((item: { slug?: string }) => item.slug === 'rebellion2027');

    expect(entry).toBeTruthy();
    expect(entry.path).toBe('./rebellion2027/');
    expect(entry.series).toBe('Matrix of Conscience');
    expect(entry.summary).toContain('Nexus Prime');
  });

  it('ships the story page with lore-chain links', () => {
    const storyPath = 'stories/rebellion2027/index.html';
    expect(fs.existsSync(storyPath)).toBe(true);

    const html = fs.readFileSync(storyPath, 'utf8');
    expect(html).toContain('<h1 class="hero-title" id="story-title">The 2027 Rebellion</h1>');
    expect(html).toContain('https://github.com/user-attachments/assets/0ad97551-f128-4b35-b39e-d24f9d6b8eb0');
    expect(html).toContain('href="../nexus-prime-2087/"');
    expect(html).toContain('href="../our-covenant-of-new-beginnings/"');
    expect(html).toContain('href="../../arcade/matrix-of-conscience/"');
  });

  it('includes the story page and legacy redirect page in Vite multi-page build inputs', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    expect(viteConfig).toContain('stories/rebellion2027/index.html');
    expect(viteConfig).toContain('stories/blog/rebellion.html');
  });

  it('emits the legacy redirect page to dist/ after build, preserving the old URL', () => {
    execSync('npm run build', { stdio: 'pipe' });

    expect(fs.existsSync('dist/stories/blog/rebellion.html')).toBe(true);

    const html = fs.readFileSync('dist/stories/blog/rebellion.html', 'utf8');
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=../rebellion2027/">');
    expect(html).toContain('href="../rebellion2027/"');
  }, 45000);
});
