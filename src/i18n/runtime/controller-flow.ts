import type { ImplementedContentLocale } from '../content';

export interface ControllerFlowMessages {
  stickDrift: {
    sampleLabel: string;
    sampleComplete: string;
    plotScale: string;
    readyInstruction: string;
    samplingInstruction: string;
    testingButton: string;
    mappingLimitation: string;
    mappingInstruction: string;
    mappingSummary: string;
    cancelledInstruction: string;
    noSamples: string;
    noSamplesInstruction: string;
    noSamplesSummary: string;
    resultInstruction: string;
    accessLost: string;
    disconnected: string;
    selectedDisconnected: string;
    mappingLost: string;
    pageHidden: string;
    stopped: string;
  };
  deadzone: {
    sampleLabel: string;
    sampleComplete: string;
    centerDetailScale: string;
    leftChoice: string;
    rightChoice: string;
    readyInstructionLeft: string;
    readyInstructionRight: string;
    samplingInstructionLeft: string;
    samplingInstructionRight: string;
    testingButton: string;
    mappingLimitation: string;
    mappingInstruction: string;
    mappingSummary: string;
    cancelledInstructionLeft: string;
    cancelledInstructionRight: string;
    noSamples: string;
    noSamplesInstruction: string;
    noSamplesSummary: string;
    resultInstruction: string;
    accessLost: string;
    disconnected: string;
    selectedDisconnected: string;
    mappingLost: string;
    pageHidden: string;
    stopped: string;
  };
}

const controllerFlowMessagesByLocale = {
  en: {
    stickDrift: {
      sampleLabel: '3-second sample',
      sampleComplete: '3-second sample complete',
      plotScale: '20% radius',
      readyInstruction: 'Release both sticks and keep them untouched.',
      samplingInstruction: 'Keep both sticks untouched for 3 seconds.',
      testingButton: 'Testing…',
      mappingLimitation: 'Stick Drift requires the browser standard gamepad mapping. This controller is not measured because physical stick axes would otherwise be guessed.',
      mappingInstruction: 'Select a standard-mapped controller to run the stick drift test.',
      mappingSummary: 'Stick Drift is unavailable for the selected controller because it does not expose a complete standard gamepad mapping.',
      cancelledInstruction: 'Release both sticks and start again when the controller is ready.',
      noSamples: 'No usable stick samples were captured. Start the test again.',
      noSamplesInstruction: 'No usable stick samples were captured. Start again.',
      noSamplesSummary: 'Stick drift test cancelled because no usable samples were captured.',
      resultInstruction: 'Observed center offset is shown for each stick.',
      accessLost: 'Gamepad access became unavailable during the sample.',
      disconnected: 'The controller disconnected during the sample.',
      selectedDisconnected: 'The selected controller disconnected during the sample.',
      mappingLost: 'The selected controller can no longer provide standard stick axes.',
      pageHidden: 'The page became hidden during the sample.',
      stopped: 'The measurement was stopped before the sample completed.',
    },
    deadzone: {
      sampleLabel: '3-second sample',
      sampleComplete: '3-second sample complete',
      centerDetailScale: 'Center detail · 20% radius',
      leftChoice: 'Left',
      rightChoice: 'Right',
      readyInstructionLeft: 'Release the left stick and keep it untouched.',
      readyInstructionRight: 'Release the right stick and keep it untouched.',
      samplingInstructionLeft: 'Keep the left stick untouched for 3 seconds.',
      samplingInstructionRight: 'Keep the right stick untouched for 3 seconds.',
      testingButton: 'Testing…',
      mappingLimitation: 'Deadzone measurement requires the browser standard gamepad mapping. This controller is not measured because physical stick axes would otherwise be guessed.',
      mappingInstruction: 'Select a standard-mapped controller to measure center noise.',
      mappingSummary: 'Controller Deadzone Test is unavailable for the selected controller because it does not expose a complete standard gamepad mapping.',
      cancelledInstructionLeft: 'Release the left stick and start again when the controller is ready.',
      cancelledInstructionRight: 'Release the right stick and start again when the controller is ready.',
      noSamples: 'No usable stick samples were captured. Start the test again.',
      noSamplesInstruction: 'No usable stick samples were captured. Start again.',
      noSamplesSummary: 'Controller deadzone test cancelled because no usable samples were captured.',
      resultInstruction: 'Observed center noise and a heuristic starting deadzone are shown.',
      accessLost: 'Gamepad access became unavailable during the sample.',
      disconnected: 'The controller disconnected during the sample.',
      selectedDisconnected: 'The selected controller disconnected during the sample.',
      mappingLost: 'The selected controller can no longer provide standard stick axes.',
      pageHidden: 'The page became hidden during the sample.',
      stopped: 'The measurement was stopped before the sample completed.',
    },
  },
  'pt-BR': {
    stickDrift: {
      sampleLabel: 'Amostra de 3 segundos',
      sampleComplete: 'Amostra de 3 segundos concluída',
      plotScale: 'raio de 20%',
      readyInstruction: 'Solte os dois analógicos e mantenha-os sem toque.',
      samplingInstruction: 'Mantenha os dois analógicos sem toque por 3 segundos.',
      testingButton: 'Testando…',
      mappingLimitation: 'O teste de drift exige o mapeamento padrão de gamepad do navegador. Este controle não é medido porque, caso contrário, seria necessário presumir os eixos físicos dos analógicos.',
      mappingInstruction: 'Selecione um controle com mapeamento padrão para executar o teste de drift.',
      mappingSummary: 'O teste de drift está indisponível para o controle selecionado porque ele não expõe um mapeamento padrão de gamepad completo.',
      cancelledInstruction: 'Solte os dois analógicos e inicie novamente quando o controle estiver pronto.',
      noSamples: 'Nenhuma amostra utilizável dos analógicos foi capturada. Inicie o teste novamente.',
      noSamplesInstruction: 'Nenhuma amostra utilizável dos analógicos foi capturada. Inicie novamente.',
      noSamplesSummary: 'O teste de drift foi cancelado porque nenhuma amostra utilizável foi capturada.',
      resultInstruction: 'O desvio de centro observado é mostrado para cada analógico.',
      accessLost: 'O acesso ao gamepad ficou indisponível durante a amostra.',
      disconnected: 'O controle foi desconectado durante a amostra.',
      selectedDisconnected: 'O controle selecionado foi desconectado durante a amostra.',
      mappingLost: 'O controle selecionado não consegue mais fornecer eixos de analógico com mapeamento padrão.',
      pageHidden: 'A página ficou oculta durante a amostra.',
      stopped: 'A medição foi interrompida antes de a amostra ser concluída.',
    },
    deadzone: {
      sampleLabel: 'Amostra de 3 segundos',
      sampleComplete: 'Amostra de 3 segundos concluída',
      centerDetailScale: 'Detalhe do centro · raio de 20%',
      leftChoice: 'Esquerdo',
      rightChoice: 'Direito',
      readyInstructionLeft: 'Solte o analógico esquerdo e mantenha-o sem toque.',
      readyInstructionRight: 'Solte o analógico direito e mantenha-o sem toque.',
      samplingInstructionLeft: 'Mantenha o analógico esquerdo sem toque por 3 segundos.',
      samplingInstructionRight: 'Mantenha o analógico direito sem toque por 3 segundos.',
      testingButton: 'Testando…',
      mappingLimitation: 'A medição de deadzone exige o mapeamento padrão de gamepad do navegador. Este controle não é medido porque, caso contrário, seria necessário presumir os eixos físicos dos analógicos.',
      mappingInstruction: 'Selecione um controle com mapeamento padrão para medir o ruído no centro.',
      mappingSummary: 'O Teste de Deadzone do Controle está indisponível para o controle selecionado porque ele não expõe um mapeamento padrão de gamepad completo.',
      cancelledInstructionLeft: 'Solte o analógico esquerdo e inicie novamente quando o controle estiver pronto.',
      cancelledInstructionRight: 'Solte o analógico direito e inicie novamente quando o controle estiver pronto.',
      noSamples: 'Nenhuma amostra utilizável do analógico foi capturada. Inicie o teste novamente.',
      noSamplesInstruction: 'Nenhuma amostra utilizável do analógico foi capturada. Inicie novamente.',
      noSamplesSummary: 'O teste de deadzone foi cancelado porque nenhuma amostra utilizável foi capturada.',
      resultInstruction: 'São mostrados o ruído de centro observado e uma deadzone inicial heurística.',
      accessLost: 'O acesso ao gamepad ficou indisponível durante a amostra.',
      disconnected: 'O controle foi desconectado durante a amostra.',
      selectedDisconnected: 'O controle selecionado foi desconectado durante a amostra.',
      mappingLost: 'O controle selecionado não consegue mais fornecer eixos de analógico com mapeamento padrão.',
      pageHidden: 'A página ficou oculta durante a amostra.',
      stopped: 'A medição foi interrompida antes de a amostra ser concluída.',
    },
  },
  de: {
    stickDrift: {
      sampleLabel: '3-Sekunden-Messung',
      sampleComplete: '3-Sekunden-Messung abgeschlossen',
      plotScale: '20 % Radius',
      readyInstruction: 'Lassen Sie beide Sticks los und berühren Sie sie nicht.',
      samplingInstruction: 'Lassen Sie beide Sticks 3 Sekunden lang unberührt.',
      testingButton: 'Test läuft…',
      mappingLimitation: 'Stick Drift erfordert das Standard-Gamepad-Mapping des Browsers. Dieser Controller wird nicht gemessen, weil sonst die physischen Stick-Achsen geraten werden müssten.',
      mappingInstruction: 'Wählen Sie einen Controller mit Standard-Mapping für den Stick-Drift-Test.',
      mappingSummary: 'Stick Drift ist für den ausgewählten Controller nicht verfügbar, weil er kein vollständiges Standard-Gamepad-Mapping bereitstellt.',
      cancelledInstruction: 'Lassen Sie beide Sticks los und starten Sie erneut, wenn der Controller bereit ist.',
      noSamples: 'Keine nutzbaren Stick-Samples erfasst. Starten Sie den Test erneut.',
      noSamplesInstruction: 'Keine nutzbaren Stick-Samples erfasst. Starten Sie erneut.',
      noSamplesSummary: 'Der Stick-Drift-Test wurde abgebrochen, weil keine nutzbaren Samples erfasst wurden.',
      resultInstruction: 'Der beobachtete Mittelpunktversatz wird für jeden Stick angezeigt.',
      accessLost: 'Der Gamepad-Zugriff war während der Messung nicht mehr verfügbar.',
      disconnected: 'Der Controller wurde während der Messung getrennt.',
      selectedDisconnected: 'Der ausgewählte Controller wurde während der Messung getrennt.',
      mappingLost: 'Der ausgewählte Controller kann keine standardgemappten Stick-Achsen mehr bereitstellen.',
      pageHidden: 'Die Seite wurde während der Messung ausgeblendet.',
      stopped: 'Die Messung wurde vor ihrem Abschluss gestoppt.',
    },
    deadzone: {
      sampleLabel: '3-Sekunden-Messung',
      sampleComplete: '3-Sekunden-Messung abgeschlossen',
      centerDetailScale: 'Mittelpunkt-Detail · 20 % Radius',
      leftChoice: 'Links',
      rightChoice: 'Rechts',
      readyInstructionLeft: 'Lassen Sie den linken Stick los und berühren Sie ihn nicht.',
      readyInstructionRight: 'Lassen Sie den rechten Stick los und berühren Sie ihn nicht.',
      samplingInstructionLeft: 'Lassen Sie den linken Stick 3 Sekunden lang unberührt.',
      samplingInstructionRight: 'Lassen Sie den rechten Stick 3 Sekunden lang unberührt.',
      testingButton: 'Test läuft…',
      mappingLimitation: 'Die Deadzone-Messung erfordert das Standard-Gamepad-Mapping des Browsers. Dieser Controller wird nicht gemessen, weil sonst die physischen Stick-Achsen geraten werden müssten.',
      mappingInstruction: 'Wählen Sie einen Controller mit Standard-Mapping, um das Mittelpunkt-Rauschen zu messen.',
      mappingSummary: 'Der Controller-Deadzone-Test ist für den ausgewählten Controller nicht verfügbar, weil er kein vollständiges Standard-Gamepad-Mapping bereitstellt.',
      cancelledInstructionLeft: 'Lassen Sie den linken Stick los und starten Sie erneut, wenn der Controller bereit ist.',
      cancelledInstructionRight: 'Lassen Sie den rechten Stick los und starten Sie erneut, wenn der Controller bereit ist.',
      noSamples: 'Keine nutzbaren Stick-Samples erfasst. Starten Sie den Test erneut.',
      noSamplesInstruction: 'Keine nutzbaren Stick-Samples erfasst. Starten Sie erneut.',
      noSamplesSummary: 'Der Controller-Deadzone-Test wurde abgebrochen, weil keine nutzbaren Samples erfasst wurden.',
      resultInstruction: 'Das beobachtete Mittelpunkt-Rauschen und eine heuristische Start-Deadzone werden angezeigt.',
      accessLost: 'Der Gamepad-Zugriff war während der Messung nicht mehr verfügbar.',
      disconnected: 'Der Controller wurde während der Messung getrennt.',
      selectedDisconnected: 'Der ausgewählte Controller wurde während der Messung getrennt.',
      mappingLost: 'Der ausgewählte Controller kann keine standardgemappten Stick-Achsen mehr bereitstellen.',
      pageHidden: 'Die Seite wurde während der Messung ausgeblendet.',
      stopped: 'Die Messung wurde vor ihrem Abschluss gestoppt.',
    },
  },
  fr: {
    stickDrift: {
      sampleLabel: 'Échantillon de 3 secondes',
      sampleComplete: 'Échantillon de 3 secondes terminé',
      plotScale: 'rayon de 20 %',
      readyInstruction: 'Relâchez les deux sticks et ne les touchez plus.',
      samplingInstruction: 'Laissez les deux sticks au repos pendant 3 secondes.',
      testingButton: 'Test en cours…',
      mappingLimitation: 'Le test de Stick Drift nécessite le mapping gamepad standard du navigateur. Cette manette n’est pas mesurée car il faudrait sinon deviner les axes physiques des sticks.',
      mappingInstruction: 'Sélectionnez une manette avec mapping standard pour lancer le test de Stick Drift.',
      mappingSummary: 'Le test de Stick Drift est indisponible pour la manette sélectionnée car elle n’expose pas un mapping gamepad standard complet.',
      cancelledInstruction: 'Relâchez les deux sticks et recommencez lorsque la manette est prête.',
      noSamples: 'Aucun échantillon de stick exploitable n’a été capturé. Relancez le test.',
      noSamplesInstruction: 'Aucun échantillon de stick exploitable n’a été capturé. Recommencez.',
      noSamplesSummary: 'Le test de Stick Drift a été annulé car aucun échantillon exploitable n’a été capturé.',
      resultInstruction: 'Le décalage de centre observé est affiché pour chaque stick.',
      accessLost: 'L’accès à la manette est devenu indisponible pendant l’échantillon.',
      disconnected: 'La manette s’est déconnectée pendant l’échantillon.',
      selectedDisconnected: 'La manette sélectionnée s’est déconnectée pendant l’échantillon.',
      mappingLost: 'La manette sélectionnée ne peut plus fournir les axes standard des sticks.',
      pageHidden: 'La page a été masquée pendant l’échantillon.',
      stopped: 'La mesure a été arrêtée avant la fin de l’échantillon.',
    },
    deadzone: {
      sampleLabel: 'Échantillon de 3 secondes',
      sampleComplete: 'Échantillon de 3 secondes terminé',
      centerDetailScale: 'Détail du centre · rayon de 20 %',
      leftChoice: 'Gauche',
      rightChoice: 'Droit',
      readyInstructionLeft: 'Relâchez le stick gauche et ne le touchez plus.',
      readyInstructionRight: 'Relâchez le stick droit et ne le touchez plus.',
      samplingInstructionLeft: 'Laissez le stick gauche au repos pendant 3 secondes.',
      samplingInstructionRight: 'Laissez le stick droit au repos pendant 3 secondes.',
      testingButton: 'Test en cours…',
      mappingLimitation: 'La mesure de Deadzone nécessite le mapping gamepad standard du navigateur. Cette manette n’est pas mesurée car il faudrait sinon deviner les axes physiques des sticks.',
      mappingInstruction: 'Sélectionnez une manette avec mapping standard pour mesurer le bruit au centre.',
      mappingSummary: 'Le test de Deadzone est indisponible pour la manette sélectionnée car elle n’expose pas un mapping gamepad standard complet.',
      cancelledInstructionLeft: 'Relâchez le stick gauche et recommencez lorsque la manette est prête.',
      cancelledInstructionRight: 'Relâchez le stick droit et recommencez lorsque la manette est prête.',
      noSamples: 'Aucun échantillon de stick exploitable n’a été capturé. Relancez le test.',
      noSamplesInstruction: 'Aucun échantillon de stick exploitable n’a été capturé. Recommencez.',
      noSamplesSummary: 'Le test de Deadzone a été annulé car aucun échantillon exploitable n’a été capturé.',
      resultInstruction: 'Le bruit de centre observé et une deadzone initiale heuristique sont affichés.',
      accessLost: 'L’accès à la manette est devenu indisponible pendant l’échantillon.',
      disconnected: 'La manette s’est déconnectée pendant l’échantillon.',
      selectedDisconnected: 'La manette sélectionnée s’est déconnectée pendant l’échantillon.',
      mappingLost: 'La manette sélectionnée ne peut plus fournir les axes standard des sticks.',
      pageHidden: 'La page a été masquée pendant l’échantillon.',
      stopped: 'La mesure a été arrêtée avant la fin de l’échantillon.',
    },
  },
} as const satisfies Record<ImplementedContentLocale, ControllerFlowMessages>;

export const getControllerFlowMessages = (
  locale: ImplementedContentLocale,
): ControllerFlowMessages => controllerFlowMessagesByLocale[locale];