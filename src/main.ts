import { Graphics } from "./graphics";
import { setKeyPressed, setKeyUnpressed, updateState } from "./state";
import "./style.css";
import { Vector } from "./vector";

const canvas = document.querySelector<HTMLCanvasElement>("#laptimeCanvas");
const ctx = canvas?.getContext("2d");
const onboardCarImage = new Image();

let graphics: Graphics;

function renderCurve() {
  graphics.renderPoint(new Vector(0, 1), "red");
  graphics.renderPoint(new Vector(0, 2, 0), "red");
  graphics.renderPoint(new Vector(0, 3, 0.2), "red");
  graphics.renderPoint(new Vector(0, 4, 0.1), "red");
  graphics.renderPoint(new Vector(0, 5), "red");
  graphics.renderPoint(new Vector(0, 6), "red");
  graphics.renderPoint(new Vector(0, 7), "red");
  graphics.renderPoint(new Vector(0.1, 7.5), "red");
  graphics.renderPoint(new Vector(0.25, 8), "red");
  graphics.renderPoint(new Vector(0.5, 8.5), "red");
  graphics.renderPoint(new Vector(1, 9), "red");
  graphics.renderPoint(new Vector(1.5, 9.5), "red");
  graphics.renderPoint(new Vector(2, 9.75), "red");
  graphics.renderPoint(new Vector(2.5, 9.8), "red");
  graphics.renderPoint(new Vector(3, 9.9), "red");
  graphics.renderPoint(new Vector(3.5, 10), "red");
  graphics.renderPoint(new Vector(4, 10), "red");
  graphics.renderPoint(new Vector(5, 10), "red");
  graphics.renderPoint(new Vector(6, 10), "red");
}

function renderHouse() {
  const a = new Vector(4, 16, 0);
  const b = new Vector(8, 16, 0);
  const c = new Vector(4, 16, 4);
  const d = new Vector(8, 16, 4);
  const e = new Vector(6, 16, 6);

  graphics.renderPoint(a, "red");
  graphics.renderPoint(b, "red");
  graphics.renderPoint(c, "red");
  graphics.renderPoint(d, "red");
  graphics.renderPoint(e, "red");

  graphics.renderLine(a, b, "red");
  graphics.renderLine(c, d, "red");
  graphics.renderLine(a, c, "red");
  graphics.renderLine(b, d, "red");
  graphics.renderLine(c, e, "red");
  graphics.renderLine(d, e, "red");

  const f = new Vector(4, 20, 0);
  const g = new Vector(8, 20, 0);
  const h = new Vector(4, 20, 4);
  const i = new Vector(8, 20, 4);
  const j = new Vector(6, 20, 6);

  graphics.renderPoint(f, "red");
  graphics.renderPoint(g, "red");
  graphics.renderPoint(h, "red");
  graphics.renderPoint(i, "red");
  graphics.renderPoint(j, "red");

  graphics.renderLine(f, g, "red");
  graphics.renderLine(h, i, "red");
  graphics.renderLine(f, h, "red");
  graphics.renderLine(g, i, "red");
  graphics.renderLine(h, j, "red");
  graphics.renderLine(i, j, "red");

  graphics.renderLine(a, f, "red");
  graphics.renderLine(b, g, "red");
  graphics.renderLine(c, h, "red");
  graphics.renderLine(d, i, "red");
  graphics.renderLine(e, j, "red");
}

function draw(time: number) {
  if (!ctx || !canvas) {
    return;
  }

  updateState();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  // ctx.fillStyle = '#aaddff'
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Car
  const carX = (canvas.width - onboardCarImage.width) / 2;
  const carY = canvas.height - onboardCarImage.height;
  ctx.drawImage(onboardCarImage, carX, carY);

  // View on track
  renderHouse();
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

window.addEventListener("load", () => {
  onboardCarImage.onload = () => {
    run();
  };

  onboardCarImage.src = "onboard-car_green.svg";
});

window.addEventListener("keydown", setKeyPressed);
window.addEventListener("keyup", setKeyUnpressed);
