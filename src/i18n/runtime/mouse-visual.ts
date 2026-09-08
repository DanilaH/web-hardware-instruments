import type { ImplementedContentLocale } from '../content';

export interface MouseVisualMessages {
  movementGuide: {
    relativeLeft: string;
    origin: string;
    relativeRight: string;
  };
}

const mouseVisualMessagesByLocale = {
  en: {
    movementGuide: {
      relativeLeft: 'relative left',
      origin: 'origin',
      relativeRight: 'relative right',
    },
  },
  'pt-BR': {
    movementGuide: {
      relativeLeft: 'esquerda relativa',
      origin: 'origem',
      relativeRight: 'direita relativa',
    },
  },
  de: {
    movementGuide: {
      relativeLeft: 'relativ links',
      origin: 'Ursprung',
      relativeRight: 'relativ rechts',
    },
  },
  fr: {
    movementGuide: {
      relativeLeft: 'gauche relative',
      origin: 'origine',
      relativeRight: 'droite relative',
    },
  },
  es: {
    movementGuide: {
      relativeLeft: 'izquierda relativa',
      origin: 'origen',
      relativeRight: 'derecha relativa',
    },
  },
} as const satisfies Record<ImplementedContentLocale, MouseVisualMessages>;

export const getMouseVisualMessages = (locale: ImplementedContentLocale): MouseVisualMessages =>
  mouseVisualMessagesByLocale[locale];