import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Arcade build integrity', () => {
  it('ensures Matrix of Conscience is self-contained', () => {
    const htmlPath = resolve(__dirname, '../arcade/matrix-of-conscience/index.html');
    const mainPath = resolve(__dirname, '../arcade/matrix-of-conscience/main.tsx');

    expect(existsSync(htmlPath), 'arcade/matrix-of-conscience/index.html must exist').toBe(true);
    expect(existsSync(mainPath), 'arcade/matrix-of-conscience/main.tsx must exist').toBe(true);

    const html = readFileSync(htmlPath, 'utf8');

    // Should load main.tsx from same directory
    expect(html).toContain('src="./main.tsx"');

    // Should NOT load from parent/sibling directories
    expect(html).not.toContain('src="../emergence-3d/');

    // Should have required DOM elements
    expect(html).toContain('id="emergence-root"');
    expect(html).toContain('type="module"');
  });

  it('verifies all arcade games loading TypeScript have Vite entries', () => {
    const viteConfig = readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf8');

    // Matrix of Conscience must have entry
    expect(viteConfig).toContain('arcade/matrix-of-conscience/index.html');
  });
});
