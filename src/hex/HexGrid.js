import * as THREE from 'three';
import { HexTile } from './HexTile.js';
import { axialToWorld, tileKey, hexNeighbors } from './HexUtils.js';
import { createFloorTile, createWallTile } from './HexMeshFactory.js';
import { ROOM_COLORS } from '../utils/ColorPalette.js';

export class HexGrid {
  constructor() {
    this.tiles = new Map();    // key: "q,r" -> HexTile
    this.group = new THREE.Group();
    this.group.name = 'hex-grid';
  }

  addTile(q, r, type = 'floor', roomId = null) {
    const key = tileKey(q, r);
    if (this.tiles.has(key)) return this.tiles.get(key);
    const tile = new HexTile(q, r, type, roomId);
    this.tiles.set(key, tile);
    return tile;
  }

  getTile(q, r) {
    return this.tiles.get(tileKey(q, r)) || null;
  }

  isWalkable(q, r) {
    const tile = this.getTile(q, r);
    return tile && tile.walkable && !tile.occupied;
  }

  getWalkableNeighbors(q, r) {
    return hexNeighbors(q, r).filter(n => this.isWalkable(n.q, n.r));
  }

  getTilesInRoom(roomId) {
    const result = [];
    for (const tile of this.tiles.values()) {
      if (tile.roomId === roomId) result.push(tile);
    }
    return result;
  }

  getWalkableTilesInRoom(roomId) {
    return this.getTilesInRoom(roomId).filter(t => t.walkable && !t.occupied);
  }

  getAllWalkableTiles() {
    const result = [];
    for (const tile of this.tiles.values()) {
      if (tile.walkable && !tile.occupied) result.push(tile);
    }
    return result;
  }

  // Build 3D meshes for all tiles
  buildMeshes() {
    // Clear existing
    while (this.group.children.length) {
      this.group.remove(this.group.children[0]);
    }

    for (const tile of this.tiles.values()) {
      const { x, z } = axialToWorld(tile.q, tile.r);

      if (tile.type === 'wall') {
        const mesh = createWallTile();
        mesh.position.set(x, 0, z);
        mesh.userData = { q: tile.q, r: tile.r, type: 'wall' };
        this.group.add(mesh);
      } else {
        const tintColor = tile.roomId ? ROOM_COLORS[tile.roomId] || null : null;
        const mesh = createFloorTile(tintColor);
        mesh.position.set(x, 0, z);
        mesh.userData = { q: tile.q, r: tile.r, type: tile.type, roomId: tile.roomId };
        this.group.add(mesh);
      }
    }
  }
}
