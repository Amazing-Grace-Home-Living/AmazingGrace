import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('workflow cleanup', () => {
  it('has the expected workflows in the repository', () => {
    expect(fs.readdirSync('.github/workflows').sort()).toEqual([
      'deploy.yml',
      'ella.yml',
      'firebase.yml',
    ]);
  });

  it('keeps deploy focused on publishing the site from main without running tests', () => {
    const deploy = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');

    expect(deploy).toContain('branches: [main]');
    expect(deploy).toContain('npm ci');
    expect(deploy).toContain('npm run build');
    expect(deploy).toContain('actions/deploy-pages@v5');
    expect(deploy).not.toContain('npm test');
  });
});
