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

<<<<<<< HEAD
  it('keeps firebase workflow validating arcade game routes and scripts on pull requests', () => {
    const workflow = fs.readFileSync('.github/workflows/firebase.yml', 'utf8');

    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('test -f dist/arcade/star-matrix/index.html');
    expect(workflow).toContain('test -f dist/arcade/matrix-of-conscience/index.html');
    expect(workflow).toContain('test -f dist/arcade/matrix-of-conscience-terminal/index.html');
    expect(workflow).toContain('test -f dist/arcade/bible-study/index.html');
    expect(workflow).toContain('test -f dist/arcade/syndicate-siege/index.html');
    expect(workflow).toContain('test -f dist/arcade.html');
    expect(workflow).toContain('test -f dist/arcade/js/rebellion-core.js');
    expect(workflow).toContain('test -f dist/arcade/js/lore-archive.js');
    expect(workflow).toContain('test -f dist/arcade/js/lore-files.js');
    expect(workflow).toContain('test -f dist/arcade/js/cosmetics.js');
    expect(workflow).toContain('test -f dist/arcade/js/elite-animations.js');
=======
  it('keeps unified workflow validating arcade checks on pull requests', () => {
    const workflow = fs.readFileSync('.github/workflows/system-validation.yml', 'utf8');

    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('- name: Arcade registry integrity checks');
    expect(workflow).toContain('npm test -- tests/arcade-games-validation.test.ts');
>>>>>>> origin/main
  });
});
