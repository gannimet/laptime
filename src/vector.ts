import { deg2Rad } from './math';

export type Axis = 'x' | 'y' | 'z';

export class Vector {
  constructor(
    public x: number,
    public y: number,
    public z: number = 0,
  ) {}

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  deltaTo(other: Vector): Vector {
    return new Vector(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  horizontalDistanceTo(other: Vector) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  }

  verticalDistanceTo(other: Vector) {
    return Math.sqrt(Math.pow(other.z - this.z, 2) + Math.pow(other.y - this.y, 2));
  }

  crossProduct(other: Vector) {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }

  dotProduct(other: Vector) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  get verticalAngle() {
    // Normal vector of xy plane
    const normalVector = new Vector(0, 0, -1);
    // Set x to zero to "unskew" and make points with same x appear parallel
    const verticallyReducedVector = new Vector(0, this.y, this.z);
    const dotProduct = verticallyReducedVector.dotProduct(normalVector);

    return Math.asin(dotProduct / verticallyReducedVector.length);
  }

  horizontalAngleTo(other: Vector) {
    // For horizontal angle we set the z component of both vectors to 0
    const referenceVector = new Vector(this.x, this.y, 0);
    const targetVector = new Vector(other.x, other.y, 0);
    const dotProduct = referenceVector.dotProduct(targetVector);
    const determinant = targetVector.x * referenceVector.y - targetVector.y * referenceVector.x;

    return Math.atan2(determinant, dotProduct);
  }

  /**
   * @deprecated
   */
  verticalAngleTo(other: Vector) {
    // For vertical angle we set the x component of both vectors to 0
    const referenceVector = new Vector(0, this.y, this.z);
    const targetVector = new Vector(0, other.y, other.z);
    const dotProduct = referenceVector.dotProduct(targetVector);
    const determinant = targetVector.y * referenceVector.z - targetVector.z * referenceVector.y;

    return Math.atan2(determinant, dotProduct);
  }

  forward(direction: Vector) {
    this.move(direction, 0.1);
  }

  backward(direction: Vector) {
    this.move(direction, -0.1);
  }

  left() {
    this.rotate(2);
  }

  right() {
    this.rotate(-2);
  }

  private move(direction: Vector, length: number) {
    const xyLength = Math.sqrt(direction.x * direction.x + direction.y * direction.y);

    this.x += (direction.x / xyLength) * length;
    this.y += (direction.y / xyLength) * length;
  }

  private rotate(angleDeg: number) {
    const rotationAngleRad = deg2Rad(angleDeg);

    this.x = this.x * Math.cos(rotationAngleRad) - this.y * Math.sin(rotationAngleRad);
    this.y = this.x * Math.sin(rotationAngleRad) + this.y * Math.cos(rotationAngleRad);
  }
}

