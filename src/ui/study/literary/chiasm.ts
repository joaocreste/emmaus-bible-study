import type { LiteraryFeature } from '../../../domain/models';

export type StructureLine = NonNullable<LiteraryFeature['structure']>[number];

/**
 * A node of a nested structure. For a chiasm, `open` is the first member of a
 * pair (A) and `close` its mirror (A′); `children` are the inner members.
 */
export interface StructureNode {
  open: StructureLine;
  close?: StructureLine;
  children: StructureNode[];
  depth: number;
}

/**
 * True when the levels rise and fall symmetrically (0,1,2,1,0 or 0,1,2,2,1,0) —
 * the shape of a chiasm or inclusio, whatever the feature is called.
 */
export function isChiastic(lines: StructureLine[]): boolean {
  if (lines.length < 3) return false;
  const levels = lines.map((l) => l.level);
  for (let i = 0, j = levels.length - 1; i < j; i++, j--) if (levels[i] !== levels[j]) return false;
  const peak = Math.max(...levels);
  if (peak === levels[0]) return false;
  // must climb one step at a time to the centre
  const half = levels.slice(0, Math.ceil(levels.length / 2));
  return half.every((lv, i) => i === 0 || lv === half[i - 1] + 1 || lv === half[i - 1]);
}

/** Do any labels carry a prime (B′, B')? That marks the mirrored half of a chiasm. */
export function hasMirroredLabels(lines: StructureLine[]): boolean {
  return lines.some((l) => /[′'’]$/.test(l.label.trim()));
}

/**
 * Should a feature's structure be drawn as a chiasm ladder? Mirrored levels are
 * required; for types other than chiasm/inclusio the labels must also be primed,
 * so an ordinary outline with levels 0,1,1,0 is not mistaken for a chiasm.
 */
export function drawAsChiasm(type: LiteraryFeature['type'], lines: StructureLine[]): boolean {
  if (!isChiastic(lines)) return false;
  return type === 'chiasm' || type === 'inclusio' || hasMirroredLabels(lines);
}

/**
 * Pair mirrored lines into a tree: A [B [C] B′] A′. A line closes the most recent
 * open node at the same level; deeper open nodes are closed implicitly.
 */
export function buildChiasmTree(lines: StructureLine[]): StructureNode[] {
  const roots: StructureNode[] = [];
  const stack: StructureNode[] = [];
  for (const line of lines) {
    while (stack.length && stack[stack.length - 1].open.level > line.level) stack.pop();
    const top = stack[stack.length - 1];
    if (top && top.open.level === line.level && !top.close) {
      top.close = line;
      stack.pop();
      continue;
    }
    const node: StructureNode = { open: line, children: [], depth: stack.length };
    (top ? top.children : roots).push(node);
    stack.push(node);
  }
  return roots;
}

/**
 * Nest an ordinary outline by level: each line becomes a child of the nearest
 * preceding line with a lower level.
 */
export function buildOutlineTree(lines: StructureLine[]): StructureNode[] {
  const roots: StructureNode[] = [];
  const stack: StructureNode[] = [];
  for (const line of lines) {
    while (stack.length && stack[stack.length - 1].open.level >= line.level) stack.pop();
    const parent = stack[stack.length - 1];
    const node: StructureNode = { open: line, children: [], depth: stack.length };
    (parent ? parent.children : roots).push(node);
    stack.push(node);
  }
  return roots;
}

/** Deepest depth in a tree (0 for a flat list). */
export function treeDepth(nodes: StructureNode[]): number {
  let max = 0;
  const walk = (ns: StructureNode[]) => {
    for (const n of ns) {
      max = Math.max(max, n.depth);
      walk(n.children);
    }
  };
  walk(nodes);
  return max;
}

/** Fallback label for a line without one: A, B, C… with a prime for the mirrored member. */
export function chiasmLabel(line: StructureLine, mirrored: boolean): string {
  if (line.label.trim()) return line.label.trim();
  const letter = String.fromCharCode(65 + Math.max(0, Math.min(line.level, 25)));
  return mirrored ? `${letter}′` : letter;
}
