import {
  mountDisplayInspectionStage,
  type DisplayInspectionStageController,
} from '../inspection/display-inspection-stage';
import {
  getDeadPixelColor,
  moveDeadPixelColorIndex,
} from './dead-pixel-colors';

export interface DeadPixelTestController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Dead Pixel Test is missing ${selector}`);
  return element;
};

export const mountDeadPixelTest = (root: HTMLElement): DeadPixelTestController => {
  const stage = requireElement<HTMLElement>(root, '[data-inspection-stage]');
  const startButton = requireElement<HTMLButtonElement>(root, '[data-dead-pixel-start]');
  const exitButton = requireElement<HTMLButtonElement>(root, '[data-inspection-exit]');
  const fullscreenNote = requireElement<HTMLElement>(root, '[data-inspection-fullscreen-note]');
  const colorName = requireElement<HTMLElement>(root, '[data-dead-pixel-color]');
  const colorPosition = requireElement<HTMLElement>(root, '[data-dead-pixel-position]');

  let colorIndex = 0;
  let destroyed = false;
  let stageController: DisplayInspectionStageController;

  const renderColor = (): void => {
    const color = getDeadPixelColor(colorIndex);
    stage.style.setProperty('--inspection-color', color.value);
    stage.dataset.colorName = color.name;
    colorName.textContent = color.name;
    colorPosition.textContent = `${colorIndex + 1} / 5`;
  };

  const advanceColor = (delta: -1 | 1): void => {
    colorIndex = moveDeadPixelColorIndex(colorIndex, delta);
    renderColor();
    stageController.showOverlay();
  };

  const isInspectionControl = (target: EventTarget | null): boolean =>
    target instanceof Element && target.closest('[data-inspection-control]') !== null;

  const handleStageClick = (event: MouseEvent): void => {
    if (!stageController.isActive() || isInspectionControl(event.target)) return;
    advanceColor(1);
  };

  const handleStageKeydown = (event: KeyboardEvent): void => {
    if (!stageController.isActive() || isInspectionControl(event.target)) return;

    if (event.key === ' ' || event.key === 'ArrowRight') {
      event.preventDefault();
      advanceColor(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      advanceColor(-1);
    }
  };

  const handleStart = (): void => {
    colorIndex = 0;
    renderColor();
  };

  stageController = mountDisplayInspectionStage({
    root,
    stage,
    startButton,
    exitButton,
    fullscreenNote,
  });

  startButton.addEventListener('click', handleStart);
  stage.addEventListener('click', handleStageClick);
  stage.addEventListener('keydown', handleStageKeydown);
  renderColor();

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
      startButton.removeEventListener('click', handleStart);
      stage.removeEventListener('click', handleStageClick);
      stage.removeEventListener('keydown', handleStageKeydown);
      stageController.destroy();
    },
  };
};
