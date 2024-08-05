import { GameState } from "./state";
import { Vector } from "./vector";
import { ON_BOARD_VIEW_CONFIG } from "./view-constants";

export type ProjectionCanvas = {
  width: number;
  height: number;
};

export type ProjectionPoint = {
  x: number;
  y: number;
};

export function deg2Rad(angleDeg: number) {
  return (angleDeg * Math.PI) / 180;
}

export function rad2Deg(angleRad: number) {
  return (360 * angleRad) / (2 * Math.PI);
}

export function calculateProjectionForPoint(
  pointToRender: Vector,
  gameState: GameState,
  canvas: ProjectionCanvas,
) {
  const { cameraAngularFieldOfViewHorizontal } = ON_BOARD_VIEW_CONFIG;
  const { cameraVector, carPosition } = gameState;
  const cameraToPointVector = carPosition.deltaTo(pointToRender);

  const rhoH = cameraVector.horizontalAngleTo(cameraToPointVector);
  const rhoV = cameraVector.verticalAngleTo(cameraToPointVector);

  const fowHalf = deg2Rad(cameraAngularFieldOfViewHorizontal >> 1);

  const ratioH = Math.tan(rhoH / fowHalf);
  const ratioV = Math.tan(rhoV / fowHalf);
  const halfCanvasWidth = canvas.width >> 1;
  const halfCanvasHeight = canvas.height >> 1;
  const projectionX = halfCanvasWidth + ratioH * halfCanvasWidth;
  const projectionY = halfCanvasHeight + ratioV * halfCanvasWidth;

  return {
    x: projectionX,
    y: projectionY,
  } as ProjectionPoint;
}
