import { calculateProjectionForPoint, getHorizonHeight } from './math';
import { currentState } from './state';
import { Vector } from './vector';
import { ON_BOARD_VIEW_CONFIG } from './view-constants';

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

  renderPoint(pointToRender: Vector, color: string, withVLine = false) {
    const projectionPoint = calculateProjectionForPoint(pointToRender, currentState, this.canvas);

    if (!projectionPoint) {
      return;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(projectionPoint.x - 4, projectionPoint.y - 4, 8, 8);

    if (withVLine) {
      this.renderLine(
        pointToRender,
        new Vector(-pointToRender.x, pointToRender.y, pointToRender.z),
        color,
      );
    }
  }

  renderCurrentTrackView() {
    const { track } = currentState;

    if (!track) {
      return;
    }

    let normalPointsFromBefore: Vector[];

    track.path.forEach((point, index) => {
      const pointBefore = index > 0 ? track.path[index - 1] : track.path[track.path.length - 1];
      const dirVector = pointBefore.deltaTo(point);
      const normalVectors = dirVector.horizontalNormalVectors;
      const normalPoints = normalVectors.map((vector) => point.add(vector));

      if (normalPointsFromBefore) {
        const p1 = calculateProjectionForPoint(
          normalPointsFromBefore[0],
          currentState,
          this.canvas,
        );
        const p2 = calculateProjectionForPoint(
          normalPointsFromBefore[1],
          currentState,
          this.canvas,
        );
        const p3 = calculateProjectionForPoint(normalPoints[1], currentState, this.canvas);
        const p4 = calculateProjectionForPoint(normalPoints[0], currentState, this.canvas);

        if (p1 && p2 && p3 && p4) {
          this.ctx.fillStyle = '#999';
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.lineTo(p3.x, p3.y);
          this.ctx.lineTo(p4.x, p4.y);
          this.ctx.fill();
        }
      }

      normalPointsFromBefore = normalPoints;
    });
  }

  renderHorizon() {
    const horizonHeight = getHorizonHeight(this.canvas);
    const { skyColor, floorColor } = ON_BOARD_VIEW_CONFIG;

    this.ctx.beginPath();
    this.ctx.fillStyle = skyColor;
    this.ctx.rect(0, 0, this.canvas.width, horizonHeight);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = floorColor;
    this.ctx.rect(0, horizonHeight, this.canvas.width, this.canvas.height - horizonHeight);
    this.ctx.fill();
  }
}

