import { Graphics } from './graphics';
import { currentState, setKeyPressed, setKeyUnpressed, updateState } from './state';
import './style.css';
import { loadTrack } from './track';
import { Vector } from './vector';

const canvas = document.querySelector<HTMLCanvasElement>('#laptimeCanvas');
const ctx = canvas?.getContext('2d');
const onboardCarImage = new Image();

let graphics: Graphics;

function renderCurve() {
  graphics.renderPoint(new Vector(0, 1), 'fuchsia');
  graphics.renderPoint(new Vector(0, 2, 0), 'fuchsia');
  graphics.renderPoint(new Vector(0, 3, 0.2), 'fuchsia');
  graphics.renderPoint(new Vector(0, 4, 0.1), 'fuchsia');
  graphics.renderPoint(new Vector(0, 5), 'fuchsia');
  graphics.renderPoint(new Vector(0, 6), 'fuchsia');
  graphics.renderPoint(new Vector(0, 7), 'fuchsia');
  graphics.renderPoint(new Vector(0.1, 7.5), 'fuchsia');
  graphics.renderPoint(new Vector(0.25, 8), 'fuchsia');
  graphics.renderPoint(new Vector(0.5, 8.5), 'fuchsia');
  graphics.renderPoint(new Vector(1, 9), 'fuchsia');
  graphics.renderPoint(new Vector(1.5, 9.5), 'fuchsia');
  graphics.renderPoint(new Vector(2, 9.75), 'fuchsia');
  graphics.renderPoint(new Vector(2.5, 9.8), 'fuchsia');
  graphics.renderPoint(new Vector(3, 9.9), 'fuchsia');
  graphics.renderPoint(new Vector(3.5, 10), 'fuchsia');
  graphics.renderPoint(new Vector(4, 10), 'fuchsia');
  graphics.renderPoint(new Vector(5, 10), 'fuchsia');
  graphics.renderPoint(new Vector(6, 10), 'fuchsia');
}

function renderHouse() {
  const xOffset = 10;

  const a = new Vector(xOffset + 4, 16, 0);
  const b = new Vector(xOffset + 8, 16, 0);
  const c = new Vector(xOffset + 4, 16, 4);
  const d = new Vector(xOffset + 8, 16, 4);
  const e = new Vector(xOffset + 6, 16, 6);

  graphics.renderPoint(a, 'orange');
  graphics.renderPoint(b, 'orange');
  graphics.renderPoint(c, 'orange');
  graphics.renderPoint(d, 'orange');
  graphics.renderPoint(e, 'orange');

  graphics.renderLine(a, b, 'orange');
  graphics.renderLine(c, d, 'orange');
  graphics.renderLine(a, c, 'orange');
  graphics.renderLine(b, d, 'orange');
  graphics.renderLine(c, e, 'orange');
  graphics.renderLine(d, e, 'orange');

  const f = new Vector(xOffset + 4, 20, 0);
  const g = new Vector(xOffset + 8, 20, 0);
  const h = new Vector(xOffset + 4, 20, 4);
  const i = new Vector(xOffset + 8, 20, 4);
  const j = new Vector(xOffset + 6, 20, 6);

  graphics.renderPoint(f, 'orange');
  graphics.renderPoint(g, 'orange');
  graphics.renderPoint(h, 'orange');
  graphics.renderPoint(i, 'orange');
  graphics.renderPoint(j, 'orange');

  graphics.renderLine(f, g, 'orange');
  graphics.renderLine(h, i, 'orange');
  graphics.renderLine(f, h, 'orange');
  graphics.renderLine(g, i, 'orange');
  graphics.renderLine(h, j, 'orange');
  graphics.renderLine(i, j, 'orange');

  graphics.renderLine(a, f, 'orange');
  graphics.renderLine(b, g, 'orange');
  graphics.renderLine(c, h, 'orange');
  graphics.renderLine(d, i, 'orange');
  graphics.renderLine(e, j, 'orange');
}

function renderXLines(color: string) {
  for (let z = -2; z <= 2; z++) {
    let prev: Vector | undefined;

    for (let x = -30; x <= 30; x++) {
      const curr = new Vector(x, 20, z);

      graphics.renderPoint(curr, color);

      if (prev) {
        graphics.renderLine(prev, curr, color);
      }

      prev = curr;
    }
  }
}

function renderYLines(color: string) {
  for (let x = -5; x <= 5; x++) {
    let prev: Vector | undefined;

    for (let y = 0; y <= 30; y++) {
      const curr = new Vector(x, y, 0);

      graphics.renderPoint(curr, color);

      if (prev) {
        graphics.renderLine(prev, curr, color);
      }

      prev = curr;
    }
  }
}

function renderZLines(color: string) {
  for (let x = -10; x <= 10; x++) {
    let prev: Vector | undefined;

    for (let z = -2; z <= 10; z++) {
      const curr = new Vector(x, 10, z);

      graphics.renderPoint(curr, color);

      if (prev) {
        graphics.renderLine(prev, curr, color);
      }

      prev = curr;
    }
  }
}

function draw(time: number) {
  if (!ctx || !canvas) {
    return;
  }

  updateState();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky and ground
  graphics.renderHorizon();

  // View on track
  // graphics.renderCurrentTrackView();
  // renderHouse();
  graphics.renderPoint(new Vector(0, 10, 0), 'yellow');
  graphics.renderPoint(new Vector(10, 10, 0), 'yellow');

  // Car
  const carX = (canvas.width - onboardCarImage.width) / 2;
  const carY = canvas.height - onboardCarImage.height;
  ctx.drawImage(onboardCarImage, carX, carY);
}

function run() {
  let lastTime = 0;

  if (ctx) {
    graphics = new Graphics(ctx);
  }

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

  onboardCarImage.src = 'onboard-car_red.svg';

  loadTrack('testtrack').then((track) => {
    currentState.track = track;
  });
});

window.addEventListener('keydown', setKeyPressed);
window.addEventListener('keyup', setKeyUnpressed);

