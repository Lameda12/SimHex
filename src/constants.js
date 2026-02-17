// Solar System
export const PLANETS = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: 0xb0a090,
    radius: 0.3,
    orbitRadius: 8,
    orbitSpeed: 4.15,
    rotationSpeed: 0.02,
    description: 'Scorched world closest to the Sun',
  },
  {
    id: 'venus',
    name: 'Venus',
    color: 0xe8c06a,
    radius: 0.5,
    orbitRadius: 12,
    orbitSpeed: 1.62,
    rotationSpeed: 0.01,
    atmosphere: 0xe8c06a,
    description: 'Shrouded in toxic clouds',
  },
  {
    id: 'earth',
    name: 'Earth',
    color: 0x4488cc,
    radius: 0.55,
    orbitRadius: 16,
    orbitSpeed: 1.0,
    rotationSpeed: 0.05,
    atmosphere: 0x88ccff,
    moons: [
      {
        id: 'moon',
        name: 'Moon',
        color: 0xcccccc,
        radius: 0.15,
        orbitRadius: 1.5,
        orbitSpeed: 13.0,
      },
    ],
    description: "Humanity's homeworld",
  },
  {
    id: 'mars',
    name: 'Mars',
    color: 0xcc4422,
    radius: 0.4,
    orbitRadius: 21,
    orbitSpeed: 0.53,
    rotationSpeed: 0.048,
    description: 'The Red Planet, prime colonization target',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: 0xcc9966,
    radius: 1.8,
    orbitRadius: 32,
    orbitSpeed: 0.084,
    rotationSpeed: 0.12,
    description: 'Gas giant, king of planets',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: 0xe8d088,
    radius: 1.5,
    orbitRadius: 44,
    orbitSpeed: 0.034,
    rotationSpeed: 0.11,
    hasRings: true,
    ringsInnerRadius: 2.0,
    ringsOuterRadius: 3.2,
    ringsColor: 0xc8b878,
    description: 'Ringed wonder of the solar system',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: 0x66bbcc,
    radius: 1.0,
    orbitRadius: 56,
    orbitSpeed: 0.012,
    rotationSpeed: 0.07,
    description: 'Ice giant tilted on its side',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: 0x3366cc,
    radius: 0.95,
    orbitRadius: 68,
    orbitSpeed: 0.006,
    rotationSpeed: 0.065,
    description: 'Distant ice giant with fierce winds',
  },
];

export const SUN = {
  color: 0xffcc33,
  emissive: 0xffaa00,
  radius: 3.0,
  lightIntensity: 2.5,
  lightColor: 0xffeedd,
};

// Simulation timing
export const SIM_DAYS_PER_REAL_SECOND = 0.5;

// Robot probes
export const ROBOT_COUNT = 5;
export const ROBOT_FLIGHT_SPEED = 8; // scene units per second at 1x
export const ROBOT_NAMES = ['PROBE-01', 'PROBE-02', 'PROBE-03', 'PROBE-04', 'PROBE-05'];
export const ROBOT_COLORS = [0x00e5ff, 0xff0066, 0x76ff03, 0xffab00, 0xd500f9];
