import type { StandardMouseVisualData } from './mouse-render-contract';

export const renderStandardMouseVisual = (
  root: HTMLElement,
  data: StandardMouseVisualData,
): void => {
  root.querySelectorAll<SVGElement>('[data-mouse-visual-button]').forEach((element) => {
    const raw = element.dataset.mouseVisualButton;
    const button = raw === undefined ? Number.NaN : Number(raw);
    element.dataset.active = Number.isInteger(button) && data.heldButtons[button] ? 'true' : 'false';
  });

  const wheel = root.querySelector<SVGElement>('[data-mouse-visual-wheel]');
  if (wheel) {
    wheel.dataset.direction = data.wheelDirection ?? 'none';
  }

  const movement = root.querySelector<SVGElement>('[data-mouse-visual-movement]');
  if (movement) {
    movement.dataset.active = data.movementDetected ? 'true' : 'false';
  }
};
