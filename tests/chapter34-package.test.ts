import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));

describe('Chapter 3/4 package integration', () => {
  it('registers mirror-path and collapse-engine in story library with relative routes', () => {
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];
    const mirror = entries.find((item: { slug?: string }) => item.slug === 'mirror-path');
    const collapse = entries.find((item: { slug?: string }) => item.slug === 'collapse-engine');

    expect(mirror).toBeTruthy();
    expect(mirror.path).toBe('./mirror-path/');
    expect(collapse).toBeTruthy();
    expect(collapse.path).toBe('./collapse-engine/');
  });

  it('ships chapter pages, package manifests, and OST metadata files', () => {
    expect(fs.existsSync('stories/mirror-path/index.html')).toBe(true);
    expect(fs.existsSync('stories/collapse-engine/index.html')).toBe(true);
    expect(fs.existsSync('stories/chapter-34-package/package.json')).toBe(true);
    expect(fs.existsSync('stories/chapter-34-package/mirror-path-traversal.json')).toBe(true);
    expect(fs.existsSync('stories/chapter-34-package/collapse-engine-arena.json')).toBe(true);
    expect(fs.existsSync('stories/chapter-34-package/prototype-loop.json')).toBe(true);
    expect(fs.existsSync('OST/index.html')).toBe(true);
    expect(fs.existsSync('OST/index.json')).toBe(true);
    expect(fs.existsSync('OST/03_MirrorPath/03_MirrorPath_metadata.json')).toBe(true);
    expect(fs.existsSync('OST/04_CollapseEngine/04_CollapseEngine_metadata.json')).toBe(true);
  });

  it('includes chapter pages in Vite input and copies package folders to dist', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    expect(viteConfig).toContain('stories/mirror-path/index.html');
    expect(viteConfig).toContain('stories/collapse-engine/index.html');
    expect(viteConfig).toContain("resolve(__dirname, 'stories/chapter-34-package')");
    expect(viteConfig).toContain("resolve(__dirname, 'OST')");
  });

  it('keeps next-story and package links below main content and free from dead chapter routes', () => {
    const chapter3 = fs.readFileSync('stories/mirror-path/index.html', 'utf8');
    const chapter4 = fs.readFileSync('stories/collapse-engine/index.html', 'utf8');

    expect(chapter3).toContain('Instructions & related links (kept below primary content)');
    expect(chapter4).toContain('Instructions & related links (kept below primary content)');
    expect(chapter3).toContain('href="../collapse-engine/"');
    expect(chapter4).toContain('href="../mirror-path/"');
    expect(chapter3).not.toContain('href="#"');
    expect(chapter4).not.toContain('href="#"');
  });
});
