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
    const patternMatch = firebase.match(/grep -RIniE --include='\*\.html' "([^"]+)"/);

    expect(firebase).toContain("npm test -- --passWithNoTests");
    expect(firebase).toContain('normal HTML placeholder attributes do not fail deploy validation');
    expect(firebase).toContain("grep -RIniE --include='*.html'");
    expect(firebase).toContain('lorem ipsum|todo|placeholder text');
    expect(firebase).not.toContain('coming soon|todo|placeholder');
    expect(firebase).toMatch(
      /- name: Run tests[\s\S]*npm test -- --passWithNoTests[\s\S]*- name: Type check[\s\S]*- name: Build production bundle[\s\S]*- name: Check for placeholder content/,
    );
    expect(patternMatch).not.toBeNull();

    const placeholderPattern = new RegExp(patternMatch?.[1] ?? '', 'i');

    expect(placeholderPattern.test('<p>Lorem ipsum</p>')).toBe(true);
    expect(placeholderPattern.test('<section>TODO</section>')).toBe(true);
    expect(placeholderPattern.test('<div>placeholder text</div>')).toBe(true);
    expect(placeholderPattern.test('<input placeholder=\"Your name\">')).toBe(false);
  });

  it('keeps Ella automation for conflict syncing and trusted recommendation application', () => {
    const ella = fs.readFileSync('.github/workflows/ella.yml', 'utf8');

    expect(ella).toContain('sync-conflicted-branch');
    expect(ella).toContain("github.event.review.author_association == 'OWNER'");
    expect(ella).toContain("github.event.review.author_association == 'MEMBER'");
    expect(ella).toContain("github.event.review.author_association == 'COLLABORATOR'");
    expect(ella).toContain("grep -Eiq 'resolve conflicts?|merge conflicts?'");
    expect(ella).toContain('git merge --no-edit "origin/$BASE_REF"');
    expect(ella).toContain('git checkout --ours .');
    expect(ella).toContain('node scripts/ella-auto-apply-review.js --apply');
  });
});
