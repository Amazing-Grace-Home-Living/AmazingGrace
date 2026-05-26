import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('homepage listings content', () => {
  const home = fs.readFileSync('index.html', 'utf8');

  it('uses the updated listing copy for all active properties', () => {
    expect(home).toContain('Available Housing');
    expect(home).toContain('926 E Poinsettia Ave — Tampa, FL');
    expect(home).toContain('Comfortable all-inclusive housing in central Tampa designed to provide a stable and supportive living environment.');
    expect(home).toContain('1142 7th Street NW — Largo, FL');
    expect(home).toContain('Quiet and comfortable housing in Largo offering a stable home base near the Gulf Coast.');
    expect(home).toContain('1144 7th Street NW — Largo, FL');
    expect(home).toContain('Spacious shared housing adjacent to the primary Largo property with access to the same supportive and all-inclusive amenities.');
  });

  it('includes shared living expectations beneath the listings', () => {
    expect(home).toContain('Shared Living Expectations');
    expect(home).toContain('Maintain cleanliness in shared spaces');
    expect(home).toContain('Respect quiet hours');
    expect(home).toContain('Treat others with dignity and consideration');
    expect(home).toContain('Follow property guidelines and safety expectations');
  });
});
