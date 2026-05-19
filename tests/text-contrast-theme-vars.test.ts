import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('theme variables', () => {
  it('avoids Tailwind-colliding --text tokens on Tailwind pages', () => {
    const pages = [
      'arcade/index.html',
      'arcade/bible-study/index.html',
      'ministries/index.html',
    ];

    for (const page of pages) {
      const html = fs.readFileSync(page, 'utf8');

      expect(html).toContain('--ag-text');
      expect(html).not.toContain('--text:');
      expect(html).not.toContain('--text-muted:');
      expect(html).not.toContain('var(--text');
      expect(html).not.toContain('var(--text-muted');
    }
  });
});
