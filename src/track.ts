import { WorldPoint } from "./world";

export type Track = {
  path: WorldPoint[];
  start: WorldPoint;
};

export const demoTrack: Track = {
  path: [
    new WorldPoint(30, 40),
    new WorldPoint(30, 40),
    new WorldPoint(30, 290),
    new WorldPoint(40, 310),
    new WorldPoint(60, 320),
    new WorldPoint(100, 320),
    new WorldPoint(110, 330),
    new WorldPoint(30, 40),
  ],
  start: new WorldPoint(30, 100),
};