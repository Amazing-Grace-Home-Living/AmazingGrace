import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import viteConfig from '../vite.config';

describe('matrix legacy replacement', () => {
  it('serves legacy protocol content from matrix-of-conscience route', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(matrixOfConscience).toContain('Matrix of Conscience: Legacy Protocol');
    expect(matrixOfConscience).toContain("font-family: 'VT323', monospace;");
  });

  it('removes the redundant matrix-legacy route file and build input', () => {
    const input = Object.values(viteConfig.build?.rollupOptions?.input as Record<string, string>).map(String);

    expect(fs.existsSync('arcade/matrix-legacy/index.html')).toBe(false);
    expect(input.some((value) => value.includes('arcade/matrix-legacy/index.html'))).toBe(false);
  });
});
