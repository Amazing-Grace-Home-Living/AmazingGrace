import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import viteConfig from '../vite.config';

describe('site cleanup', () => {
  it('keeps listing assets local and removes Google Drive/gallery dependencies from the homepage', () => {
    const home = fs.readFileSync('index.html', 'utf8');
    const listingData = fs.readFileSync('src/data/listings.ts', 'utf8');

    expect(home).toContain('./assets/logo.png');
    expect(listingData).toContain('./assets/images/926-poinsettia/');
    expect(listingData).toContain('./assets/images/1142-7th-street/');
    expect(listingData).toContain('./assets/images/1144-7th-street/');
    expect(home).toContain('id="listing-search-root"');
    expect(home).not.toContain('class="property-grid" style="display:none"');
    expect(home).not.toContain('drive.google.com');
    expect(home).not.toContain('/galleries/');
  });

  it('removes gallery build/runtime files and unfinished Relic Runner stubs', () => {
    expect(fs.existsSync('galleries')).toBe(false);
    expect(fs.existsSync('public/galleries')).toBe(false);
    expect(fs.existsSync('public/images')).toBe(false);
    expect(fs.existsSync('js/galleries.js')).toBe(false);
    expect(fs.existsSync('public/js/galleries.js')).toBe(false);
    expect(fs.existsSync('scripts/gen-gallery-images.mjs')).toBe(false);
    expect(fs.existsSync('scripts/build-galleries.mjs')).toBe(false);
    expect(fs.existsSync('arcade/arcade/relic-runner')).toBe(false);
    expect(fs.existsSync('arcade/relic')).toBe(false);
  });

  it('removes broken arcade prototype files', () => {
    expect(fs.existsSync('arcade/matchMaker.html')).toBe(false);
    expect(fs.existsSync('arcade/matrix.HTML')).toBe(false);
    expect(fs.existsSync('arcade/The Star Matrix.js')).toBe(false);
    expect(fs.existsSync('arcade/Enter the Matrix of Conscience')).toBe(false);
  });

  it('removes gallery routes from config, sitemap, and cross-site navigation', () => {
    const input = Object.values(viteConfig.build?.rollupOptions?.input as Record<string, string>).map(String);
    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
    const arcade = fs.readFileSync('arcade/index.html', 'utf8');
    const contact = fs.readFileSync('contact/index.html', 'utf8');
    const ministry = fs.readFileSync('ministry/index.html', 'utf8');
    const constellationNav = fs.readFileSync('constellation-nav.js', 'utf8');

    expect(input.some((value) => value.includes('galleries/'))).toBe(false);
    expect(sitemap).not.toContain('/galleries/');
    expect(arcade).not.toContain('/galleries/');
    expect(contact).not.toContain('/galleries/');
    expect(ministry).not.toContain('/galleries/');
    expect(constellationNav).toContain("label: 'Listings'");
    expect(constellationNav).not.toContain("/galleries/");
  });
});
