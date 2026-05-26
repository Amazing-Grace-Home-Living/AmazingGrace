import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('dist link validator script', () => {
  it('only parses meta content for refresh URLs instead of all content attributes', () => {
    const script = fs.readFileSync('scripts/validate-dist-links.mjs', 'utf8');

    expect(script).toContain('http-equiv=["\']refresh["\']');
    expect(script).toContain('url\\s*=\\s*');
    expect(script).not.toContain('/content=["\']([^"\']+)["\']/gi');
  });
});
