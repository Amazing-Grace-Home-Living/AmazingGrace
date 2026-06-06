import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Tower Defense instructions', () => {
  it('includes Emergent Word guidance in the menu', () => {
    const html = fs.readFileSync('arcade/tower-defense/index.html', 'utf8');

    expect(html).toContain('EMERGENT WORD // TOWER DEFENSE INSTRUCTIONS');
    expect(html).toContain('Select your faction, then initialize combat to deploy into the grid.');
    expect(html).toContain('Choose a tower chassis and place it off-path to defend the core route.');
    expect(html).toContain('Start each wave, earn cores from kills, and upgrade installed towers.');
    expect(html).toContain('Keep integrity above zero through escalating waves to secure your rank.');
  });
});
