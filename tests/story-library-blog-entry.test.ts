import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('story library blog entry', () => {
  it('includes the architectural JS synthesis as a blog entry in stories/library.json', () => {
    const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];

    const entry = entries.find((e: { slug?: string }) => e.slug === 'blog-architectural-js-synthesis');
    expect(entry).toBeTruthy();
    expect(entry.type).toBe('blog');
    expect(entry.path).toBe('./blog/architectural-js-synthesis.html');
  });

  it('references an existing blog HTML file', () => {
    expect(fs.existsSync('stories/blog/architectural-js-synthesis.html')).toBe(true);
  });
});
