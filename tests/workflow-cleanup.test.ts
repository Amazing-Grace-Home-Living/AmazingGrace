import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('workflow cleanup', () => {
  it('keeps only the unified system validation workflow', () => {
    expect(fs.readdirSync('.github/workflows').sort()).toEqual([
<<<<<<< HEAD
      'README.md',
      'ci.yml',
      'deploy.yml',
      'ella.yml',
      'firebase.yml',
      'sync-secrets-from-matrix.yml',
    ]);
  });


  it('ensures deploy workflow has comprehensive validation before publishing', () => {
    const deploy = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');

    expect(deploy).toContain('branches: [main]');
    expect(deploy).toContain('npm ci');
    expect(deploy).toContain('npm test -- --passWithNoTests');
    expect(deploy).toContain('npm run typecheck');
    expect(deploy).toContain('npm run build');
    expect(deploy).toContain('Verify critical pages exist');
    expect(deploy).toContain('Check for placeholder content');
    expect(deploy).toContain('Validate internal navigation and asset links');
    expect(deploy).toContain('validate-arcade-dist-links.mjs');
    expect(deploy).toContain('actions/deploy-pages@v5');
  });

  it('keeps firebase deploy validation focused on real filler content and enforces link validation', () => {
    const firebase = fs.readFileSync('.github/workflows/firebase.yml', 'utf8');
    const patternMatch = firebase.match(/grep -RIniE --include='\*\.html' "([^"]+)"/);

    expect(firebase).toContain("npm test -- --passWithNoTests");
    expect(firebase).toContain('normal HTML placeholder attributes do not fail deploy validation');
    expect(firebase).toContain("grep -RIniE --include='*.html'");
    expect(firebase).toContain('lorem ipsum|todo|placeholder text');
    expect(firebase).toContain('- name: Validate arcade navigation and asset links');
    expect(firebase).toContain('validate-arcade-dist-links.mjs');
    expect(firebase).toContain('- name: Validate internal navigation and asset links');
    expect(firebase).not.toContain('continue-on-error: true');
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
=======
      'system-validation.yml',
    ]);
  });

  it('validates unified workflow structure and key checks', () => {
    const workflow = fs.readFileSync('.github/workflows/system-validation.yml', 'utf8');

    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('node-version: 20');
    expect(workflow).toContain('- name: Theme schema validation');
    expect(workflow).toContain('- name: Arcade registry integrity checks');
    expect(workflow).toContain('- name: Game health checks - Star Matrix');
    expect(workflow).toContain('- name: Game health checks - Match Maker');
    expect(workflow).toContain('- name: Game health checks - Trinity');
    expect(workflow).toContain('- name: Instruction layer validation');
    expect(workflow).toContain('- name: Enforce rollback gate on failure');
    expect(workflow).toContain('if: failure()');
>>>>>>> origin/main
  });
});
