import { mountDisplayInspectionStage } from '../inspection/display-inspection-stage';

export interface BacklightBleedTestController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Backlight Bleed Test is missing ${selector}`);
  return element;
};

export const mountBacklightBleedTest = (root: HTMLElement): BacklightBleedTestController => {
  const stage = requireElement<HTMLElement>(root, '[data-inspection-stage]');
  const startButton = requireElement<HTMLButtonElement>(root, '[data-backlight-start]');
  const exitButton = requireElement<HTMLButtonElement>(root, '[data-inspection-exit]');
  const fullscreenNote = requireElement<HTMLElement>(root, '[data-inspection-fullscreen-note]');
  const stageController = mountDisplayInspectionStage({
    root,
    stage,
    startButton,
    exitButton,
    fullscreenNote,
  });

  let destroyed = false;

  return {
    start: () => {
      if (destroyed) return;
      stageController.start();
    },
    stop: () => {
      if (destroyed) return;
      stageController.stop();
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      stageController.destroy();
    },
  };
};
