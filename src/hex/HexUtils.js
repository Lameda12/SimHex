import { HEX_SIZE } from '../constants.js';

const SQRT3 = Math.sqrt(3);

// Flat-top hex: axial (q, r) to world (x, z)
export function axialToWorld(q, r) {
  const x = HEX_SIZE * (3 / 2) * q;
  const z = HEX_SIZE * (SQRT3 / 2 * q + SQRT3 * r);
  return { x, z };
}

// World (x, z) to nearest axial (q, r)
export function worldToAxial(x, z) {
  const q = (2 / 3) * x / HEX_SIZE;
  const r = (-1 / 3 * x + SQRT3 / 3 * z) / HEX_SIZE;
  return axialRound(q, r);
}

// Round fractional axial to nearest integer hex
export function axialRound(qf, rf) {
  const sf = -qf - rf;
  let q = Math.round(qf);
  let r = Math.round(rf);
  let s = Math.round(sf);
  const dq = Math.abs(q - qf);
  const dr = Math.abs(r - rf);
  const ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) {
    q = -r - s;
  } else if (dr > ds) {
    r = -q - s;
  }
  return { q, r };
}

export function axialToCube(q, r) {
  return { q, r, s: -q - r };
}

export function hexDistance(a, b) {
  const ac = axialToCube(a.q, a.r);
  const bc = axialToCube(b.q, b.r);
  return Math.max(
    Math.abs(ac.q - bc.q),
    Math.abs(ac.r - bc.r),
    Math.abs(ac.s - bc.s)
  );
}

// 6 neighbor directions for flat-top hexes
const DIRECTIONS = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function hexNeighbors(q, r) {
  return DIRECTIONS.map(d => ({ q: q + d.q, r: r + d.r }));
}

// 6 corner positions of a flat-top hex at (cx, cz)
export function hexCorners(cx, cz, size = HEX_SIZE) {
  const corners = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    corners.push({
      x: cx + size * Math.cos(angle),
      z: cz + size * Math.sin(angle),
    });
  }
  return corners;
}

export function tileKey(q, r) {
  return `${q},${r}`;
}
