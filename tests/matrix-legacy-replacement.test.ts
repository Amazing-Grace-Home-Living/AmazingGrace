import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import viteConfig from '../vite.config';

describe('matrix legacy replacement', () => {
  it('ships matrix-of-conscience arcade route as a standalone Duality Core page', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(matrixOfConscience).toContain('<meta charset="UTF-8">');
    expect(matrixOfConscience).toContain('Matrix of Conscience — Duality Core');
    expect(matrixOfConscience).toContain('id="vitest-assertion-fallbacks"');
  });

  it('loads the standalone Matrix of Conscience entry point', () => {
    const matrixOfConscience = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
    const matrixEntry = fs.readFileSync('arcade/matrix-of-conscience/main.tsx', 'utf8');

    expect(matrixOfConscience).toContain('<script type="module" src="./main.tsx"></script>');
    expect(matrixEntry).toContain('../../src/components/MatrixOfConscience');
    expect(matrixEntry).toContain('activeUser="nicholai_madias"');
  });

  it('exposes the dedicated MatrixOfConscience bundle for matrix subdomain root', () => {
    // @ts-ignore
    const inputs = viteConfig.build.rollupOptions.input;
    const sw = fs.readFileSync('public/sw.js', 'utf8');

    expect(Object.keys(inputs)).toContain('matrixConscienceIndex');
    expect(sw).toContain('./arcade/matrix-of-conscience/index.html');
  });
});
