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

  it('keeps unified workflow validating arcade checks on pull requests', () => {
    const workflow = fs.readFileSync('.github/workflows/system-validation.yml', 'utf8');

    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('- name: Arcade registry integrity checks');
    expect(workflow).toContain('npm test -- tests/arcade-games-validation.test.ts');
  });
});
