import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import viteConfig from '../vite.config';

describe('matrix legacy replacement', () => {
  it('serves modern protocol content from matrix-of-conscience route', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
    const charsetIndex = matrixOfConscience.indexOf('<meta charset="UTF-8">');

    expect(matrixOfConscience).toContain('Matrix of Conscience');
    expect(matrixOfConscience).toContain('M45 Seven Sisters Alignment');
    expect(matrixOfConscience).toContain("font-family: 'Courier New', Courier, monospace;");
    expect(charsetIndex).toBeGreaterThanOrEqual(0);
  });

  it('removes the redundant matrix-legacy route file and build input', () => {
    const input = Object.values(viteConfig.build?.rollupOptions?.input as Record<string, string>);

    expect(fs.existsSync('arcade/matrix-legacy/index.html')).toBe(false);
    expect(input.some((value) => value.includes('arcade/matrix-legacy/index.html'))).toBe(false);
  });
});
