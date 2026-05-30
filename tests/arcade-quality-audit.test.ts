import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('arcade quality audit', () => {
  it('copies legacy arcade runtime scripts to dist/arcade/js during build', () => {
    const config = fs.readFileSync('vite.config.ts', 'utf8');

    expect(config).toContain('cpSync(');
    expect(config).toContain("resolve(__dirname, 'arcade/js')");
    expect(config).toContain("resolve(__dirname, 'dist/arcade/js')");
    expect(config).toContain("recursive: true");
  });

  it('keeps firebase workflow validating arcade game routes and scripts on pull requests', () => {
    const workflow = fs.readFileSync('.github/workflows/firebase.yml', 'utf8');

    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('test -f dist/arcade/matrix-of-conscience/index.html');
    expect(workflow).toContain('test -f dist/arcade/bible-study/index.html');
    expect(workflow).toContain('test -f dist/arcade/js/rebellion-core.js');
    expect(workflow).toContain('test -f dist/arcade/js/lore-archive.js');
    expect(workflow).toContain('test -f dist/arcade/js/lore-files.js');
    expect(workflow).toContain('test -f dist/arcade/js/cosmetics.js');
    expect(workflow).toContain('test -f dist/arcade/js/elite-animations.js');
  });
});
