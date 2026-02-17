export class HexTile {
  constructor(q, r, type = 'floor', roomId = null) {
    this.q = q;
    this.r = r;
    this.type = type;       // 'floor' | 'wall' | 'door' | 'garden'
    this.roomId = roomId;
    this.walkable = type !== 'wall';
    this.occupied = false;  // true if furniture is on this tile
    this.furniture = null;  // reference to furniture object
    this.interactionPoint = false; // robot stands here to use adjacent furniture
  }
}
