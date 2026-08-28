export interface TouchOverlayPoint {
  readonly x: number;
  readonly y: number;
}

export interface TouchOverlayContactView {
  readonly x: number;
  readonly y: number;
  readonly trail: readonly TouchOverlayPoint[];
}

export interface TouchOverlayViewData {
  readonly contacts: readonly TouchOverlayContactView[];
  readonly unexpectedStarts: readonly TouchOverlayPoint[];
}

const svgNamespace = 'http://www.w3.org/2000/svg';

export const renderTouchOverlay = (
  overlay: SVGSVGElement,
  view: TouchOverlayViewData,
): void => {
  overlay.replaceChildren();

  view.contacts.forEach((contact) => {
    if (contact.trail.length > 1) {
      const path = document.createElementNS(svgNamespace, 'polyline');
      path.setAttribute(
        'points',
        contact.trail.map((point) => `${point.x * 1000},${point.y * 625}`).join(' '),
      );
      path.setAttribute('class', 'touch-overlay__trail');
      overlay.append(path);
    }

    const marker = document.createElementNS(svgNamespace, 'circle');
    marker.setAttribute('cx', String(contact.x * 1000));
    marker.setAttribute('cy', String(contact.y * 625));
    marker.setAttribute('r', '18');
    marker.setAttribute('class', 'touch-overlay__marker');
    overlay.append(marker);
  });

  view.unexpectedStarts.forEach((point) => {
    const marker = document.createElementNS(svgNamespace, 'circle');
    marker.setAttribute('cx', String(point.x * 1000));
    marker.setAttribute('cy', String(point.y * 625));
    marker.setAttribute('r', '10');
    marker.setAttribute('class', 'touch-overlay__unexpected');
    overlay.append(marker);
  });
};
