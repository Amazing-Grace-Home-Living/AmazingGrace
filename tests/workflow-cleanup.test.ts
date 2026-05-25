import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('workflow cleanup', () => {
  it('has the expected workflows in the repository', () => {
    expect(fs.readdirSync('.github/workflows').sort()).toEqual([
      'deploy.yml',
      'ella.yml',
      'firebase.yml',
      'sync-secrets-from-matrix.yml',
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

  it('keeps firebase deploy validation focused on real filler content', () => {
    const firebase = fs.readFileSync('.github/workflows/firebase.yml', 'utf8');

    const testStepIndex = firebase.indexOf("npm test -- --passWithNoTests");
    const placeholderStepIndex = firebase.indexOf('Check for placeholder content');

    expect(firebase).toContain("npm test -- --passWithNoTests");
    expect(firebase).toContain("grep -RInE --include='*.html'");
    expect(firebase).toContain('lorem ipsum|todo|placeholder text');
    expect(firebase).not.toContain('coming soon|todo|placeholder');
    expect(testStepIndex).toBeGreaterThanOrEqual(0);
    expect(placeholderStepIndex).toBeGreaterThan(testStepIndex);
  });
});
