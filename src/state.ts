import { deg2Rad } from "./math";
import { Vector } from "./vector";
import { ON_BOARD_VIEW_CONFIG } from "./view-constants";

export type KeyName = "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
const allArrowKeys: string[] = [
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
];

const { cameraElevation, cameraTiltDownAngle } = ON_BOARD_VIEW_CONFIG;
const cameraPosition = new Vector(0, 0, cameraElevation);
const cameraTiltDownAngleRad = -deg2Rad(cameraTiltDownAngle);
// const cameraVector = new Vector(
//   0,
//   Math.cos(cameraTiltDownAngleRad),
//   Math.sin(cameraTiltDownAngleRad),
// );
const rotationAngleRad = deg2Rad(0);
const cameraVector = new Vector(
  -Math.sin(rotationAngleRad) * Math.cos(cameraTiltDownAngleRad),
  Math.cos(rotationAngleRad) * Math.cos(cameraTiltDownAngleRad),
  Math.sin(cameraTiltDownAngleRad),
);

export type GameState = {
  pressedKeys: { [key in KeyName]: boolean };
  cameraVector: Vector;
  carPosition: Vector;
};

export const currentState: GameState = {
  pressedKeys: {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
  },
  cameraVector,
  carPosition: cameraPosition,
};

export function setKeyPressed(event: KeyboardEvent) {
  if (allArrowKeys.includes(event.key)) {
    isArrowKey(event.key);
    currentState.pressedKeys[event.key] = true;
  }
}

export function setKeyUnpressed(event: KeyboardEvent) {
  if (allArrowKeys.includes(event.key)) {
    isArrowKey(event.key);
    currentState.pressedKeys[event.key] = false;
  }
}

export function isKeyPressed(keyName: KeyName) {
  return currentState.pressedKeys[keyName];
}

function isArrowKey(keyName: string): asserts keyName is KeyName {
  if (!allArrowKeys.includes(keyName)) {
    throw new Error("Not an arrow key name");
  }
}

export function updateState() {
  if (isKeyPressed("ArrowUp")) {
    cameraPosition.forward(cameraVector);
  }

  if (isKeyPressed("ArrowDown")) {
    cameraPosition.backward(cameraVector);
  }

  if (isKeyPressed("ArrowLeft")) {
    cameraVector.left();
  }

  if (isKeyPressed("ArrowRight")) {
    cameraVector.right();
  }
}
