import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('story route cleanup', () => {
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
      expect(entry.path, `entry "${entry.slug}" has non-relative path`).toMatch(/^\.\//);
    }
    for (const character of characters) {
      expect(character.path, `character "${character.slug}" has non-relative path`).toMatch(/^\.\//);
    }
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
