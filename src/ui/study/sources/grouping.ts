import { Copyright, LockOpen, Scale, type LucideIcon } from 'lucide-react';
import type { License, Source, SourceType, UsagePolicy } from '../../../domain/models';
import { LOCALES, type Locale } from '../../../i18n/locales';
import { translator } from '../../../i18n/catalog';
import type { BadgeProps } from '../../primitives';

export interface SourceGroupDef {
  id: 'scripture' | 'lexicons' | 'commentaries' | 'books' | 'sermons' | 'creeds' | 'websites';
  /** English label (the UI shows the 'sources' namespace's `group.<id>`) */
  label: string;
  types: SourceType[];
}

/** Bibliography groups, in reading order. Every SourceType belongs to exactly one group. */
export const SOURCE_GROUPS: SourceGroupDef[] = [
  { id: 'scripture', label: 'Scripture & original text', types: ['bible-translation', 'original-text'] },
  { id: 'lexicons', label: 'Lexicons & datasets', types: ['lexicon', 'dataset', 'dictionary', 'encyclopedia'] },
  { id: 'commentaries', label: 'Study notes & commentaries', types: ['study-notes', 'commentary'] },
  { id: 'books', label: 'Books', types: ['book'] },
  { id: 'sermons', label: 'Sermons, lectures & articles', types: ['sermon', 'lecture', 'article'] },
  { id: 'creeds', label: 'Creeds, confessions & catechisms', types: ['creed', 'confession', 'catechism'] },
  { id: 'websites', label: 'Websites', types: ['website'] },
];

export interface SourceGroup {
  id: string;
  label: string;
  sources: Source[];
}

/** Group sources by type (only non-empty groups), keeping the given order inside each group; labels in the reader's language. */
export function groupSources(sources: Source[], locale: Locale = 'en'): SourceGroup[] {
  const t = translator(locale, 'sources');
  return SOURCE_GROUPS.map((g) => ({ id: g.id, label: t(`group.${g.id}`), sources: sources.filter((s) => g.types.includes(s.type)) })).filter(
    (g) => g.sources.length > 0,
  );
}

/** What the license lets Emmaus do with the work, in plain words (English; see `usagePolicyText`). */
export const USAGE_TEXT: Record<UsagePolicy, string> = {
  'full-text': 'Full text may be shown',
  excerpt: 'Short attributed excerpts only',
  'summary-only': 'Summarised only — wording not reproduced',
  'metadata-only': 'Cited only',
};

export interface LicenseBadgeMeta {
  label: string;
  tone: NonNullable<BadgeProps['tone']>;
  icon: LucideIcon;
}

/** What the license lets Emmaus do with the work, in the reader's language. */
export function usagePolicyText(usage: UsagePolicy, locale: Locale = 'en'): string {
  return translator(locale, 'sources')(`policy.${usage}`);
}

export function licenseBadge(license: License, locale: Locale = 'en'): LicenseBadgeMeta {
  const t = translator(locale, 'sources');
  switch (license.status) {
    case 'public-domain':
      return { label: t('badge.publicDomain'), tone: 'olive', icon: LockOpen };
    case 'open-license':
      return { label: t('badge.openLicense', { name: shortLicenseName(localizeLicenseName(license.name, locale)) }), tone: 'sage', icon: Scale };
    case 'copyrighted':
      return { label: t('badge.copyrighted'), tone: 'terracotta', icon: Copyright };
  }
}

/**
 * A license name from the registry in the reader's language. Only the generic English wording is
 * translated ("Public domain (1887 translation)" → "Domínio público (tradução de 1887)"); license
 * identifiers (CC BY-SA 4.0), copyright notices (© 1973 J. I. Packer) and names already in another
 * language are left exactly as recorded.
 */
export function localizeLicenseName(name: string, locale: Locale = 'en'): string {
  if (locale === 'en') return name;
  const t = translator(locale, 'sources');
  const n = name.trim();
  let m: RegExpExecArray | null;
  if (n === 'Public domain') return t('license.publicDomain');
  if ((m = /^Public domain \((\d{4}) translation\)$/.exec(n))) return t('license.publicDomainTranslation', { year: m[1] });
  if (n === 'Public domain (outside the United Kingdom)') return t('license.publicDomainOutsideUK');
  if ((m = /^Public domain \(dedicated (.+)\)$/.exec(n))) return t('license.publicDomainDedicated', { date: localizeDate(m[1], locale) });
  if ((m = /^Public domain \(dataset: (.+)\)$/.exec(n))) return t('license.publicDomainDataset', { license: m[1] });
  if (n === 'Free to use (per-resource licenses apply)') return t('license.freePerResource');
  if (n === 'Emmaus editorial content') return t('license.emmausEditorial');
  if ((m = /^Translation © (.+)$/.exec(n))) return t('license.translationCopyright', { holder: m[1] });
  return name;
}

/** "April 30, 2023" → "30 de abril de 2023"; anything unparseable is kept as written. */
function localizeDate(text: string, locale: Locale): string {
  const ms = Date.parse(`${text} 00:00:00 UTC`);
  if (Number.isNaN(ms)) return text;
  return new Intl.DateTimeFormat(LOCALES[locale].bcp47, { dateStyle: 'long', timeZone: 'UTC' }).format(ms);
}

/** "CC BY-SA 4.0" stays; long names ("Free to use (per-resource licenses apply)") are cut at the parenthesis. */
function shortLicenseName(name: string): string {
  const cut = name.split(' (')[0].trim();
  return cut.length > 28 ? `${cut.slice(0, 27).trimEnd()}…` : cut;
}
