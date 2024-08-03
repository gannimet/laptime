import { deg2Rad } from "./math";
import { currentState } from "./state";
import { Vector } from "./vector";
import { ON_BOARD_VIEW_CONFIG } from "./view-constants";

export class Graphics {
  constructor(
    readonly ctx: CanvasRenderingContext2D
  ) {}

  renderLine() {}

  renderPoint(pointToRender: Vector, color: string) {
    const { cameraAngularFieldOfViewHorizontal } = ON_BOARD_VIEW_CONFIG;
    const { cameraVector, carPosition } = currentState;
    const cameraToPointVector = carPosition.deltaTo(pointToRender);
  
    const rhoH = cameraVector.horizontalAngleTo(cameraToPointVector);
    const rhoV = cameraVector.verticalAngleTo(cameraToPointVector);
  
    const fowHalf = deg2Rad(cameraAngularFieldOfViewHorizontal >> 1);
  
    if (Math.abs(rhoH) > fowHalf || Math.abs(rhoV) > fowHalf) {
      return;
    }
  
    const ratioH = rhoH / fowHalf;
    const ratioV = rhoV / fowHalf;
    const halfCanvasWidth = this.ctx.canvas.width >> 1;
    const halfCanvasHeight = this.ctx.canvas.height >> 1;
    const projectionX = halfCanvasWidth + ratioH * halfCanvasWidth;
    const projectionY = halfCanvasHeight + ratioV * halfCanvasWidth;
  
    this.ctx.fillStyle = color;
    this.ctx.fillRect(projectionX - 4, projectionY - 4, 8, 8);
  }
}