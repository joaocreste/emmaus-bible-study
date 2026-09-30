import { useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { RefChip } from '../../common/RefChip';
import { ScriptText } from '../../common/ScriptText';
import styles from './ChiasmDiagram.module.css';
import { buildChiasmTree, buildOutlineTree, chiasmLabel, treeDepth, type StructureLine, type StructureNode } from './chiasm';

interface StructureDiagramProps {
  lines: StructureLine[];
  /** accessible name, e.g. "Proposed chiastic structure of Psalm 23" */
  label: string;
  className?: string;
}

/**
 * Chiasm as an indented ladder — A, B, C … C′, B′, A′ — with hairline connectors
 * joining each mirrored pair and the centre emphasised. Rendered as a nested
 * ordered list (A contains B contains C), so the pairing is audible to screen readers.
 */
export function ChiasmDiagram({ lines, label, className }: StructureDiagramProps) {
  const t = useT('literary');
  const tree = buildChiasmTree(lines);
  const deepest = treeDepth(tree);
  return (
    <figure className={cx(styles.figure, className)}>
      <ol className={cx(styles.ladder, styles.root)} aria-label={label}>
        {tree.map((n, i) => (
          <ChiasmItem key={i} node={n} deepest={deepest} />
        ))}
      </ol>
      <figcaption className={styles.caption}>
        {t('chiasm.caption')}
      </figcaption>
    </figure>
  );
}

function ChiasmItem({ node, deepest }: { node: StructureNode; deepest: number }) {
  const centre = node.children.length === 0 && node.depth === deepest;
  return (
    <li className={cx(styles.item, node.close && styles.paired, centre && styles.centre)}>
      <Line line={node.open} label={chiasmLabel(node.open, false)} centre={centre} />
      {node.children.length > 0 && (
        <ol className={styles.ladder}>
          {node.children.map((c, i) => (
            <ChiasmItem key={i} node={c} deepest={deepest} />
          ))}
        </ol>
      )}
      {node.close && <Line line={node.close} label={chiasmLabel(node.close, true)} centre={centre} />}
    </li>
  );
}

function Line({ line, label, centre }: { line: StructureLine; label: string; centre: boolean }) {
  const t = useT('literary');
  return (
    <div className={cx(styles.line, centre && styles.centreLine)}>
      <span className={styles.label}>{label}</span>
      <span className={styles.body}>
        {centre && <span className={styles.centreTag}>{t('chiasm.centre')}</span>}
        <span className={styles.text}>
          <ScriptText text={line.text} />
        </span>
        {line.ref && (
          <span className={styles.ref}>
            <RefChip passage={line.ref} />
          </span>
        )}
      </span>
    </div>
  );
}

/** A non-mirrored structure (argument or narrative outline) as a nested, labelled list. */
export function StructureList({ lines, label, className }: StructureDiagramProps) {
  const tree = buildOutlineTree(lines);
  return (
    <ol className={cx(styles.outline, className)} aria-label={label}>
      {tree.map((n, i) => (
        <OutlineItem key={i} node={n} />
      ))}
    </ol>
  );
}

function OutlineItem({ node }: { node: StructureNode }) {
  return (
    <li className={styles.outlineItem}>
      <div className={styles.line}>
        {node.open.label.trim() && <span className={styles.outlineLabel}>{node.open.label.trim()}</span>}
        <span className={styles.body}>
          <span className={styles.text}>
            <ScriptText text={node.open.text} />
          </span>
          {node.open.ref && (
            <span className={styles.ref}>
              <RefChip passage={node.open.ref} />
            </span>
          )}
        </span>
      </div>
      {node.children.length > 0 && (
        <ol className={styles.outlineNested}>
          {node.children.map((c, i) => (
            <OutlineItem key={i} node={c} />
          ))}
        </ol>
      )}
    </li>
  );
}
