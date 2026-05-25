import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('listing gallery links', () => {
  it('renders the 1142 gallery with anchor links on the homepage', () => {
    const home = fs.readFileSync('index.html', 'utf8');

    expect(home).toContain('aria-label="1142 7th Street NW photo gallery"');
    expect(home).toContain('./assets/images/1142-7th-street/889bbd8f-3c61-431a-9da7-d21e0738ec8c.jpg');
    expect(home).toContain('./assets/images/1142-7th-street/9b5c9a4e-78cf-4b3d-bc58-2e63de8971a7.jpg');
    expect(home).toContain('./assets/images/1142-7th-street/7a984ab5-2ec7-4211-bc99-ad8eadec9936.jpg');
    expect(home).toContain('./assets/images/1142-7th-street/eb85c854-4d64-4e6f-a981-632d7af77ca1.jpg');

    const imageRefs = home.match(/\.\/assets\/images\/1142-7th-street\/[a-zA-Z0-9-]+\.(jpg|JPEG)/g) ?? [];
    expect(imageRefs.length).toBeGreaterThanOrEqual(13);

    // Gallery images must be wrapped in anchor links
    expect(home).toMatch(/href="\.\/assets\/images\/1142-7th-street\/889bbd8f[^"]+"/);
    expect(home).toMatch(/href="\.\/assets\/images\/1142-7th-street\/db43caca[^"]+"/);
  });

  it('renders the 1144 gallery with anchor links on the homepage', () => {
    const home = fs.readFileSync('index.html', 'utf8');

    expect(home).toContain('aria-label="1144 7th Street NW photo gallery"');
    expect(home).toContain('./assets/images/1144-7th-street/1144-7th-street-largo.jpg');
    expect(home).toContain('./assets/images/1144-7th-street/image.jpg');
    expect(home).toContain('./assets/images/1144-7th-street/image_67125505.JPG');

    const imageRefs = home.match(/\.\/assets\/images\/1144-7th-street\/[a-zA-Z0-9_.-]+/g) ?? [];
    expect(imageRefs.length).toBeGreaterThanOrEqual(13);

    // Gallery images must be wrapped in anchor links
    expect(home).toMatch(/href="\.\/assets\/images\/1144-7th-street\/1144-7th-street-largo\.jpg"/);
    expect(home).toMatch(/href="\.\/assets\/images\/1144-7th-street\/image\.jpg"/);
  });
});
