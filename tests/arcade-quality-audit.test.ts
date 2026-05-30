import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

describe('arcade quality audit', () => {
  it('copies legacy arcade runtime scripts into dist for game pages that load ../js/*.js', () => {
    execSync('npm run build', { stdio: 'pipe' });

    expect(fs.existsSync('dist/arcade/js/rebellion-core.js')).toBe(true);
    expect(fs.existsSync('dist/arcade/js/lore-archive.js')).toBe(true);
    expect(fs.existsSync('dist/arcade/js/lore-files.js')).toBe(true);
    expect(fs.existsSync('dist/arcade/js/cosmetics.js')).toBe(true);
    expect(fs.existsSync('dist/arcade/js/elite-animations.js')).toBe(true);
  });

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
  });
});
