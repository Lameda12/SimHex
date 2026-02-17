export const CIVILIZATION_STAGES = [
  {
    id: 1,
    name: 'First Space Flight',
    description: 'Launch first robot probe',
    requirement: { type: 'missions_completed', count: 1 },
    unlocksTargets: ['moon'],
  },
  {
    id: 2,
    name: 'Lunar Colony',
    description: 'Establish a base on the Moon',
    requirement: { type: 'base_built', target: 'moon' },
    unlocksTargets: ['mars', 'venus', 'mercury'],
  },
  {
    id: 3,
    name: 'Mars Colonization',
    description: 'Build a colony on Mars',
    requirement: { type: 'base_built', target: 'mars' },
    unlocksTargets: ['jupiter', 'saturn'],
  },
  {
    id: 4,
    name: 'Inner Solar System',
    description: 'Bases on 3+ planets',
    requirement: { type: 'bases_count', count: 3 },
    unlocksTargets: ['uranus', 'neptune'],
  },
  {
    id: 5,
    name: 'Outer Solar System',
    description: 'Visit all planets',
    requirement: { type: 'planets_visited', count: 8 },
    unlocksTargets: [],
  },
  {
    id: 6,
    name: 'Multi-Planetary Civilization',
    description: 'Colonies on 5+ worlds',
    requirement: { type: 'colonies_count', count: 5 },
    unlocksTargets: [],
  },
];
