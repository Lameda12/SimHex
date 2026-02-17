export class Room {
  constructor(id, tiles) {
    this.id = id;
    this.tiles = tiles;        // array of {q, r}
    this.furniture = [];       // placed furniture references
    this.robotsInside = new Set();
  }

  containsTile(q, r) {
    return this.tiles.some(t => t.q === q && t.r === r);
  }
}
