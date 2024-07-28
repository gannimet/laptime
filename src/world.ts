export type Axis = 'x' | 'y' | 'z';

export class Vector {
  constructor(readonly x: number, readonly y: number, readonly z: number = 0) {}

  deltaTo(other: Vector): Vector {
    return new Vector(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  distanceTo(other: Vector, includeAxes: Axis[] = ['x', 'y', 'z']) {
    let sum = 0;

    sum += includeAxes.includes('x') ? Math.pow((other.x - this.x), 2) : 0;
    sum += includeAxes.includes('y') ? Math.pow((other.y - this.y), 2) : 0;
    sum += includeAxes.includes('z') ? Math.pow((other.z - this.z), 2) : 0;

    return Math.sqrt(sum)
  }

  crossProduct(other: Vector) {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  horizontalAngleTo(other: Vector) {
    // For horizontal angle we set the z component of both vectors to 0
    const referenceVector = new Vector(this.x, this.y, 0);
    const targetVector = new Vector(other.x, other.y, 0);
    const crossProduct = referenceVector.crossProduct(targetVector);
    const angleDirection = -Math.sign(crossProduct.z);
    const angle = Math.asin(
      crossProduct.length / (referenceVector.length * targetVector.length)
    );

    return angleDirection * angle;
  }

  verticalAngleTo(other: Vector) {
    // For vertical angle we set the x component of both vectors to 0
    const referenceVector = new Vector(0, this.y, this.z);
    const targetVector = new Vector(0, other.y, other.z);
    const crossProduct = referenceVector.crossProduct(targetVector);
    const angleDirection = -Math.sign(crossProduct.x);
    const angle = Math.asin(
      crossProduct.length / (referenceVector.length * targetVector.length)
    );

    return angleDirection * angle;
  }
};