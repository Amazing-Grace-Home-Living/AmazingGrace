import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Rulesets and agents documentation', () => {
  it('documents automation branch patterns (including copilot/*)', () => {
    const doc = fs.readFileSync('docs/rulesets-and-agents.md', 'utf8');
    expect(doc).toContain('- `codex/*`');
    expect(doc).toContain('- `copilot/*`');
  });

  it('documents Copilot as a ruleset bypass actor', () => {
    const doc = fs.readFileSync('docs/rulesets-and-agents.md', 'utf8');
    expect(doc).toContain('**GitHub Copilot**');
    expect(doc).toContain('`Copilot coding agent`');
  });
});

