// House floor plan using axial coordinates (q, r)
// Flat-top hexes. The house is roughly centered at origin.

function hexRange(qMin, qMax, rMin, rMax) {
  const tiles = [];
  for (let q = qMin; q <= qMax; q++) {
    for (let r = rMin; r <= rMax; r++) {
      tiles.push({ q, r });
    }
  }
  return tiles;
}

export const ROOMS = {
  kitchen: {
    tiles: hexRange(-6, -3, -4, -1),
    furniture: [
      { type: 'stove', q: -5, r: -4 },
      { type: 'table', q: -4, r: -2 },
      { type: 'sink', q: -6, r: -3 },
    ],
  },
  livingRoom: {
    tiles: hexRange(-2, 2, -4, -1),
    furniture: [
      { type: 'couch', q: 0, r: -3 },
      { type: 'shelf', q: 2, r: -4 },
      { type: 'desk', q: -1, r: -4 },
    ],
  },
  hallway: {
    tiles: [
      ...hexRange(-3, 2, 0, 1),
    ],
  },
  bathroom: {
    tiles: hexRange(-6, -4, 0, 2),
    furniture: [
      { type: 'toilet', q: -5, r: 2 },
      { type: 'bathroomSink', q: -6, r: 1 },
    ],
  },
  bedroom: {
    tiles: hexRange(-1, 3, 2, 5),
    furniture: [
      { type: 'bed', q: 1, r: 3 },
      { type: 'bed', q: 3, r: 4 },
      { type: 'nightstand', q: 0, r: 4 },
    ],
  },
  garden: {
    tiles: hexRange(-6, -2, -7, -5),
    furniture: [
      { type: 'plant', q: -5, r: -6 },
      { type: 'plant', q: -3, r: -5 },
      { type: 'plant', q: -4, r: -7 },
    ],
  },
};

// Wall tiles - placed along room boundaries
// We compute these dynamically from room edges
export function computeWalls(rooms) {
  const floorSet = new Set();
  for (const room of Object.values(rooms)) {
    for (const t of room.tiles) {
      floorSet.add(`${t.q},${t.r}`);
    }
  }
  return floorSet;
}

// Door positions connecting rooms
export const DOORS = [
  { q: -3, r: -1, connects: ['kitchen', 'hallway'] },
  { q: -2, r: 0, connects: ['livingRoom', 'hallway'] },
  { q: -4, r: 0, connects: ['bathroom', 'hallway'] },
  { q: -1, r: 1, connects: ['hallway', 'bedroom'] },
  { q: -3, r: -4, connects: ['kitchen', 'garden'] },
];
