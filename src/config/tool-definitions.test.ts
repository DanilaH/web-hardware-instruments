import { describe, expect, it } from 'vitest';

import {
  getRelatedToolDefinitions,
  toolDefinitions,
  toolIds,
} from './tool-definitions';
import { toolGroups } from './tools';

describe('tool registry', () => {
  it('defines every ToolId exactly once with its semantic href', () => {
    expect(toolDefinitions).toHaveLength(toolIds.length);

    const ids = toolDefinitions.map((tool) => tool.id);
    const hrefs = toolDefinitions.map((tool) => tool.href);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(new Set(ids)).toEqual(new Set(toolIds));

    for (const tool of toolDefinitions) {
      expect(tool.href).toBe(`/${tool.id}`);
    }
  });

  it('keeps related-tool sets explicit, unique, self-free, and capped at three', () => {
    for (const id of toolIds) {
      const related = getRelatedToolDefinitions(id);
      const relatedIds = related.map((tool) => tool.id);

      expect(related.length).toBeLessThanOrEqual(3);
      expect(new Set(relatedIds).size).toBe(relatedIds.length);
      expect(relatedIds).not.toContain(id);
    }
  });

  it('exposes only non-empty implemented groups and covers every registered tool once', () => {
    const groupedIds = toolGroups.flatMap((group) => {
      expect(group.tools.length).toBeGreaterThan(0);
      expect(group.tools.every((tool) => tool.channel === group.id)).toBe(true);
      return group.tools.map((tool) => tool.id);
    });

    expect(groupedIds).toHaveLength(toolIds.length);
    expect(new Set(groupedIds).size).toBe(groupedIds.length);
    expect(new Set(groupedIds)).toEqual(new Set(toolIds));
  });
});
