import type { GamepadSnapshot } from '../../../browser/gamepad-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import type {
  FallbackControllerRenderData,
  StandardButtonName,
  StandardControllerRenderData,
} from '../../../visuals/controller/controller-render-contract';

export interface StandardControllerViewData extends StandardControllerRenderData {
  pressedLabels: readonly string[];
}

type Messages = ToolRuntimeMessages<'gamepadTester'>;

const BUTTONS: ReadonlyArray<{ index: number; name: StandardButtonName }> = [
  { index: 0, name: 'face-bottom' },
  { index: 1, name: 'face-right' },
  { index: 2, name: 'face-left' },
  { index: 3, name: 'face-top' },
  { index: 4, name: 'left-shoulder' },
  { index: 5, name: 'right-shoulder' },
  { index: 8, name: 'back' },
  { index: 9, name: 'start' },
  { index: 10, name: 'left-stick' },
  { index: 11, name: 'right-stick' },
  { index: 12, name: 'dpad-up' },
  { index: 13, name: 'dpad-down' },
  { index: 14, name: 'dpad-left' },
  { index: 15, name: 'dpad-right' },
  { index: 16, name: 'home' },
];

const getPressed = (snapshot: GamepadSnapshot, index: number): boolean => snapshot.buttons[index]?.pressed ?? false;
const getValue = (snapshot: GamepadSnapshot, index: number): number => snapshot.buttons[index]?.value ?? 0;
const getAxis = (snapshot: GamepadSnapshot, index: number): number => snapshot.axes[index] ?? 0;
const toPercent = (value: number): number => Math.round(value * 100);

export const createStandardControllerView = (
  snapshot: GamepadSnapshot,
  messages: Messages,
): StandardControllerViewData => {
  const buttons = Object.fromEntries(
    BUTTONS.map(({ index, name }) => [name, getPressed(snapshot, index)]),
  ) as Record<StandardButtonName, boolean>;

  return {
    buttons,
    triggers: { left: getValue(snapshot, 6), right: getValue(snapshot, 7) },
    sticks: {
      left: { x: getAxis(snapshot, 0), y: getAxis(snapshot, 1), pressed: getPressed(snapshot, 10) },
      right: { x: getAxis(snapshot, 2), y: getAxis(snapshot, 3), pressed: getPressed(snapshot, 11) },
    },
    pressedLabels: BUTTONS.flatMap(({ index }, labelIndex) =>
      getPressed(snapshot, index) ? [messages.buttonLabels[labelIndex] ?? String(index + 1)] : [],
    ),
  };
};

export const createFallbackControllerView = (
  snapshot: GamepadSnapshot,
  messages: Messages,
): FallbackControllerRenderData => ({
  buttons: snapshot.buttons.map((button, index) => ({
    text: String(index + 1),
    label: formatMessage(messages.button, { number: index + 1 }),
    pressed: button.pressed,
    value: button.value,
  })),
  axes: snapshot.axes.map((axis, index) => ({
    label: formatMessage(messages.axis, { number: index + 1 }),
    percent: toPercent(axis),
    positionPercent: ((axis + 1) / 2) * 100,
  })),
});

export const createAccessibleControllerSummary = (
  view: StandardControllerViewData,
  messages: Messages,
): string => formatMessage(messages.standardSummary, {
  pressed: view.pressedLabels.length > 0 ? view.pressedLabels.join(', ') : messages.noButtonsPressed,
  leftX: toPercent(view.sticks.left.x),
  leftY: toPercent(view.sticks.left.y),
  rightX: toPercent(view.sticks.right.x),
  rightY: toPercent(view.sticks.right.y),
  leftTrigger: toPercent(view.triggers.left),
  rightTrigger: toPercent(view.triggers.right),
});

export const createAccessibleFallbackSummary = (
  view: FallbackControllerRenderData,
  messages: Messages,
): string => {
  const count = view.buttons.filter((button) => button.pressed).length;
  return formatMessage(messages.fallbackSummary, {
    count,
    buttonWord: count === 1 ? messages.buttonWordOne : messages.buttonWordMany,
  });
};
