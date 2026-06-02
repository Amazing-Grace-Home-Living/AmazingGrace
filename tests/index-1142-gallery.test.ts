import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('listing gallery links', () => {
  it('keeps 1142 listing imagery in canonical listing data instead of heavyweight homepage gallery markup', () => {
    const home = fs.readFileSync('index.html', 'utf8');
    const listingData = fs.readFileSync('src/data/listings.ts', 'utf8');

    expect(home).toContain('id="listing-search-root"');
    expect(home).not.toContain('aria-label="1142 7th Street NW photo gallery"');
    expect(listingData).toContain('./assets/images/1142-7th-street/889bbd8f-3c61-431a-9da7-d21e0738ec8c.jpg');
  });

  it('keeps 1144 listing imagery in canonical listing data instead of heavyweight homepage gallery markup', () => {
    const home = fs.readFileSync('index.html', 'utf8');
    const listingData = fs.readFileSync('src/data/listings.ts', 'utf8');

    expect(home).toContain('id="listing-search-root"');
    expect(home).not.toContain('aria-label="1144 7th Street NW photo gallery"');
    expect(listingData).toContain('./assets/images/1144-7th-street/1144-7th-street-largo.jpg');
  });
});
