import { GameState } from './state';
import { Vector } from './vector';
import { ON_BOARD_VIEW_CONFIG } from './view-constants';

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
  return (180 * angleRad) / Math.PI;
}

export function calculateProjectionForPoint(
  pointToRender: Vector,
  gameState: GameState,
  canvas: ProjectionCanvas,
) {
  const { cameraAngularFieldOfViewHorizontal, cameraTiltDownAngle } = ON_BOARD_VIEW_CONFIG;
  const { cameraVector, carPosition } = gameState;
  const cameraToPointVector = carPosition.deltaTo(pointToRender);

  const fovHalf = deg2Rad(cameraAngularFieldOfViewHorizontal / 2);
  const theta_h = cameraVector.horizontalAngleTo(cameraToPointVector);

  if (Math.abs(theta_h) > deg2Rad(90)) {
    return;
  }

  const theta_v = cameraToPointVector.verticalAngle - deg2Rad(cameraTiltDownAngle);

  if (Math.abs(theta_v) > deg2Rad(90)) {
    return;
  }

  const f = 1 / Math.tan(fovHalf);
  const d_h = carPosition.horizontalDistanceTo(pointToRender);
  const d_v = carPosition.verticalDistanceTo(pointToRender);
  const a_h = d_h * Math.sin(theta_h);
  const a_v = d_v * Math.sin(theta_v);
  const b_h = Math.sqrt(Math.pow(d_h, 2) - Math.pow(a_h, 2));
  const b_v = Math.sqrt(Math.pow(d_v, 2) - Math.pow(a_v, 2));
  const p_h = (f * a_h) / b_h;
  const p_v = (f * a_v) / b_v;
  const halfCanvasWidth = canvas.width / 2;
  const halfCanvasHeight = canvas.height / 2;
  const projectionX = halfCanvasWidth * (1 + p_h);
  const projectionY = halfCanvasHeight + p_v * halfCanvasWidth;

  return {
    x: projectionX,
    y: projectionY,
  } as ProjectionPoint;
}

export function getHorizonHeight(canvas: ProjectionCanvas) {
  const baseHorizon = canvas.height / 2;
  const { cameraTiltDownAngle, cameraAngularFieldOfViewHorizontal } = ON_BOARD_VIEW_CONFIG;

  return (
    baseHorizon *
    (1 +
      Math.sin(deg2Rad(-cameraTiltDownAngle)) /
        Math.sin(deg2Rad(cameraAngularFieldOfViewHorizontal / 2)))
  );
}

