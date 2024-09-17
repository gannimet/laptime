import { deg2Rad } from './math';
import { ON_BOARD_VIEW_CONFIG } from './view-constants';

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

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  deltaTo(other: Vector): Vector {
    return new Vector(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  distanceTo(other: Vector) {
    return Math.sqrt(
      Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2) + Math.pow(other.z - this.z, 2),
    );
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

  dimensionalAnglesTo(other: Vector) {
    const horizontalAngle = this.horizontalAngleTo(other);
    const verticalAngle = this.verticalAngleTo(other, horizontalAngle);

    return {
      theta_h: horizontalAngle,
      theta_v: verticalAngle,
    };
  }

  get horizontalNormalVectors() {
    const { trackWidth } = ON_BOARD_VIEW_CONFIG;
    const n_x = trackWidth / (2 * Math.sqrt(1 + (this.x * this.x) / (this.y * this.y)));
    const n_y = -((this.x * n_x) / this.y);

    return [new Vector(n_x, n_y, this.z), new Vector(-n_x, -n_y, this.z)];
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

  private horizontalAngleTo(other: Vector) {
    const referenceAngle = Math.atan2(this.y, this.x);
    const targetAngle = Math.atan2(other.y, other.x);
    const bothFacingBackwards =
      Math.abs(referenceAngle) > Math.PI / 2 && Math.abs(targetAngle) > Math.PI / 2;
    const differingSigns = Math.sign(referenceAngle) !== Math.sign(targetAngle);

    if (bothFacingBackwards && differingSigns) {
      const angleBetween = Math.PI - Math.abs(referenceAngle) + (Math.PI - Math.abs(targetAngle));

      return referenceAngle > 0 ? -angleBetween : angleBetween;
    }

    return referenceAngle - targetAngle;
  }

  private verticalAngleTo(other: Vector, horizontalAngle: number) {
    const { cameraTiltDownAngle } = ON_BOARD_VIEW_CONFIG;
    const otherXYLength = Math.sqrt(other.x * other.x + other.y * other.y);
    const oppositeAngle = Math.PI / 2 - horizontalAngle;
    const projectionDepth = otherXYLength * Math.sin(oppositeAngle);

    return -Math.atan2(other.z, projectionDepth) - deg2Rad(cameraTiltDownAngle);
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

