import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Recursively find HTML files
function findHtmlFiles(dir: string, exclude: string[] = []): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (exclude.some(ex => relativePath.includes(ex))) continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(fullPath, exclude));
    } else if (item.endsWith('.html')) {
      files.push(relativePath);
    }
  }

  return files;
}

describe('Color Contrast Validation', () => {
  it('should not have invalid color values in CSS variables', () => {
    const htmlFiles = findHtmlFiles(process.cwd(), ['node_modules', 'dist']);

    const invalidPatterns = [
      /--text:\s*#0{3,6}(?:[^0-9a-f]|$)/i,  // --text should not be black (#000, #0000, #00000, #000000)
      /NicholaiMadias\/AmazingGrace/,  // Should never have repo references as colors
    ];

    const issues: string[] = [];

    for (const file of htmlFiles) {
      const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');

      for (const pattern of invalidPatterns) {
        if (pattern.test(content)) {
          issues.push(`${file}: Found potentially invalid color pattern: ${pattern}`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('should have light text colors on dark backgrounds', () => {
    const htmlFiles = findHtmlFiles(process.cwd(), ['node_modules', 'dist', 'support']);  // Support page uses light theme

    const issues: string[] = [];

    for (const file of htmlFiles) {
      const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');

      // Check if page uses dark background
      const hasDarkBg = /--bg:\s*#[0-2][0-9a-f]{5}/i.test(content) ||
                        /background[^:]*:\s*#[0-2][0-9a-f]{5}/i.test(content);

      if (hasDarkBg) {
        // Ensure text color is light (starts with high hex values) OR uses CSS variables OR links external stylesheet
        const hasLightText = /--text:\s*#[c-f][0-9a-f]{5}/i.test(content) ||
                            /color:\s*#[c-f][0-9a-f]{5}/i.test(content) ||
                            /color:\s*var\(--/i.test(content) ||
                            /<link[^>]*stylesheet[^>]*\.css/i.test(content);

        if (!hasLightText) {
          issues.push(`${file}: Dark background without light text color`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('should not have black text (#000, #000000, black) on dark backgrounds in main pages', () => {
    const mainPages = [
      'index.html',
      'arcade/index.html',
      'ministry/index.html',
      'stories/index.html'
    ];

    const issues: string[] = [];

    for (const file of mainPages) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for black text
      const hasBlackText = /color:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))/i.test(content);
      const hasDarkBg = /background[^:]*:\s*#[0-2][0-9a-f]{5}/i.test(content);

      if (hasBlackText && hasDarkBg) {
        issues.push(`${file}: Has black text on dark background`);
      }
    }

    expect(issues).toEqual([]);
  });
});
