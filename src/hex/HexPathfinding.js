import { hexDistance, hexNeighbors, tileKey } from './HexUtils.js';

// A* pathfinding on hex grid
export function findPath(grid, startQ, startR, goalQ, goalR) {
  const startKey = tileKey(startQ, startR);
  const goalKey = tileKey(goalQ, goalR);

  if (startKey === goalKey) return [];
  if (!grid.isWalkable(goalQ, goalR)) return null;

  const openSet = new Map(); // key -> { q, r, f, g }
  const cameFrom = new Map();
  const gScore = new Map();

  const start = { q: startQ, r: startR };
  const goal = { q: goalQ, r: goalR };

  gScore.set(startKey, 0);
  const h = hexDistance(start, goal);
  openSet.set(startKey, { q: startQ, r: startR, f: h, g: 0 });

  const closedSet = new Set();

  while (openSet.size > 0) {
    // Find node with lowest f
    let currentKey = null;
    let currentNode = null;
    let lowestF = Infinity;
    for (const [key, node] of openSet) {
      if (node.f < lowestF) {
        lowestF = node.f;
        currentKey = key;
        currentNode = node;
      }
    }

    if (currentKey === goalKey) {
      // Reconstruct path
      const path = [];
      let key = goalKey;
      while (key && key !== startKey) {
        const [q, r] = key.split(',').map(Number);
        path.unshift({ q, r });
        key = cameFrom.get(key);
      }
      return path;
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    const neighbors = hexNeighbors(currentNode.q, currentNode.r);
    for (const n of neighbors) {
      const nKey = tileKey(n.q, n.r);
      if (closedSet.has(nKey)) continue;
      if (!grid.isWalkable(n.q, n.r)) continue;

      const tentativeG = gScore.get(currentKey) + 1;

      if (!gScore.has(nKey) || tentativeG < gScore.get(nKey)) {
        gScore.set(nKey, tentativeG);
        cameFrom.set(nKey, currentKey);
        const f = tentativeG + hexDistance(n, goal);
        openSet.set(nKey, { q: n.q, r: n.r, f, g: tentativeG });
      }
    }
  }

  return null; // no path found
}

// Find nearest walkable tile matching a predicate
export function findNearestTile(grid, startQ, startR, predicate) {
  const visited = new Set();
  const queue = [{ q: startQ, r: startR, dist: 0 }];
  visited.add(tileKey(startQ, startR));

  while (queue.length > 0) {
    const current = queue.shift();
    const tile = grid.getTile(current.q, current.r);
    if (tile && predicate(tile)) {
      return tile;
    }

    for (const n of hexNeighbors(current.q, current.r)) {
      const key = tileKey(n.q, n.r);
      if (visited.has(key)) continue;
      visited.add(key);
      const nTile = grid.getTile(n.q, n.r);
      if (nTile) {
        queue.push({ q: n.q, r: n.r, dist: current.dist + 1 });
      }
    }
  }
  return null;
}
