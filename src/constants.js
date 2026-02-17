// Hex grid
export const HEX_SIZE = 0.5;
export const HEX_HEIGHT = 0.08;
export const WALL_HEIGHT = 2.0;
export const HEX_GAP = 0.03;

// Simulation timing
export const SIM_MINUTES_PER_REAL_SECOND = 2; // full day in ~12 min
export const DAY_PHASES = {
  NIGHT: 'night',
  DAWN: 'dawn',
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  DUSK: 'dusk',
};

// Robot
export const ROBOT_COUNT = 5;
export const ROBOT_SPEED = 2.5; // tiles per second
export const ROBOT_NAMES = ['HEX-01', 'HEX-02', 'HEX-03', 'HEX-04', 'HEX-05'];
export const ROBOT_COLORS = [0x00e5ff, 0xff0066, 0x76ff03, 0xffab00, 0xd500f9];

// Needs decay per in-game hour
export const NEEDS_DECAY = {
  energy: 4,
  hunger: 5,
  social: 3,
  hygiene: 2,
};
export const WORKING_ENERGY_DECAY = 8;

// Thresholds for seeking fulfillment
export const NEEDS_THRESHOLDS = {
  energy: 20,
  hunger: 30,
  social: 25,
  hygiene: 20,
};
