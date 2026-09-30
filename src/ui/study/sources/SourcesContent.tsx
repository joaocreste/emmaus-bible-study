import { useId, useMemo } from 'react';
import type { Source, Study } from '../../../domain/models';
import { useI18n, useT } from '../../../i18n/I18nProvider';
import { cx } from '../../../lib/cx';
import { useProviders } from '../../../providers/ProvidersContext';
import { rich } from '../../common/rich';
import { CrossDivider } from '../../primitives';
import { collectSourceUsage, studySourceIds } from './citations';
import { groupSources } from './grouping';
import { ProvenanceLegend } from './ProvenanceLegend';
import { SourceCard } from './SourceCard';
import styles from './SourcesContent.module.css';

interface SourcesContentProps {
  study: Study;
  className?: string;
}

/**
 * The study's bibliography (grouped by kind of work, most-cited first) and the
 * provenance legend, ending with a cross divider. Shared by the dashboard's Sources
 * section and the phone Sources tab; it does not depend on StudyUI, so it can render
 * outside the study workspace.
 */
export function SourcesContent({ study, className }: SourcesContentProps) {
  const { sources } = useProviders();
  const { locale } = useI18n();
  const t = useT('sources');
  const baseId = useId();
  const usage = useMemo(() => collectSourceUsage(study), [study]);
  const { groups, missing, counts } = useMemo(() => {
    const ids = studySourceIds(study, usage);
    const known: Source[] = [];
    const unknown: string[] = [];
    for (const id of ids) {
      const s = sources.getSource(id);
      if (s) known.push(s);
      else unknown.push(id);
    }
    const byUse = (a: Source, b: Source) => (usage.get(b.id)?.count ?? 0) - (usage.get(a.id)?.count ?? 0);
    const sorted = known.map((s, i) => ({ s, i })).sort((a, b) => byUse(a.s, b.s) || a.i - b.i).map((x) => x.s);
    return {
      groups: groupSources(sorted, locale),
      missing: unknown,
      counts: {
        total: known.length,
        pd: known.filter((s) => s.license.status === 'public-domain').length,
        open: known.filter((s) => s.license.status === 'open-license').length,
        copyrighted: known.filter((s) => s.license.status === 'copyrighted').length,
      },
    };
  }, [study, usage, sources, locale]);

  return (
    <div className={cx(styles.content, className)}>
      <p className={styles.summary}>
        {rich(t('summary.works', { count: counts.total }), { strong: (n) => <strong>{n}</strong> })}
        {counts.total > 0 && (
          <>
            {' '}
            · {t('summary.licenses', { pd: counts.pd, open: counts.open, copyrighted: counts.copyrighted })}
          </>
        )}
      </p>

      {groups.map((g) => {
        const headingId = `${baseId}-${g.id}`;
        return (
          <section key={g.id} className={styles.group} aria-labelledby={headingId}>
            <h3 id={headingId} className={styles.groupTitle}>
              {g.label}
              <span className={styles.groupCount}>
                {g.sources.length}
                <span className="visually-hidden"> {t('group.countHidden', { count: g.sources.length })}</span>
              </span>
            </h3>
            <ul className={styles.grid}>
              {g.sources.map((s) => (
                <SourceCard key={s.id} source={s} usage={usage.get(s.id)} />
              ))}
            </ul>
          </section>
        );
      })}

      {missing.length > 0 && (
        <section className={cx(styles.group, styles.missing)} aria-labelledby={`${baseId}-missing`}>
          <h3 id={`${baseId}-missing`} className={styles.groupTitle}>
            {t('missing.title')}
            <span className={styles.groupCount}>
              {missing.length}
              <span className="visually-hidden"> {t('missing.countHidden', { count: missing.length })}</span>
            </span>
          </h3>
          <p className={styles.missingText}>{t('missing.text', { ids: missing.join(', ') })}</p>
        </section>
      )}

      <ProvenanceLegend />
      <CrossDivider />
    </div>
  );
}
