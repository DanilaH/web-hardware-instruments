export type ToolChannel = 'controller' | 'mouse' | 'keyboard' | 'display' | 'touch';

export type ToolIconKind =
  | 'gamepad' | 'drift' | 'deadzone'
  | 'mouse' | 'button' | 'scroll' | 'double-click' | 'polling' | 'dpi'
  | 'keyboard' | 'rollover' | 'ghosting'
  | 'fps' | 'refresh' | 'frame-skip' | 'dead-pixel' | 'backlight'
  | 'touch';

export interface HardwareTool {
  href: string;
  icon: ToolIconKind;
  name: string;
  description: string;
  channel: ToolChannel;
}

export interface ToolGroup {
  id: ToolChannel;
  name: string;
  icon: ToolIconKind;
  channel: ToolChannel;
  tools: readonly HardwareTool[];
}

const controllerTools: readonly HardwareTool[] = [
  { href: '/gamepad-tester', icon: 'gamepad', name: 'Gamepad Tester', description: 'Test controller buttons, sticks, D-pad, and triggers.', channel: 'controller' },
  { href: '/controller-stick-drift-test', icon: 'drift', name: 'Controller Stick Drift Test', description: 'Measure observed analog-stick center offset while untouched.', channel: 'controller' },
  { href: '/controller-deadzone-test', icon: 'deadzone', name: 'Controller Deadzone Test', description: 'Measure stick center noise and a heuristic starting deadzone.', channel: 'controller' },
];

const mouseTools: readonly HardwareTool[] = [
  { href: '/mouse-tester', icon: 'mouse', name: 'Mouse Tester', description: 'Quickly check browser-detected mouse buttons, wheel input, and movement.', channel: 'mouse' },
  { href: '/mouse-button-test', icon: 'button', name: 'Mouse Button Test', description: 'Check primary, middle, secondary, Back/X1, and Forward/X2 button input.', channel: 'mouse' },
  { href: '/mouse-scroll-test', icon: 'scroll', name: 'Mouse Scroll Test', description: 'Inspect browser-detected up, down, left, and right wheel events.', channel: 'mouse' },
  { href: '/double-click-test', icon: 'double-click', name: 'Double Click Test', description: 'Look for unusually fast repeated same-button presses.', channel: 'mouse' },
  { href: '/mouse-polling-rate-test', icon: 'polling', name: 'Mouse Polling Rate Test', description: 'Measure the pointer sample rate observed by this browser.', channel: 'mouse' },
  { href: '/mouse-dpi-test', icon: 'dpi', name: 'Mouse DPI Test', description: 'Estimate mouse DPI from net browser movement over a measured physical distance.', channel: 'mouse' },
];

const keyboardTools: readonly HardwareTool[] = [
  { href: '/keyboard-tester', icon: 'keyboard', name: 'Keyboard Tester', description: 'Press keys and see which physical key codes the browser detects.', channel: 'keyboard' },
  { href: '/keyboard-rollover-test', icon: 'rollover', name: 'Keyboard Rollover Test', description: 'See the largest simultaneous key set this browser detects.', channel: 'keyboard' },
  { href: '/keyboard-ghosting-test', icon: 'ghosting', name: 'Keyboard Ghosting Test', description: 'Compare guided key combinations with the keys detected together.', channel: 'keyboard' },
];

const displayTools: readonly HardwareTool[] = [
  { href: '/fps-test', icon: 'fps', name: 'FPS Test', description: 'Observe this browser page’s frame delivery and recent sampled FPS range.', channel: 'display' },
  { href: '/refresh-rate-test', icon: 'refresh', name: 'Refresh Rate Test', description: 'Estimate the display cadence currently visible to the browser.', channel: 'display' },
  { href: '/frame-skipping-test', icon: 'frame-skip', name: 'Frame Skipping Test', description: 'Use a camera-assisted pattern to look for repeatable skipped-refresh gaps.', channel: 'display' },
  { href: '/dead-pixel-test', icon: 'dead-pixel', name: 'Dead Pixel Test', description: 'Inspect the screen against solid colors for dead or stuck pixels.', channel: 'display' },
  { href: '/backlight-bleed-test', icon: 'backlight', name: 'Backlight Bleed Test', description: 'Inspect a backlit display for bright leakage on a black screen.', channel: 'display' },
];

const touchTools: readonly HardwareTool[] = [
  { href: '/touch-screen-test', icon: 'touch', name: 'Touch Screen Test', description: 'Map browser-detected finger coverage, multi-touch, and unexpected touch input.', channel: 'touch' },
];

export const toolGroups = [
  { id: 'controller', name: 'Controller', icon: 'gamepad', channel: 'controller', tools: controllerTools },
  { id: 'mouse', name: 'Mouse', icon: 'mouse', channel: 'mouse', tools: mouseTools },
  { id: 'keyboard', name: 'Keyboard', icon: 'keyboard', channel: 'keyboard', tools: keyboardTools },
  { id: 'display', name: 'Display', icon: 'refresh', channel: 'display', tools: displayTools },
  { id: 'touch', name: 'Touch', icon: 'touch', channel: 'touch', tools: touchTools },
] as const satisfies readonly ToolGroup[];

export const allTools: readonly HardwareTool[] = toolGroups.flatMap((group) => group.tools);

export const getToolByPath = (path: string): HardwareTool | undefined =>
  allTools.find((tool) => tool.href === path);

export const getToolsByChannel = (channel: ToolChannel): readonly HardwareTool[] =>
  allTools.filter((tool) => tool.channel === channel);

const touchRelatedPaths = ['/mouse-tester', '/keyboard-tester', '/dead-pixel-test'] as const;

export const getRelatedTools = (path: string): readonly HardwareTool[] => {
  const current = getToolByPath(path);
  if (!current) {
    return [];
  }

  const siblings = getToolsByChannel(current.channel).filter((tool) => tool.href !== current.href);
  if (siblings.length > 0) {
    return siblings;
  }

  return touchRelatedPaths
    .map((relatedPath) => getToolByPath(relatedPath))
    .filter((tool): tool is HardwareTool => tool !== undefined);
};
