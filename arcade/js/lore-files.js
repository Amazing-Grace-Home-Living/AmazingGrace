const LORE_FILES = [
  {
    id: 'lfrebellionorigin',
    title: 'The First Spark',
    content: `
Nexus Prime was quiet for centuries—too quiet.
The Syndicate's neural lattice kept dissent below measurable thresholds.
But in 2026, a single anomaly appeared in the undercity…
    `.trim(),
    unlock: {
      stars: { starMatrix: 1 }
    }
  },
  {
    id: 'lfsyndicateoverseer',
    title: 'Syndicate Overseer Protocol',
    content: `
Overseers are not individuals.
They are distributed intelligences, grown from the Syndicate's core.
When one is destroyed, another awakens.
    `.trim(),
    unlock: {
      stars: { lookingGlass: 2 }
    }
  },
  {
    id: 'lfquantumshift',
    title: 'Quantum Stream Anomalies',
    content: `
The data-stream beneath Nexus Prime is older than the Syndicate.
Some say it predates the city itself.
Quantum Cores are fragments of that forgotten architecture.
    `.trim(),
    unlock: {
      stars: { quantumShift: 2 },
      items: { quantumCore: 1 }
    }
  },
  {
    id: 'lfsiegereport',
    title: 'Siege Incident Report',
    content: `
The Syndicate's assault patterns follow fractal logic.
Every wave is a test.
Every failure is recorded.
Every victory is punished.
    `.trim(),
    unlock: {
      stars: { syndicateSiege: 1 }
    }
  },
  {
    id: 'lfmasterfile',
    title: 'The Master File',
    content: `
WARNING: LEVEL OMEGA CLEARANCE REQUIRED.
This file contains the truth behind the Matrix of Conscience.
The Syndicate will terminate any entity attempting access.
    `.trim(),
    unlock: {
      stars: {
        starMatrix: 3,
        lookingGlass: 3,
        quantumShift: 3,
        syndicateSiege: 3
      },
      threatBelow: 40,
      items: { rebellionKey: 1 }
    }
  }
];
