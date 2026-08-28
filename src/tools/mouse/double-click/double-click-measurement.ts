import type { MouseSemanticButton } from '../../../browser/mouse-input-service';

export const rapidRepeatThresholdMs = 50;
export interface DoubleClickState {
  readonly previousByButton: readonly [number | null, number | null, number | null, number | null, number | null];
  readonly totalPresses: number;
  readonly rapidRepeatEvents: number;
  readonly shortestGapMs: number | null;
  readonly lastGapMs: number | null;
}
const emptyPrevious=():[number|null,number|null,number|null,number|null,number|null]=>[null,null,null,null,null];
export const createDoubleClickState=():DoubleClickState=>({previousByButton:emptyPrevious(),totalPresses:0,rapidRepeatEvents:0,shortestGapMs:null,lastGapMs:null});
export const observeButtonPress=(state:DoubleClickState,button:MouseSemanticButton,timestamp:number):DoubleClickState=>{
  if(!Number.isFinite(timestamp)) return state;
  const previous=state.previousByButton[button]; const previousByButton=[...state.previousByButton] as [number|null,number|null,number|null,number|null,number|null]; previousByButton[button]=timestamp;
  if(previous===null) return {...state,previousByButton,totalPresses:state.totalPresses+1};
  const gap=timestamp-previous;
  if(!Number.isFinite(gap)||gap<=0) return {...state,previousByButton,totalPresses:state.totalPresses+1};
  return { previousByButton,totalPresses:state.totalPresses+1,rapidRepeatEvents:state.rapidRepeatEvents+(gap<=rapidRepeatThresholdMs?1:0),shortestGapMs:state.shortestGapMs===null?gap:Math.min(state.shortestGapMs,gap),lastGapMs:gap };
};
