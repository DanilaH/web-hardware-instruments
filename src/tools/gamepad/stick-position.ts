export interface StickPosition {
  x: number;
  y: number;
}

export type StickSide = 'left' | 'right';

export interface StandardStickPositions {
  left: StickPosition;
  right: StickPosition;
}
