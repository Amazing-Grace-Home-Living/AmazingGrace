import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('instruction purge baseline', () => {
  it('removes legacy instruction documents', () => {
    expect(fs.existsSync('.github/copilot-instructions.md')).toBe(false);
    expect(fs.existsSync('docs/rulesets-and-agents.md')).toBe(false);
  });

  it('keeps unified workflow instruction validation strict', () => {
    const workflow = fs.readFileSync('.github/workflows/system-validation.yml', 'utf8');

    expect(workflow).toContain('test ! -f .github/copilot-instructions.md');
    expect(workflow).toContain('test ! -f docs/rulesets-and-agents.md');
  });
});
