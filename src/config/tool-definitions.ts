import type { ToolChannel, ToolIconKind } from './tools';

export const toolIds = [
  'gamepad-tester',
  'controller-stick-drift-test',
  'controller-deadzone-test',
  'mouse-tester',
  'mouse-button-test',
  'mouse-scroll-test',
  'double-click-test',
  'mouse-polling-rate-test',
  'mouse-dpi-test',
  'keyboard-tester',
  'keyboard-rollover-test',
  'keyboard-ghosting-test',
  'fps-test',
  'refresh-rate-test',
  'frame-skipping-test',
  'dead-pixel-test',
  'backlight-bleed-test',
  'touch-screen-test',
] as const;

export type ToolId = (typeof toolIds)[number];

export interface ToolDefinition {
  readonly id: ToolId;
  readonly href: `/${ToolId}`;
  readonly icon: ToolIconKind;
  readonly channel: ToolChannel;
}

export const toolDefinitions: readonly ToolDefinition[] = [
  { id: 'gamepad-tester', href: '/gamepad-tester', icon: 'gamepad', channel: 'controller' },
  { id: 'controller-stick-drift-test', href: '/controller-stick-drift-test', icon: 'drift', channel: 'controller' },
  { id: 'controller-deadzone-test', href: '/controller-deadzone-test', icon: 'deadzone', channel: 'controller' },
  { id: 'mouse-tester', href: '/mouse-tester', icon: 'mouse', channel: 'mouse' },
  { id: 'mouse-button-test', href: '/mouse-button-test', icon: 'button', channel: 'mouse' },
  { id: 'mouse-scroll-test', href: '/mouse-scroll-test', icon: 'scroll', channel: 'mouse' },
  { id: 'double-click-test', href: '/double-click-test', icon: 'double-click', channel: 'mouse' },
  { id: 'mouse-polling-rate-test', href: '/mouse-polling-rate-test', icon: 'polling', channel: 'mouse' },
  { id: 'mouse-dpi-test', href: '/mouse-dpi-test', icon: 'dpi', channel: 'mouse' },
  { id: 'keyboard-tester', href: '/keyboard-tester', icon: 'keyboard', channel: 'keyboard' },
  { id: 'keyboard-rollover-test', href: '/keyboard-rollover-test', icon: 'rollover', channel: 'keyboard' },
  { id: 'keyboard-ghosting-test', href: '/keyboard-ghosting-test', icon: 'ghosting', channel: 'keyboard' },
  { id: 'fps-test', href: '/fps-test', icon: 'fps', channel: 'display' },
  { id: 'refresh-rate-test', href: '/refresh-rate-test', icon: 'refresh', channel: 'display' },
  { id: 'frame-skipping-test', href: '/frame-skipping-test', icon: 'frame-skip', channel: 'display' },
  { id: 'dead-pixel-test', href: '/dead-pixel-test', icon: 'dead-pixel', channel: 'display' },
  { id: 'backlight-bleed-test', href: '/backlight-bleed-test', icon: 'backlight', channel: 'display' },
  { id: 'touch-screen-test', href: '/touch-screen-test', icon: 'touch', channel: 'touch' },
];

const toolById = new Map(toolDefinitions.map((tool) => [tool.id, tool] as const));
const toolByPath = new Map(toolDefinitions.map((tool) => [tool.href, tool] as const));

export const isToolId = (value: string): value is ToolId =>
  (toolIds as readonly string[]).includes(value);

export const getToolDefinition = (id: ToolId): ToolDefinition => {
  const tool = toolById.get(id);
  if (!tool) throw new Error(`Unknown tool id: ${id}`);
  return tool;
};

export const getToolDefinitionBySemanticPath = (path: string): ToolDefinition | undefined =>
  toolByPath.get(path as `/${ToolId}`);

export const getToolIdBySemanticPath = (path: string): ToolId | null =>
  getToolDefinitionBySemanticPath(path)?.id ?? null;

export const getToolDefinitionsByChannel = (channel: ToolChannel): readonly ToolDefinition[] =>
  toolDefinitions.filter((tool) => tool.channel === channel);

const touchRelatedIds: readonly ToolId[] = ['mouse-tester', 'keyboard-tester', 'dead-pixel-test'];

export const getRelatedToolDefinitions = (id: ToolId): readonly ToolDefinition[] => {
  const current = getToolDefinition(id);
  const siblings = getToolDefinitionsByChannel(current.channel).filter((tool) => tool.id !== id);
  if (siblings.length > 0) return siblings;
  return touchRelatedIds.map(getToolDefinition);
};
