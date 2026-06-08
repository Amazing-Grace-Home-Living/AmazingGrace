import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('homepage listings content', () => {
  const home = fs.readFileSync('index.html', 'utf8');
  const listingData = fs.readFileSync('src/data/listings.ts', 'utf8');

  it('mounts listing content from the canonical React listing entrypoint', () => {
    expect(home).toContain('Available Housing');
    expect(home).toContain('id="listing-search-root"');
    expect(home).toContain('src="./src/listings-main.tsx"');
    expect(home).not.toContain('class="property-grid" style="display:none"');
  });

  it('uses the updated listing copy for all active properties in canonical listing data', () => {
    expect(listingData).toContain('926 E Poinsettia Ave');
    expect(listingData).toContain('Comfortable all-inclusive housing in central Tampa designed to provide a stable and supportive living environment.');
    expect(home).toContain('926 E Poinsettia Ave — Tampa, FL');
    expect(listingData).toContain('1142 7th Street NW');
    expect(listingData).toContain('Quiet and comfortable housing in Largo offering a stable home base near the Gulf Coast.');
    expect(home).toContain('1142 7th Street NW — Largo, FL');
    expect(listingData).toContain('1144 7th Street NW');
    expect(listingData).toContain('Spacious shared housing adjacent to the primary Largo property with access to the same supportive and all-inclusive amenities.');
    expect(home).toContain('1144 7th Street NW — Largo, FL');
  });

  it('includes shared living expectations beneath the listings', () => {
    expect(home).toContain('Shared Living Expectations');
    expect(home).toContain('Maintain cleanliness in shared spaces');
    expect(home).toContain('Respect quiet hours');
    expect(home).toContain('Treat others with dignity and consideration');
    expect(home).toContain('Follow property guidelines and safety expectations');
  });
});
