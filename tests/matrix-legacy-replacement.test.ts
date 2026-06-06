import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import viteConfig from '../vite.config';

describe('matrix legacy replacement', () => {
  it('ships matrix-of-conscience arcade route as a standalone Duality Core page', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(matrixOfConscience).toContain('<meta charset="UTF-8">');
    expect(matrixOfConscience).toContain('Matrix of Conscience — Duality Core');
    expect(matrixOfConscience).toContain('id="btn-weave"');
    expect(matrixOfConscience).not.toContain('http-equiv="refresh"');
  });


  it('loads the standalone Matrix of Conscience entry point instead of emergence 3D', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
    const matrixEntry = fs.readFileSync('arcade/matrix-of-conscience/main.tsx', 'utf8');

    expect(matrixOfConscience).toContain('<script type="module" src="./main.tsx"></script>');
    expect(matrixOfConscience).not.toContain('../emergence-3d/main.tsx');
    expect(matrixEntry).toContain('../../src/arcade/matrix-of-conscience/MatrixOfConscience');
    expect(matrixEntry).toContain('activeUser="nicholai_madias"');
  });

  it('removes matrix-legacy route and keeps matrix-of-conscience as its own sw fallback', () => {
    const input = Object.values(viteConfig.build?.rollupOptions?.input as Record<string, string>);
    const sw = fs.readFileSync('public/sw.js', 'utf8');

    expect(fs.existsSync('arcade/matrix-legacy/index.html')).toBe(false);
    expect(input.some((value) => value.includes('arcade/matrix-legacy/index.html'))).toBe(false);
    expect(sw).toContain('./arcade/matrix-of-conscience/index.html');
    expect(sw).toContain("['/arcade/matrix-of-conscience/', './arcade/matrix-of-conscience/index.html']");
  });
});
