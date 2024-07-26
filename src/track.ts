import { Vector } from "./world";

export type Track = {
  path: Vector[];
  start: Vector;
};

export const demoTrack: Track = {
  path: [
    new Vector(30, 40),
    new Vector(30, 40),
    new Vector(30, 290),
    new Vector(40, 310),
    new Vector(60, 320),
    new Vector(100, 320),
    new Vector(110, 330),
    new Vector(30, 40),
  ],
  start: new Vector(30, 100),
};