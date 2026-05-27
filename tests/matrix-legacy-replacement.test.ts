import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import viteConfig from '../vite.config';

describe('matrix legacy replacement', () => {
  it('redirects the legacy matrix-of-conscience arcade route into Star Matrix', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(matrixOfConscience).toContain('<meta charset="UTF-8">');
    expect(matrixOfConscience).toContain('http-equiv="refresh"');
    expect(matrixOfConscience).toContain('url=../star-matrix/');
    expect(matrixOfConscience).toContain('Star Matrix');
    expect(matrixOfConscience).not.toContain('M45 Seven Sisters Alignment');
  });

  it('removes the redundant matrix-legacy route file and build input', () => {
    const input = Object.values(viteConfig.build?.rollupOptions?.input as Record<string, string>);

    expect(fs.existsSync('arcade/matrix-legacy/index.html')).toBe(false);
    expect(input.some((value) => value.includes('arcade/matrix-legacy/index.html'))).toBe(false);
  });
});
