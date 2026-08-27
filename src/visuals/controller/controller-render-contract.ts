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

export interface StickRenderData {
  x: number;
  y: number;
  pressed: boolean;
}

export interface StandardControllerRenderData {
  buttons: Readonly<Record<StandardButtonName, boolean>>;
  triggers: {
    left: number;
    right: number;
  };
  sticks: {
    left: StickRenderData;
    right: StickRenderData;
  };
  pressedLabels: readonly string[];
}

export interface FallbackButtonRenderData {
  label: string;
  pressed: boolean;
  value: number;
}

export interface FallbackAxisRenderData {
  label: string;
  percent: number;
  positionPercent: number;
}

export interface FallbackControllerRenderData {
  buttons: readonly FallbackButtonRenderData[];
  axes: readonly FallbackAxisRenderData[];
}
