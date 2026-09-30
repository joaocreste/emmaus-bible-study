import type { TopicPassage } from '../../../domain/models';

export interface KeyPassageGroup {
  name: string;
  items: TopicPassage[];
}

/**
 * Group key passages by their curated `group`, in order of first appearance.
 * Pinned passages (prioritised by the conversation) are returned separately so the
 * section can float them to the top; they are removed from their groups.
 */
export function groupKeyPassages(
  passages: TopicPassage[],
  pinnedIds: ReadonlySet<string> = new Set(),
  /** name of the group for passages without one, in the reader's language */
  defaultGroup = 'Key passages',
): { pinned: TopicPassage[]; groups: KeyPassageGroup[] } {
  const pinned: TopicPassage[] = [];
  const groups: KeyPassageGroup[] = [];
  const byName = new Map<string, KeyPassageGroup>();
  for (const p of passages) {
    if (pinnedIds.has(p.id)) {
      pinned.push(p);
      continue;
    }
    const name = p.group.trim() || defaultGroup;
    let g = byName.get(name);
    if (!g) {
      g = { name, items: [] };
      byName.set(name, g);
      groups.push(g);
    }
    g.items.push(p);
  }
  return { pinned, groups };
}
