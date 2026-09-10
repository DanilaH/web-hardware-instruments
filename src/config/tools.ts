import { getToolDefinitionsByChannel, toolDefinitions, type ToolDefinition } from './tool-definitions';
import type { ToolChannel, ToolIconKind } from './tool-types';

export const implementedGroupDefinitions = [
  { id: 'controller', icon: 'gamepad' },
  { id: 'mouse', icon: 'mouse' },
  { id: 'keyboard', icon: 'keyboard' },
  { id: 'display', icon: 'refresh' },
  { id: 'touch', icon: 'touch' },
] as const satisfies readonly { readonly id: ToolChannel; readonly icon: ToolIconKind }[];

export type ImplementedToolChannel = (typeof implementedGroupDefinitions)[number]['id'];

export interface ToolGroup {
  readonly id: ImplementedToolChannel;
  readonly icon: ToolIconKind;
  readonly tools: readonly ToolDefinition[];
}

export const toolGroups: readonly ToolGroup[] = implementedGroupDefinitions.map((group) => ({
  ...group,
  tools: getToolDefinitionsByChannel(group.id),
}));

export const allTools: readonly ToolDefinition[] = toolDefinitions;

export const getToolByPath = (path: string): ToolDefinition | undefined =>
  allTools.find((tool) => tool.href === path);

export const getToolsByChannel = (channel: ToolChannel): readonly ToolDefinition[] =>
  getToolDefinitionsByChannel(channel);

export type { ToolChannel, ToolIconKind } from './tool-types';
