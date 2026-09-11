export const printerPaperDefinitions = {
  a4: {
    widthMm: 210,
    heightMm: 297,
    pageCss: 'A4',
  },
  letter: {
    widthMm: 215.9,
    heightMm: 279.4,
    pageCss: 'Letter',
  },
} as const;

export type PrinterPaperSize = keyof typeof printerPaperDefinitions;

export const printerProfileDefinitions = {
  full: {
    showGrayscale: true,
    showColor: true,
  },
  color: {
    showGrayscale: false,
    showColor: true,
  },
  grayscale: {
    showGrayscale: true,
    showColor: false,
  },
} as const;

export type PrinterProfile = keyof typeof printerProfileDefinitions;

export const getPrinterPaperDefinition = (paper: PrinterPaperSize) => printerPaperDefinitions[paper];
export const getPrinterProfileDefinition = (profile: PrinterProfile) => printerProfileDefinitions[profile];

export const isPrinterPaperSize = (value: string): value is PrinterPaperSize => value in printerPaperDefinitions;
export const isPrinterProfile = (value: string): value is PrinterProfile => value in printerProfileDefinitions;
