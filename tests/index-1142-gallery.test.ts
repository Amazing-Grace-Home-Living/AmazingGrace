import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('1142 listing gallery', () => {
  it('renders the expanded 1142 image gallery on the homepage', () => {
    const home = fs.readFileSync('index.html', 'utf8');

    expect(home).toContain('aria-label="1142 7th Street NW photo gallery"');
    expect(home).toContain('./assets/images/1142-7th-street/889bbd8f-3c61-431a-9da7-d21e0738ec8c.jpg');
    expect(home).toContain('./assets/images/1142-7th-street/9b5c9a4e-78cf-4b3d-bc58-2e63de8971a7.jpg');
    expect(home).toContain('./assets/images/1142-7th-street/7a984ab5-2ec7-4211-bc99-ad8eadec9936.jpg');
    expect(home).toContain('./assets/images/1142-7th-street/eb85c854-4d64-4e6f-a981-632d7af77ca1.jpg');

    const imageRefs = home.match(/\.\/assets\/images\/1142-7th-street\/[a-zA-Z0-9-]+\.(jpg|JPEG)/g) ?? [];
    expect(imageRefs.length).toBeGreaterThanOrEqual(13);
  });
});
