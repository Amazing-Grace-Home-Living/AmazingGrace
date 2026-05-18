import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('story route cleanup', () => {
  it('removes Matrix act placeholder routes from active entry points', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    const arcade = fs.readFileSync('arcade/index.html', 'utf8');
    const serviceWorker = fs.readFileSync('public/sw.js', 'utf8');

    expect(viteConfig).not.toContain('matrix-act-1');
    expect(viteConfig).not.toContain('matrix-act-2');
    expect(arcade).not.toContain('matrix-act-1');
    expect(arcade).not.toContain('Matrix Act 1');
    expect(serviceWorker).not.toContain('matrix-act-1');
    expect(serviceWorker).not.toContain('matrix-act-2');
  });

  it('routes noah-and-the-ark with a preview-safe relative path in library.json', () => {
    const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];
    const entry = entries.find((item: { slug?: string }) => item.slug === 'noah-and-the-ark');

    expect(entry).toBeTruthy();
    expect(entry.path).toBe('./noah-and-the-ark/');
  });

  it('uses preview-safe relative paths for all library entries and characters', () => {
    const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];
    const characters = Array.isArray(libraryJson.characters) ? libraryJson.characters : [];

    for (const entry of entries) {
      expect(entry.path, `entry "${entry.slug}" has non-relative path`).toMatch(/^\.\.?\//);
    }
    for (const character of characters) {
      expect(character.path, `character "${character.slug}" has non-relative path`).toMatch(/^\.\//);
    }
  });

  it('uses content-based story routes instead of generic storybook names', () => {
    const library = fs.readFileSync('stories/library.json', 'utf8');
    const libraryJson = JSON.parse(library);
    const lampStory = fs.readFileSync('stories/books/the-lamp-in-the-window.html', 'utf8');
    const exposeStory = fs.readFileSync('stories/expose-the-matrix/index.html', 'utf8');

    expect(library).not.toContain('storybook-1');
    expect(library).not.toContain('storybook-2');
    expect(new Set(libraryJson.entries.map((entry: { slug?: string }) => entry.slug)).size).toBe(
      libraryJson.entries.length
    );
    expect(new Set(libraryJson.entries.map((entry: { path?: string }) => entry.path)).size).toBe(
      libraryJson.entries.length
    );
    expect(library).toContain('./books/the-lamp-in-the-window.html');
    expect(library).toContain('./noah-and-the-ark/');
    expect(lampStory).not.toContain('storybook-2');
    expect(lampStory).not.toContain('Next: Noah and the Ark');
    expect(lampStory).not.toContain('class="book-nav"');
    expect(exposeStory).not.toContain('storybook-2');
  });

  it('includes the noah-and-the-ark page in Vite multi-page build inputs', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    expect(viteConfig).toContain('stories/noah-and-the-ark/index.html');
  });

  it('ships a noah-and-the-ark story page', () => {
    const storyPath = 'stories/noah-and-the-ark/index.html';
    expect(fs.existsSync(storyPath)).toBe(true);

    const html = fs.readFileSync(storyPath, 'utf8');
    expect(html).toContain('<h1 class="hero-title">Noah and the Ark</h1>');
  });
});
