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
} as const satisfies Record<ImplementedContentLocale, ControllerFlowMessages>;

export const getControllerFlowMessages = (
  locale: ImplementedContentLocale,
): ControllerFlowMessages => controllerFlowMessagesByLocale[locale];
