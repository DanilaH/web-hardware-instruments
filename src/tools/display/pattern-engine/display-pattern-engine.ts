import type { FullscreenHelper } from '../../../browser/fullscreen';
import {
  mountDisplayInspectionStage,
  type DisplayInspectionStageController,
} from '../inspection/display-inspection-stage';
import { moveDisplayPatternIndex, type DisplayPattern } from './display-patterns';

export interface DisplayPatternEngineController {
  start(): void;
  stop(): void;
  destroy(): void;
  isActive(): boolean;
  getActiveIndex(): number;
  move(delta: -1 | 1): void;
}

interface DisplayPatternEngineOptions {
  root: HTMLElement;
  stage: HTMLElement;
  startButton: HTMLButtonElement;
  exitButton: HTMLButtonElement;
  previousButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  hideButton: HTMLButtonElement;
  fullscreenNote: HTMLElement;
  patternSurface: HTMLElement;
  patternLabel: HTMLElement;
  patternPosition: HTMLElement;
  patterns: readonly DisplayPattern[];
  labels: readonly string[];
  fullscreenUnavailableMessage: string;
  fullscreen?: FullscreenHelper;
}

const isInspectionControl = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest('[data-inspection-control]') !== null;

export const mountDisplayPatternEngine = ({
  root,
  stage,
  startButton,
  exitButton,
  previousButton,
  nextButton,
  hideButton,
  fullscreenNote,
  patternSurface,
  patternLabel,
  patternPosition,
  patterns,
  labels,
  fullscreenUnavailableMessage,
  fullscreen,
}: DisplayPatternEngineOptions): DisplayPatternEngineController => {
  if (patterns.length === 0 || patterns.length !== labels.length) {
    throw new Error('Display Pattern Engine requires one localized label per pattern.');
  }

  const bars = patternSurface.querySelector<HTMLElement>('[data-display-pattern-bars]');
  if (!bars) throw new Error('Display Pattern Engine is missing its bars surface.');

  let activeIndex = 0;
  let destroyed = false;
  let stageController: DisplayInspectionStageController;

  const render = (): void => {
    const pattern = patterns[activeIndex] ?? patterns[0];
    const label = labels[activeIndex] ?? labels[0] ?? '';
    if (!pattern) return;

    patternSurface.dataset.patternKind = pattern.kind;
    patternSurface.dataset.patternId = pattern.id;
    patternSurface.style.removeProperty('--display-pattern-color');
    patternSurface.style.removeProperty('--display-pattern-gradient');
    bars.replaceChildren();

    if (pattern.kind === 'solid') {
      patternSurface.style.setProperty('--display-pattern-color', pattern.value);
    } else if (pattern.kind === 'gradient') {
      patternSurface.style.setProperty('--display-pattern-gradient', pattern.css);
    } else if (pattern.kind === 'bars') {
      for (const value of pattern.values) {
        const bar = document.createElement('span');
        bar.style.background = value;
        bars.append(bar);
      }
    }

    patternLabel.textContent = label;
    patternPosition.textContent = `${activeIndex + 1} / ${patterns.length}`;
    root.dataset.patternId = pattern.id;
  };

  const move = (delta: -1 | 1): void => {
    if (destroyed || !stageController.isActive()) return;
    activeIndex = moveDisplayPatternIndex(activeIndex, delta, patterns.length);
    render();
    stageController.showOverlay();
  };

  const handleStart = (): void => {
    activeIndex = 0;
    render();
  };

  const handleStageClick = (event: MouseEvent): void => {
    if (!stageController.isActive() || isInspectionControl(event.target)) return;
    move(1);
  };

  const handleStageKeydown = (event: KeyboardEvent): void => {
    if (!stageController.isActive() || isInspectionControl(event.target)) return;
    if (event.key === ' ' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
  };

  const handlePrevious = (event: Event): void => { event.stopPropagation(); move(-1); };
  const handleNext = (event: Event): void => { event.stopPropagation(); move(1); };
  const handleHide = (event: Event): void => {
    event.stopPropagation();
    stageController.hideOverlay();
    stage.focus({ preventScroll: true });
  };

  stageController = mountDisplayInspectionStage({
    root,
    stage,
    startButton,
    exitButton,
    fullscreenNote,
    fullscreenUnavailableMessage,
    ...(fullscreen ? { fullscreen } : {}),
  });

  startButton.addEventListener('click', handleStart);
  stage.addEventListener('click', handleStageClick);
  stage.addEventListener('keydown', handleStageKeydown);
  previousButton.addEventListener('click', handlePrevious);
  nextButton.addEventListener('click', handleNext);
  hideButton.addEventListener('click', handleHide);
  render();

  return {
    start: () => { if (!destroyed) stageController.start(); },
    stop: () => { if (!destroyed) stageController.stop(); },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      startButton.removeEventListener('click', handleStart);
      stage.removeEventListener('click', handleStageClick);
      stage.removeEventListener('keydown', handleStageKeydown);
      previousButton.removeEventListener('click', handlePrevious);
      nextButton.removeEventListener('click', handleNext);
      hideButton.removeEventListener('click', handleHide);
      stageController.destroy();
    },
    isActive: () => stageController.isActive(),
    getActiveIndex: () => activeIndex,
    move,
  };
};
