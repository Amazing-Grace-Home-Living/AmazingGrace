import { describe, expect, it } from 'vitest';
import fs from 'node:fs';



describe('Rulesets and agents documentation', () => {
  it('documents the Copilot coding agent bypass actor', () => {
    const doc = fs.readFileSync('docs/rulesets-and-agents.md', 'utf8');

    expect(doc).toContain('**GitHub Copilot** (`Copilot coding agent`)');
    expect(doc).toContain('keep working when rulesets require things like signed commits');
  });

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

  it('documents current-PR comment triggers that do not require mentions', () => {
    const doc = fs.readFileSync('docs/rulesets-and-agents.md', 'utf8');

    expect(doc).toContain('new comments on the current PR');
    expect(doc).toContain('PR author, repo owner, or other trusted maintainers');
    expect(doc).toContain('copilot: act');
    expect(doc).toContain('resolve those conflicts before continuing');
    expect(doc).toContain('repository docs alone cannot override it');
  });

  it('documents trusted PR comments as actionable in Copilot instructions', () => {
    const instructions = fs.readFileSync('.github/copilot-instructions.md', 'utf8');

    expect(instructions).toContain('Treat **new comments on the current PR**');
    expect(instructions).toContain('Do **not** require an `@copilot` mention');
    expect(instructions).toContain('copilot: act');
    expect(instructions).toContain('resolve the conflicts before making');
  });
});
