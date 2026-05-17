import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));

describe('Noah and the Ark library integration', () => {
  it('registers the story with preview-safe relative path metadata', () => {
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];
    const entry = entries.find((item: { slug?: string }) => item.slug === 'noah-and-the-ark');

    expect(entry).toBeTruthy();
    expect(entry.path).toBe('./noah-and-the-ark/');
    expect(entry.series).toBe('Genesis Foundations');
    expect(entry.summary).toContain('covenant');
  });

  it('ships a story page without broken local hotlink placeholders', () => {
    const storyPath = 'stories/noah-and-the-ark/index.html';
    expect(fs.existsSync(storyPath)).toBe(true);

    const html = fs.readFileSync(storyPath, 'utf8');
    expect(html).toContain('<h1 class="hero-title">Noah and the Ark</h1>');
  });

  it('includes the story page in Vite multi-page build inputs', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    expect(viteConfig).toContain('stories/noah-and-the-ark/index.html');
  });
});
