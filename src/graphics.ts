import { calculateProjectionForPoint } from './math';
import { currentState } from './state';
import { Vector } from './vector';

export class Graphics {
  constructor(readonly ctx: CanvasRenderingContext2D) {}

  get canvas() {
    return this.ctx.canvas;
  }

  renderLine(fromPoint: Vector, toPoint: Vector, color: string) {
    const projectionFromPoint = calculateProjectionForPoint(fromPoint, currentState, this.canvas);
    const projectionToPoint = calculateProjectionForPoint(toPoint, currentState, this.canvas);

    if (projectionFromPoint && projectionToPoint) {
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(projectionFromPoint.x, projectionFromPoint.y);
      this.ctx.lineTo(projectionToPoint.x, projectionToPoint.y);
      this.ctx.stroke();
    }
  }

  renderPoint(pointToRender: Vector, color: string) {
    const projectionPoint = calculateProjectionForPoint(pointToRender, currentState, this.canvas);

    if (!projectionPoint) {
      return;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(projectionPoint.x - 4, projectionPoint.y - 4, 8, 8);
  }

  renderCurrentTrackView() {
    const { track } = currentState;

    if (!track) {
      return;
    }

    track.path.forEach((point, index) => {
      this.renderPoint(point, 'green');

      const pointBefore = index > 0 ? track.path[index - 1] : track.path[track.path.length - 1];
      const dirVector = pointBefore.deltaTo(point);
      const normalVectors = dirVector.horizontalNormalVectors;
      const normalPoints = normalVectors.map((vector) => point.add(vector));

      normalPoints.forEach((normalPoint) => {
        this.renderPoint(normalPoint, 'orange');
        this.renderLine(point, normalPoint, 'orange');
      });
    });
  }
}

