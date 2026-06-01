import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

describe('library.json dist deployment', () => {
  it('builds and copies stories/library.json to dist/stories/library.json', () => {
    // Run a production build if not already built
    if (!fs.existsSync('dist/stories/library.json')) {
      execSync('npm run build', { stdio: 'pipe' });
    }

    // Verify the source file exists
    expect(fs.existsSync('stories/library.json')).toBe(true);

    // Verify the file is copied to dist
    expect(fs.existsSync('dist/stories/library.json')).toBe(true);

    // Verify the content is valid JSON
    const distContent = fs.readFileSync('dist/stories/library.json', 'utf8');
    const data = JSON.parse(distContent);

    // Verify basic structure
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('entries');
    expect(Array.isArray(data.entries)).toBe(true);
    expect(data.entries.length).toBeGreaterThan(0);
  }, 45000);

  it('library.json contains all required entry fields', () => {
    const sourceContent = fs.readFileSync('stories/library.json', 'utf8');
    const data = JSON.parse(sourceContent);

    data.entries.forEach((entry: any) => {
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('slug');
      expect(entry).toHaveProperty('path');
      expect(entry.path).toBeTruthy();
    });
  });
});
