import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));

describe('GitHub bypass stories and downloadable tool', () => {
  it('registers both bypass blog entries with preview-safe paths', () => {
    const entries = Array.isArray(libraryJson.entries) ? libraryJson.entries : [];

    const guide = entries.find((item: { slug?: string }) => item.slug === 'fixing-copilot-ruleset-bypass-errors');
    const app = entries.find((item: { slug?: string }) => item.slug === 'github-bypass-setup-app');

    expect(guide).toBeTruthy();
    expect(guide.path).toBe('./fixing-copilot-ruleset-bypass-errors/');
    expect(app).toBeTruthy();
    expect(app.path).toBe('./github-bypass-setup-app/');
  });

  it('ships story pages and download link for the PowerShell bypass app', () => {
    const guideHtml = fs.readFileSync('stories/fixing-copilot-ruleset-bypass-errors/index.html', 'utf8');
    const appHtml = fs.readFileSync('stories/github-bypass-setup-app/index.html', 'utf8');

    expect(guideHtml).toContain('<h1 class="hero-title">Fixing Copilot Ruleset Bypass Errors</h1>');
    expect(appHtml).toContain('download="Add-GitHubRulesetBypass.ps1"');
    expect(appHtml).toContain('../../scripts/Add-GitHubRulesetBypass.ps1');
  });

  it('includes both story pages in Vite multi-page build inputs', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');

    expect(viteConfig).toContain('stories/fixing-copilot-ruleset-bypass-errors/index.html');
    expect(viteConfig).toContain('stories/github-bypass-setup-app/index.html');
  });

  it('provides a repository-scoped helper script for ruleset bypass setup', () => {
    const script = fs.readFileSync('scripts/Add-GitHubRulesetBypass.ps1', 'utf8');

    expect(script).toContain('GitHub Ruleset Bypass Setup Helper');
    expect(script).toContain('github-actions[bot]');
    expect(script).toContain('docs/rulesets-and-agents.md');
  });
});
