export type Axis = 'x' | 'y' | 'z';

export class Vector {
  constructor(readonly x: number, readonly y: number, readonly z: number = 0) {}

  deltaTo(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  distanceTo(other: Vector, includeAxes: Axis[] = ['x', 'y', 'z']) {
    let sum = 0;

    sum += includeAxes.includes('x') ? Math.pow((other.x - this.x), 2) : 0;
    sum += includeAxes.includes('y') ? Math.pow((other.y - this.y), 2) : 0;
    sum += includeAxes.includes('z') ? Math.pow((other.z - this.z), 2) : 0;

    return Math.sqrt(sum)
  }

  horizontalAngleTo(other: Vector) {
    return Math.atan(this.x / this.y) - Math.atan(other.x - other.y);
  }

  verticalAngleTo(other: Vector) {
    return Math.atan(this.z / this.y) - Math.atan(other.z - other.y);
  }
};

export class Polygon {
  constructor(readonly corners: Vector[]) {}
}