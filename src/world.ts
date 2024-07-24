export class WorldPoint {
  constructor(readonly x: number, readonly y: number, readonly z: number = 0) {}

  deltaTo(other: WorldPoint): WorldPoint {
    return new WorldPoint(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  distanceTo(other: WorldPoint) {
    // TODO replace with fast inverse square root
    return Math.sqrt(
      (other.y - this.y) + (other.x - this.x) + (other.z - this.z)
    )
  }
};

export class Polygon {
  constructor(readonly corners: WorldPoint[]) {}
}