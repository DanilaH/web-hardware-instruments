import type {
  FallbackControllerRenderData,
  StandardButtonName,
  StandardControllerRenderData,
} from './controller-render-contract';

const STICK_TRAVEL = 11;

export class StandardControllerRenderer {
  private readonly buttonElements: ReadonlyMap<StandardButtonName, SVGElement>;
  private readonly leftStick: SVGElement;
  private readonly rightStick: SVGElement;
  private readonly leftTrigger: SVGElement;
  private readonly rightTrigger: SVGElement;

  constructor(root: HTMLElement) {
    const entries = Array.from(root.querySelectorAll<SVGElement>('[data-controller-button]')).map(
      (element) => [element.dataset.controllerButton as StandardButtonName, element] as const,
    );

    this.buttonElements = new Map(entries);
    this.leftStick = this.requireElement(root, '[data-controller-stick="left"]');
    this.rightStick = this.requireElement(root, '[data-controller-stick="right"]');
    this.leftTrigger = this.requireElement(root, '[data-controller-trigger="left"]');
    this.rightTrigger = this.requireElement(root, '[data-controller-trigger="right"]');
  }

  render(view: StandardControllerRenderData): void {
    this.buttonElements.forEach((element, name) => {
      element.classList.toggle('is-active', view.buttons[name]);
    });

    this.renderStick(this.leftStick, view.sticks.left.x, view.sticks.left.y, view.sticks.left.pressed);
    this.renderStick(
      this.rightStick,
      view.sticks.right.x,
      view.sticks.right.y,
      view.sticks.right.pressed,
    );
    this.leftTrigger.style.setProperty('--trigger-value', String(view.triggers.left));
    this.rightTrigger.style.setProperty('--trigger-value', String(view.triggers.right));
  }

  reset(): void {
    this.buttonElements.forEach((element) => element.classList.remove('is-active'));
    this.renderStick(this.leftStick, 0, 0, false);
    this.renderStick(this.rightStick, 0, 0, false);
    this.leftTrigger.style.setProperty('--trigger-value', '0');
    this.rightTrigger.style.setProperty('--trigger-value', '0');
  }

  private renderStick(element: SVGElement, x: number, y: number, pressed: boolean): void {
    element.setAttribute('transform', `translate(${x * STICK_TRAVEL} ${y * STICK_TRAVEL})`);
    element.classList.toggle('is-active', pressed);
  }

  private requireElement(root: HTMLElement, selector: string): SVGElement {
    const element = root.querySelector<SVGElement>(selector);
    if (!element) {
      throw new Error(`Controller visual is missing ${selector}`);
    }
    return element;
  }
}

export class FallbackControllerRenderer {
  private signature = '';
  private buttonElements: HTMLElement[] = [];
  private axisMarkers: HTMLElement[] = [];

  constructor(private readonly root: HTMLElement) {}

  render(view: FallbackControllerRenderData): void {
    const signature = `${view.buttons.length}:${view.axes.length}`;
    if (signature !== this.signature) {
      this.rebuild(view);
      this.signature = signature;
    }

    view.buttons.forEach((button, index) => {
      const element = this.buttonElements[index];
      if (!element) return;
      element.classList.toggle('is-active', button.pressed);
      element.style.setProperty('--button-value', String(button.value));
      element.setAttribute(
        'aria-label',
        `${button.label}, ${button.pressed ? 'pressed' : 'released'}`,
      );
    });

    view.axes.forEach((axis, index) => {
      const marker = this.axisMarkers[index];
      if (!marker) return;
      marker.style.left = `${axis.positionPercent}%`;
      marker.setAttribute('aria-valuenow', String(axis.percent));
      marker.setAttribute('aria-valuetext', `${axis.percent}%`);
    });
  }

  clear(): void {
    this.root.replaceChildren();
    this.signature = '';
    this.buttonElements = [];
    this.axisMarkers = [];
  }

  private rebuild(view: FallbackControllerRenderData): void {
    const buttonsGroup = document.createElement('div');
    buttonsGroup.className = 'gamepad-fallback__group';

    const buttonsTitle = document.createElement('p');
    buttonsTitle.className = 'gamepad-fallback__label';
    buttonsTitle.textContent = 'Buttons';
    buttonsGroup.append(buttonsTitle);

    const buttonGrid = document.createElement('div');
    buttonGrid.className = 'gamepad-fallback__buttons';
    this.buttonElements = view.buttons.map((buttonView) => {
      const button = document.createElement('div');
      button.className = 'gamepad-fallback__button';
      button.setAttribute('role', 'img');
      button.setAttribute('aria-label', `${buttonView.label}, released`);
      button.textContent = buttonView.label.replace('Button ', '');
      buttonGrid.append(button);
      return button;
    });
    buttonsGroup.append(buttonGrid);

    const axesGroup = document.createElement('div');
    axesGroup.className = 'gamepad-fallback__group';

    const axesTitle = document.createElement('p');
    axesTitle.className = 'gamepad-fallback__label';
    axesTitle.textContent = 'Axes';
    axesGroup.append(axesTitle);

    const axesList = document.createElement('div');
    axesList.className = 'gamepad-fallback__axes';
    this.axisMarkers = view.axes.map((axisView) => {
      const row = document.createElement('div');
      row.className = 'gamepad-fallback__axis';

      const label = document.createElement('span');
      label.className = 'gamepad-fallback__axis-label';
      label.textContent = axisView.label;

      const track = document.createElement('div');
      track.className = 'gamepad-fallback__axis-track';
      const center = document.createElement('span');
      center.className = 'gamepad-fallback__axis-center';
      const marker = document.createElement('span');
      marker.className = 'gamepad-fallback__axis-marker';
      marker.setAttribute('role', 'meter');
      marker.setAttribute('aria-label', axisView.label);
      marker.setAttribute('aria-valuemin', '-100');
      marker.setAttribute('aria-valuemax', '100');
      marker.setAttribute('aria-valuenow', '0');
      marker.setAttribute('aria-valuetext', '0%');
      track.append(center, marker);

      row.append(label, track);
      axesList.append(row);
      return marker;
    });
    axesGroup.append(axesList);

    this.root.replaceChildren(buttonsGroup, axesGroup);
  }
}
