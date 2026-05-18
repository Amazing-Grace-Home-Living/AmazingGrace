import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import viteConfig from '../vite.config';

describe('matrix legacy replacement', () => {
  it('serves legacy protocol content from matrix-of-conscience route', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
    const charsetIndex = matrixOfConscience.indexOf('<meta charset="UTF-8">');
    const analyticsIndex = matrixOfConscience.indexOf('https://www.googletagmanager.com/gtag/js?id=G-HKZ2G2VN78');

    expect(matrixOfConscience).toContain('Matrix of Conscience: Legacy Protocol');
    expect(matrixOfConscience).toContain("font-family: 'VT323', monospace;");
    expect(matrixOfConscience).toContain('<meta property="og:url" content="https://amazinggracehl.org/arcade/matrix-of-conscience/">');
    expect(charsetIndex).toBeGreaterThanOrEqual(0);
    expect(analyticsIndex).toBeGreaterThan(charsetIndex);
  });

  it('removes the redundant matrix-legacy route file and build input', () => {
    const input = Object.values(viteConfig.build?.rollupOptions?.input as Record<string, string>);

    expect(fs.existsSync('arcade/matrix-legacy/index.html')).toBe(false);
    expect(input.some((value) => value.includes('arcade/matrix-legacy/index.html'))).toBe(false);
  });
});
