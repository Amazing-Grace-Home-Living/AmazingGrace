import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('workflow cleanup', () => {
  it('keeps only the unified system validation workflow', () => {
    expect(fs.readdirSync('.github/workflows').sort()).toEqual([
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
  });
});
