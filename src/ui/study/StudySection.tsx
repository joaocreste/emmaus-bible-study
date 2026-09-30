import type { ReactNode } from 'react';
import type { SectionId } from '../../domain/models';
import { cx } from '../../lib/cx';
import { useArrivedLate } from './sectionArrival';
import { useOptionalStudyUI } from './StudyUIContext';
import styles from './StudySection.module.css';
import { sectionDomId, toRoman, useSectionMeta } from './types';

interface StudySectionProps {
  id: SectionId;
  index: number;
  /** override the default title/description (the section's localized metadata) */
  title?: string;
  description?: ReactNode;
  /** filters / toggles shown at the right of the header (wraps below on narrow screens) */
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Standard frame for a dashboard section: roman-numeral eyebrow, display title, description, toolbar.
 * A generated study's layout (chosen for the reader's question) may retitle a section and give it a
 * short intro; those override the defaults. Sections that arrive while a page is being composed fade in.
 */
export function StudySection({ id, index, title, description, toolbar, children, className }: StudySectionProps) {
  const meta = useSectionMeta()(id);
  const headingId = `${sectionDomId(id)}-title`;
  const layout = useOptionalStudyUI()?.study.layout?.sections.find((s) => s.id === id);
  const arrived = useArrivedLate(id);
  const heading = layout?.title?.trim() || title || meta.title;
  const intro = layout?.intro?.trim() || description || meta.description;
  return (
    <section
      id={sectionDomId(id)}
      aria-labelledby={headingId}
      className={cx(styles.section, arrived && styles.arrived, className)}
      data-section={id}
    >
      <header className={styles.header}>
        <div className={styles.headingGroup}>
          <span className={styles.numeral} aria-hidden="true">
            {toRoman(index)}
          </span>
          <div>
            <h2 id={headingId} className={cx('t-display', styles.title)}>
              {heading}
            </h2>
            <p className={styles.description}>{intro}</p>
          </div>
        </div>
        {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
