import {
  getPrinterPaperDefinition,
  isPrinterPaperSize,
  isPrinterProfile,
  type PrinterPaperSize,
  type PrinterProfile,
} from './printer-pattern';

export interface PrinterTestController {
  destroy(): void;
}

const selectedLabel = (select: HTMLSelectElement): string =>
  select.selectedOptions[0]?.textContent?.trim() ?? select.value;

const stripCloneAccessibilityIds = (root: HTMLElement): void => {
  root.removeAttribute('id');
  root.removeAttribute('aria-labelledby');
  root.querySelectorAll<HTMLElement>('[id]').forEach((element) => element.removeAttribute('id'));
  root.querySelectorAll<HTMLElement>('[aria-labelledby]').forEach((element) => element.removeAttribute('aria-labelledby'));
};

export const mountPrinterTest = (root: HTMLElement): PrinterTestController => {
  const paperSelect = root.querySelector<HTMLSelectElement>('[data-printer-paper]');
  const profileSelect = root.querySelector<HTMLSelectElement>('[data-printer-profile]');
  const printButton = root.querySelector<HTMLButtonElement>('[data-printer-print]');
  const sheet = root.querySelector<HTMLElement>('[data-printer-sheet]');
  const paperValue = root.querySelector<HTMLElement>('[data-printer-paper-value]');
  const profileValue = root.querySelector<HTMLElement>('[data-printer-profile-value]');

  if (!paperSelect || !profileSelect || !printButton || !sheet || !paperValue || !profileValue) {
    throw new Error('Printer Test Page is missing required controls.');
  }

  let activePrintRoot: HTMLElement | null = null;
  let activePageStyle: HTMLStyleElement | null = null;
  let cleanupTimer: number | null = null;
  let destroyed = false;

  const readPaper = (): PrinterPaperSize =>
    isPrinterPaperSize(paperSelect.value) ? paperSelect.value : 'a4';

  const readProfile = (): PrinterProfile =>
    isPrinterProfile(profileSelect.value) ? profileSelect.value : 'full';

  const applyState = (): void => {
    const paper = readPaper();
    const profile = readProfile();

    root.dataset.paper = paper;
    root.dataset.profile = profile;
    sheet.dataset.paper = paper;
    sheet.dataset.profile = profile;
    paperValue.textContent = selectedLabel(paperSelect);
    profileValue.textContent = selectedLabel(profileSelect);
  };

  const cleanupPrintMode = (): void => {
    if (cleanupTimer !== null) {
      window.clearTimeout(cleanupTimer);
      cleanupTimer = null;
    }
    document.documentElement.classList.remove('printer-print-mode');
    activePrintRoot?.remove();
    activePageStyle?.remove();
    activePrintRoot = null;
    activePageStyle = null;
    window.removeEventListener('afterprint', cleanupPrintMode);
  };

  const handlePrint = (): void => {
    if (destroyed) return;

    cleanupPrintMode();
    applyState();

    const paper = readPaper();
    const printRoot = document.createElement('div');
    printRoot.dataset.printerPrintRoot = '';

    const printSheet = sheet.cloneNode(true) as HTMLElement;
    stripCloneAccessibilityIds(printSheet);
    printRoot.append(printSheet);

    const pageStyle = document.createElement('style');
    pageStyle.dataset.printerPageStyle = '';
    pageStyle.textContent = `@page { size: ${getPrinterPaperDefinition(paper).pageCss} portrait; margin: 10mm; }`;

    activePrintRoot = printRoot;
    activePageStyle = pageStyle;
    document.head.append(pageStyle);
    document.body.append(printRoot);
    document.documentElement.classList.add('printer-print-mode');
    window.addEventListener('afterprint', cleanupPrintMode, { once: true });

    window.print();

    // Target browsers emit afterprint for both print and cancellation. Keep only
    // a long emergency cleanup when the print DOM is still active after print().
    if (activePrintRoot !== null) {
      cleanupTimer = window.setTimeout(cleanupPrintMode, 60_000);
    }
  };

  const handleStateChange = (): void => applyState();

  paperSelect.addEventListener('change', handleStateChange);
  profileSelect.addEventListener('change', handleStateChange);
  printButton.addEventListener('click', handlePrint);
  applyState();

  return {
    destroy(): void {
      if (destroyed) return;
      destroyed = true;
      paperSelect.removeEventListener('change', handleStateChange);
      profileSelect.removeEventListener('change', handleStateChange);
      printButton.removeEventListener('click', handlePrint);
      cleanupPrintMode();
    },
  };
};
