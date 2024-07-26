import { deg2Rad } from './math';
import './style.css'
import { demoTrack } from './track';
import { ON_BOARD_VIEW_CONFIG } from './view-constants';
import { Vector } from './world';

const canvas = document.querySelector<HTMLCanvasElement>('#laptimeCanvas');
const ctx = canvas?.getContext("2d");
const onboardCarImage = new Image();

const { cameraElevation, cameraTiltDownAngle, cameraAngularFieldOfViewHorizontal } = ON_BOARD_VIEW_CONFIG;
const cameraPosition = new Vector(0, 0, cameraElevation);
const cameraTiltDownAngleRad = -deg2Rad(cameraTiltDownAngle);
const cameraVector = new Vector(0, Math.cos(cameraTiltDownAngleRad), Math.sin(cameraTiltDownAngleRad));

function renderPoint(ctx: CanvasRenderingContext2D, pointToRender: Vector, color: string) {
  const cameraToPointVector = pointToRender.deltaTo(cameraPosition);

  const rhoH = Math.acos(
    (cameraVector.x * cameraToPointVector.x + cameraVector.y * cameraToPointVector.y) /
    (Math.sqrt(cameraVector.x * cameraVector.x + cameraVector.y * cameraVector.y) * Math.sqrt(cameraToPointVector.x * cameraToPointVector.x + cameraToPointVector.y * cameraToPointVector.y))
  );

  const rhoV = Math.acos(
    (cameraVector.y * cameraToPointVector.y + cameraVector.z * cameraToPointVector.z) /
    (Math.sqrt(cameraVector.y * cameraVector.y + cameraVector.z * cameraVector.z) * Math.sqrt(cameraToPointVector.y * cameraToPointVector.y + cameraToPointVector.z * cameraToPointVector.z))
  );

  const fowHalf = deg2Rad(cameraAngularFieldOfViewHorizontal >> 1);
  const d_h = cameraPosition.distanceTo(pointToRender, ['x', 'y']);
  const d_v = cameraPosition.distanceTo(pointToRender, ['y', 'z']);
  const b_h = Math.cos(rhoH) * d_h;
  const b_v = Math.cos(rhoV) * d_v;

  const A_h_p = Math.sin(rhoH) * d_h;
  const A_v_p = Math.sin(rhoV) * d_v;
  const A_h_max = Math.tan(fowHalf) * b_h;
  const A_v_max = Math.tan(fowHalf) * b_v;
  const ratioH = A_h_p / A_h_max;
  const ratioV = A_v_p / A_v_max;

  const signH = Math.sign(A_h_p);
  const signV = Math.sign(A_v_p);
  const halfCanvasWidth = ctx.canvas.width >> 1;
  const halfCanvasHeight = ctx.canvas.height >> 1;
  const projectionX = halfCanvasWidth + signH * ratioH * halfCanvasWidth;
  const projectionY = halfCanvasHeight - signV * ratioV * halfCanvasWidth;

  ctx.fillStyle = color;
  ctx.fillRect(projectionX - 4, projectionY - 4, 8, 8);
}

function draw(time: number) {
  if (!ctx || !canvas) {
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Sky
  // ctx.fillStyle = '#aaddff'
  ctx.fillStyle = '#00f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Car
  const carX = (canvas.width - onboardCarImage.width) / 2;
  const carY = canvas.height - onboardCarImage.height;
  ctx.drawImage(onboardCarImage, carX, carY);

  // View on track
  renderPoint(ctx, new Vector(-10, 6), 'red');
  // renderPoint(ctx, new WorldPoint(0, 6), 'red');
  // renderPoint(ctx, new WorldPoint(10, 6), 'red');

  // renderPoint(ctx, new WorldPoint(-10, 10), 'lime');
  // renderPoint(ctx, new WorldPoint(0, 10), 'lime');
  // renderPoint(ctx, new WorldPoint(10, 10), 'lime');

  // renderPoint(ctx, new WorldPoint(-10, 15), 'yellow');
  // renderPoint(ctx, new WorldPoint(0, 15), 'yellow');
  // renderPoint(ctx, new WorldPoint(10, 15), 'yellow');
}

function run() {
  let lastTime = 0;

  function loop(time: number) {
    const dt = time - lastTime;
    draw(time);

    lastTime = time;
    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
  onboardCarImage.onload = () => {
    run();
  };

  onboardCarImage.src = 'onboard-car_green.svg';
})
