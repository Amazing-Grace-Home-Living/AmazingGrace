import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('story library news entries', () => {
  it('includes news articles as blog entries in stories/library.json', () => {
    const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];

    const zyko = entries.find((entry: { slug?: string }) => entry.slug === 'news-zyko-learn');
    expect(zyko).toBeTruthy();
    expect(zyko.type).toBe('blog');
    expect(zyko.source).toBe('news');
    expect(zyko.path).toBe('../news/articles/zyko-learn.html');
  });
});

