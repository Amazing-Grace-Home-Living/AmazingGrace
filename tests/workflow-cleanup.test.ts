import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('workflow cleanup', () => {
  it('keeps the verified system validation and support workflows', () => {
    expect(fs.readdirSync('.github/workflows').sort()).toEqual([
      'aurora-dependency-guard.yml',
      'blackduck-security-scan.yml',
      'db.yml',
      'deploy-pages.yml',
      'electra.yml',
      'ella.yml',
      'gemini-code-review.yml',
      'sync-secrets-from-matrix.yml',
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
    expect(workflow).toContain(
      "if: github.ref == 'refs/heads/main' && github.event_name == 'push'"
    );
  });

  it('tracks the Aurora dependency guard workflow configuration', () => {
    const workflow = fs.readFileSync('.github/workflows/aurora-dependency-guard.yml', 'utf8');

    expect(workflow).toContain('name: Aurora — Dependency & Security Guard');
    expect(workflow).toContain("cron: '0 3 * * 0'");
    expect(workflow).toContain('name: Security Audit');
    expect(workflow).toContain('name: Auto-Update Dependencies');
    expect(workflow).toContain('name: License Compliance Check');
    expect(workflow).toContain('peter-evans/create-pull-request@v7');
  });

  it('tracks the updated Electra and Gemini workflow guards', () => {
    const electra = fs.readFileSync('.github/workflows/electra.yml', 'utf8');
    const gemini = fs.readFileSync('.github/workflows/gemini-code-review.yml', 'utf8');

    expect(electra).toContain('checks: read');
    expect(electra).toContain('checks.listForRef');
    expect(electra).toContain('⚡ **Electra**: Auto-merged successfully! All checks passed. 🎉');

    expect(gemini).toContain('concurrency:');
    expect(gemini).toContain('group: gemini-review-${{ github.event.pull_request.number }}');
    expect(gemini).toContain('timeout-minutes: 5');
    expect(gemini).toContain('Get changed files');
    expect(gemini).toContain('google-github-actions/run-gemini-cli@v1');
  });

  it('tracks the Black Duck security scan workflow configuration', () => {
    const workflow = fs.readFileSync('.github/workflows/blackduck-security-scan.yml', 'utf8');

    expect(workflow).toContain("name: Black Duck Security Scan");
    expect(workflow).toContain("uses: blackduck-inc/black-duck-security-scan@v2");
    expect(workflow).toContain("uses: actions/cache@v4");
    expect(workflow).toContain("cron: '0 2 * * 0'");
    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).toContain('cancel-in-progress: true');
  });
});
