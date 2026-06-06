import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('workflow cleanup', () => {
  it('keeps the verified system validation and support workflows', () => {
    expect(fs.readdirSync('.github/workflows').sort()).toEqual([
      'blackduck-security-scan.yml',
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
      "if: github.ref == 'refs/heads/main' && github.event_name == 'push' && secrets.FIREBASE_SERVICE_ACCOUNT_AMAZING_GRACE_HL_BBEAA != ''"
    );
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
