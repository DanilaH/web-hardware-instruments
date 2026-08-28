import { createMouseInputService, isMouseSemanticButton } from '../../../browser/mouse-input-service';
import { renderStandardMouseVisual } from '../../../visuals/mouse/standard-mouse-renderer';
import { createMouseButtonState, reduceMouseButtonState } from './mouse-button-state';

export interface MouseButtonController { start(): void; stop(): void; destroy(): void }
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => { const element = root.querySelector<T>(selector); if (!element) throw new Error(`Mouse Button Test is missing ${selector}`); return element; };
const buttonNames = ['Primary', 'Middle', 'Secondary', 'Back', 'Forward'] as const;

export const mountMouseButtonTest = (root: HTMLElement): MouseButtonController => {
  const surface = requireElement<HTMLElement>(root, '[data-mouse-button-surface]');
  const visual = requireElement<HTMLElement>(root, '[data-standard-mouse-visual]');
  const status = requireElement<HTMLElement>(root, '[data-mouse-button-status]');
  const reset = requireElement<HTMLButtonElement>(root, '[data-mouse-button-reset]');
  const summary = requireElement<HTMLElement>(root, '[data-mouse-button-summary]');
  const rows = [...root.querySelectorAll<HTMLElement>('[data-mouse-button-row]')];
  const service = createMouseInputService(surface, 'basic');
  let state = createMouseButtonState(); let destroyed = false; let available = true;

  const render = (): void => {
    renderStandardMouseVisual(visual, { heldButtons: [0,1,2,3,4].map((button)=>state.heldButtons.has(button as 0|1|2|3|4)) as [boolean,boolean,boolean,boolean,boolean], wheelDirection: null, movementDetected: false });
    rows.forEach((row) => { const raw=row.dataset.mouseButtonRow; const button=raw===undefined?Number.NaN:Number(raw); if(!isMouseSemanticButton(button))return; row.dataset.held=state.heldButtons.has(button)?'true':'false'; const count=row.querySelector<HTMLElement>('[data-button-count]'); const detected=row.querySelector<HTMLElement>('[data-button-detected]'); if(count)count.textContent=state.pressCounts[button].toString(); if(detected)detected.textContent=state.detectedButtons.has(button)?'Detected':'Not yet detected'; });
    status.textContent = !available ? 'Mouse input unavailable' : state.detectedButtons.size > 0 ? `${state.detectedButtons.size} button roles detected` : 'Listening for button input';
  };

  const unsubscribe=service.subscribe((event)=>{if(destroyed||event.type==='poll-samples')return;state=reduceMouseButtonState(state,event);render();if(event.type==='buttondown')summary.textContent=`${buttonNames[event.button]} button detected. ${state.pressCounts[event.button]} presses observed.`;});
  const handleReset=():void=>{state=createMouseButtonState();summary.textContent='Mouse Button Test is listening.';render();};
  reset.addEventListener('click',handleReset); available=service.start(); render();
  return { start:()=>{if(!destroyed){available=service.start();render();}}, stop:()=>{if(!destroyed){service.stop();state=reduceMouseButtonState(state,{type:'clear',reason:'blur'});render();}}, destroy:()=>{if(!destroyed){destroyed=true;reset.removeEventListener('click',handleReset);unsubscribe();service.destroy();}} };
};
