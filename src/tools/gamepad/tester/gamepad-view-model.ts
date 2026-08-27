import type { GamepadSnapshot } from '../../../browser/gamepad-service';

export interface StandardControllerViewData {
  buttons: Readonly<Record<StandardButtonName, boolean>>;
  triggers: {
    left: number;
    right: number;
  };
  sticks: {
    left: StickViewData;
    right: StickViewData;
  };
  pressedLabels: readonly string[];
}

interface StickViewData {
  x: number;
  y: number;
  pressed: boolean;
}

export type StandardButtonName =
  | 'face-bottom'
  | 'face-right'
  | 'face-left'
  | 'face-top'
  | 'left-shoulder'
  | 'right-shoulder'
  | 'back'
  | 'start'
  | 'left-stick'
  | 'right-stick'
  | 'dpad-up'
  | 'dpad-down'
  | 'dpad-left'
  | 'dpad-right'
  | 'home';

const BUTTONS: ReadonlyArray<{
  index: number;
  name: StandardButtonName;
  label: string;
}> = [
  { index: 0, name: 'face-bottom', label: 'Face bottom' },
  { index: 1, name: 'face-right', label: 'Face right' },
  { index: 2, name: 'face-left', label: 'Face left' },
  { index: 3, name: 'face-top', label: 'Face top' },
  { index: 4, name: 'left-shoulder', label: 'Left shoulder' },
  { index: 5, name: 'right-shoulder', label: 'Right shoulder' },
  { index: 8, name: 'back', label: 'Back' },
  { index: 9, name: 'start', label: 'Start' },
  { index: 10, name: 'left-stick', label: 'Left stick button' },
  { index: 11, name: 'right-stick', label: 'Right stick button' },
  { index: 12, name: 'dpad-up', label: 'D-pad up' },
  { index: 13, name: 'dpad-down', label: 'D-pad down' },
  { index: 14, name: 'dpad-left', label: 'D-pad left' },
  { index: 15, name: 'dpad-right', label: 'D-pad right' },
  { index: 16, name: 'home', label: 'Home' },
];

const getPressed = (snapshot: GamepadSnapshot, index: number): boolean =>
  snapshot.buttons[index]?.pressed ?? false;

const getValue = (snapshot: GamepadSnapshot, index: number): number =>
  snapshot.buttons[index]?.value ?? 0;

const getAxis = (snapshot: GamepadSnapshot, index: number): number => snapshot.axes[index] ?? 0;

export const createStandardControllerView = (
  snapshot: GamepadSnapshot,
): StandardControllerViewData => {
  const buttons = Object.fromEntries(
    BUTTONS.map(({ index, name }) => [name, getPressed(snapshot, index)]),
  ) as Record<StandardButtonName, boolean>;

  return {
    buttons,
    triggers: {
      left: getValue(snapshot, 6),
      right: getValue(snapshot, 7),
    },
    sticks: {
      left: {
        x: getAxis(snapshot, 0),
        y: getAxis(snapshot, 1),
        pressed: getPressed(snapshot, 10),
      },
      right: {
        x: getAxis(snapshot, 2),
        y: getAxis(snapshot, 3),
        pressed: getPressed(snapshot, 11),
      },
    },
    pressedLabels: BUTTONS.filter(({ index }) => getPressed(snapshot, index)).map(
      ({ label }) => label,
    ),
  };
};

const toPercent = (value: number): number => Math.round(value * 100);

export const createAccessibleControllerSummary = (
  view: StandardControllerViewData,
): string => {
  const pressed =
    view.pressedLabels.length > 0 ? view.pressedLabels.join(', ') : 'No buttons pressed';

  return `${pressed}. Left stick x ${toPercent(view.sticks.left.x)}%, y ${toPercent(
    view.sticks.left.y,
  )}%. Right stick x ${toPercent(view.sticks.right.x)}%, y ${toPercent(
    view.sticks.right.y,
  )}%. Left trigger ${toPercent(view.triggers.left)}%. Right trigger ${toPercent(
    view.triggers.right,
  )}%.`;
};
