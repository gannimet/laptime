import { calculateProjectionForPoint } from "./math";
import { currentState } from "./state";
import { Vector } from "./vector";

export class Graphics {
  constructor(readonly ctx: CanvasRenderingContext2D) {}

  get canvas() {
    return this.ctx.canvas;
  }

  renderLine(fromPoint: Vector, toPoint: Vector, color: string) {
    const projectionFromPoint = calculateProjectionForPoint(
      fromPoint,
      currentState,
      this.canvas,
    );
    const projectionToPoint = calculateProjectionForPoint(
      toPoint,
      currentState,
      this.canvas,
    );

    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(projectionFromPoint.x, projectionFromPoint.y);
    this.ctx.lineTo(projectionToPoint.x, projectionToPoint.y);
    this.ctx.stroke();
  }

  renderPoint(pointToRender: Vector, color: string) {
    const projectionPoint = calculateProjectionForPoint(
      pointToRender,
      currentState,
      this.canvas,
    );

    this.ctx.fillStyle = color;
    this.ctx.fillRect(projectionPoint.x - 4, projectionPoint.y - 4, 8, 8);
  }
}
