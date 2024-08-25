import { Vector } from './vector';

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

export function loadTrack(name: string): Promise<Track> {
  return fetch(`../tracks/${name}.json`).then(
    (res) => {
      return res.json().then((trackData: { x: number; y: number }[]) => {
        return {
          path: trackData.map(({ x, y }) => new Vector(x, y, 0)),
          start: new Vector(0, 24, 0),
        };
      });
    },
    (err) => {
      throw err;
    },
  );
}

