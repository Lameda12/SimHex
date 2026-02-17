import * as THREE from 'three';

// UI / background
export const BG_DARK = 0x0a0a0f;

// Hex grid
export const GRID_LINE = 0x00e5ff;
export const GRID_LINE_OPACITY = 0.4;
export const FLOOR_BASE = 0x111118;

// Accents
export const ACCENT_TEAL = 0x00e5ff;
export const ACCENT_AMBER = 0xffab00;
export const ACCENT_PINK = 0xff0066;

// Room tints - more visible differences
export const ROOM_COLORS = {
  kitchen: 0x1a2e1a,
  bedroom: 0x1a1a30,
  livingRoom: 0x201a22,
  bathroom: 0x0e1e2e,
  garden: 0x122e10,
  hallway: 0x18181c,
};

// Wall
export const WALL_COLOR = 0x2a2a44;
export const WALL_OPACITY = 0.25;

// Sky
export const NIGHT_SKY = new THREE.Color(0x050510);
export const DAY_SKY = new THREE.Color(0x1a2a3a);
export const DAWN_SKY = new THREE.Color(0x2a1a0a);
