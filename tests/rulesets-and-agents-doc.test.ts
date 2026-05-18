import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('rulesets and agents documentation', () => {
  it('documents the Copilot coding agent bypass actor', () => {
    const doc = fs.readFileSync('docs/rulesets-and-agents.md', 'utf8');

    expect(doc).toContain('**GitHub Copilot** (`Copilot coding agent`)');
    expect(doc).toContain('keep working when rulesets require things like signed commits');
  });
});
