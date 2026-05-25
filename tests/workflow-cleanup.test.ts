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

  it('lets Ella inspect any submitted in-repo review for suggestions', () => {
    const ella = fs.readFileSync('.github/workflows/ella.yml', 'utf8');

    expect(ella).toContain("github.event_name == 'pull_request_review'");
    expect(ella).toContain('github.event.pull_request.head.repo.full_name == github.repository');
    expect(ella).not.toContain("github.event.review.state == 'commented'");
  });
});
