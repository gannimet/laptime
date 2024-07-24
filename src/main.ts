import { deg2Rad } from './math';
import './style.css'
import { demoTrack } from './track';
import { ON_BOARD_VIEW_CONFIG } from './view-constants';
import { WorldPoint } from './world';

const canvas = document.querySelector<HTMLCanvasElement>('#laptimeCanvas');
const ctx = canvas?.getContext("2d");
const onboardCarImage = new Image();
const track = demoTrack;
const { cameraAngularFieldOfViewVertical, cameraFocalLength, cameraElevation } = ON_BOARD_VIEW_CONFIG;
const fieldOfViewRad = deg2Rad(cameraAngularFieldOfViewVertical);
const sensorWidth =
  (cameraFocalLength * Math.sin(fieldOfViewRad)) /
  (Math.sin((Math.PI - fieldOfViewRad) / 2));
const sensorHeight = ((canvas?.height ?? 1080) * sensorWidth) / (canvas?.width ?? 1920)
const cameraPosition = new WorldPoint(0, 0, cameraElevation);

function renderPoint(ctx: CanvasRenderingContext2D, pointToRender: WorldPoint, color: string) {
  const { x: dx, y: dy, z: dz } = cameraPosition.deltaTo(pointToRender);
  const sensorXOffset = -(dx * cameraFocalLength) / Math.abs(dy);
  const sensorYOffset = -(dz * cameraFocalLength) / dy;
  const projectionXOffset = sensorXOffset * ctx.canvas.width / sensorWidth;
  const projectionYOffset = sensorYOffset * ctx.canvas.height / sensorHeight;
  const projectionX = (ctx.canvas.width / 2) + projectionXOffset;
  const projectionY = (ctx.canvas.height / 2) + projectionYOffset;
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
  renderPoint(ctx, new WorldPoint(0, 5), 'white');
  renderPoint(ctx, new WorldPoint(0, 20), 'red');
  renderPoint(ctx, new WorldPoint(15, 60), 'orange');
  renderPoint(ctx, new WorldPoint(20, 100), 'yellow');
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
