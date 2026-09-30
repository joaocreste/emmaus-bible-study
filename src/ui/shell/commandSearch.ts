/**
 * Command-palette search (pure): references, curated studies, topics, key
 * words and authors. Returns result rows with an action descriptor; the
 * palette component executes them against the session.
 *
 * Language: references are understood in the reader's language first (and in any
 * other: "Romanos 8", "Romains 8.28", "Rom 8"); labels are written in it. Studies and
 * topics arrive already localized from the providers (`list(locale)`, `listTopics(locale)`),
 * so their localized names and aliases are searched too.
 */
import type { Author, CuratedStudy, PassageRef } from '../../domain/models';
import { formatRef, parseReference } from '../../domain/reference';
import { translator } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';
import type { TopicMatch } from '../../providers/types';

export type PaletteAction =
  | { kind: 'open-passage'; passage: PassageRef }
  | { kind: 'open-study'; studyId: string }
  | { kind: 'open-topic'; topic: string; studyId?: string }
  | { kind: 'open-word'; studyId: string; wordId: string }
  | { kind: 'open-author'; authorId: string }
  | { kind: 'ask'; text: string };

export type PaletteGroupId = 'passage' | 'studies' | 'topics' | 'words' | 'authors' | 'ask';

export interface PaletteItem {
  id: string;
  group: PaletteGroupId;
  title: string;
  subtitle?: string;
  /** original-language title (sets lang/dir and the Greek/Hebrew font) */
  lang?: 'grc' | 'hbo' | 'arc';
  action: PaletteAction;
}

export interface PaletteGroup {
  id: PaletteGroupId;
  label: string;
  items: PaletteItem[];
}

export interface PaletteData {
  studies: CuratedStudy[];
  topics: TopicMatch[];
  authors: Author[];
}


const LIMIT: Record<PaletteGroupId, number> = { passage: 1, studies: 4, topics: 5, words: 5, authors: 4, ask: 1 };

/** Lowercase, strip diacritics (so "katakrima" ~ "κατάκριμα" transliteration, "logos" ~ "lógos"). */
export function normalizeSearch(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[’'"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 0 = no match; higher is better. Prefix beats word-prefix beats substring. */
export function scoreText(query: string, ...fields: Array<string | undefined>): number {
  let best = 0;
  for (const f of fields) {
    if (!f) continue;
    const t = normalizeSearch(f);
    if (!t) continue;
    let s = 0;
    if (t === query) s = 100;
    else if (t.startsWith(query)) s = 80;
    else if (t.includes(` ${query}`) || t.includes(`-${query}`)) s = 60;
    else if (query.length >= 3 && t.includes(query)) s = 40;
    if (s > best) best = s;
  }
  return best;
}

function top<T extends { score: number }>(items: T[], n: number): T[] {
  return items
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

function langOf(language: 'greek' | 'hebrew' | 'aramaic'): PaletteItem['lang'] {
  return language === 'greek' ? 'grc' : language === 'hebrew' ? 'hbo' : 'arc';
}

type ShellT = ReturnType<typeof translator<'shell'>>;

function studyItem(s: CuratedStudy, t: ShellT): PaletteItem {
  return {
    id: `study:${s.id}`,
    group: 'studies',
    title: s.title,
    subtitle: [s.kind === 'passage' ? t('item.passageStudy') : t('item.topicStudy'), s.subtitle].filter(Boolean).join(' · '),
    action: { kind: 'open-study', studyId: s.id },
  };
}

function topicItem(m: TopicMatch, t: ShellT): PaletteItem {
  const n = m.topic.keyPassages.length;
  return {
    id: `topic:${m.id}`,
    group: 'topics',
    title: m.name,
    subtitle: m.topic.question ?? (n ? t('item.keyPassages', { count: n }) : t('item.topic')),
    action: { kind: 'open-topic', topic: m.name, ...(m.studyId ? { studyId: m.studyId } : {}) },
  };
}

/** Results for a query, grouped in display order. An empty query returns suggestions. Labels follow `locale`. */
export function searchPalette(rawQuery: string, data: PaletteData, locale: Locale = 'en'): PaletteGroup[] {
  const t = translator(locale, 'shell');
  const query = normalizeSearch(rawQuery);
  const groups: PaletteGroup[] = [];
  const push = (id: PaletteGroupId, items: PaletteItem[]) => {
    if (items.length) groups.push({ id, label: t(`group.${id}`), items: items.slice(0, LIMIT[id]) });
  };

  // A topic whose deep study is already listed would be a duplicate row.
  const curatedIds = new Set(data.studies.map((s) => s.id));
  const topics = data.topics.filter((m) => !m.studyId || !curatedIds.has(m.studyId));

  if (!query) {
    push('studies', data.studies.map((s) => studyItem(s, t)));
    push('topics', topics.slice(0, 6).map((m) => topicItem(m, t)));
    return groups;
  }

  // (a) A Bible reference typed directly.
  const ref = safeParseReference(rawQuery, locale);
  if (ref) {
    const label = formatRef(ref, 'long', locale);
    push('passage', [
      {
        id: `passage:${label}`,
        group: 'passage',
        title: t('item.open', { ref: label }),
        subtitle: t('item.passageStudy'),
        action: { kind: 'open-passage', passage: ref },
      },
    ]);
  }

  // (b) Curated studies.
  push(
    'studies',
    top(
      data.studies.map((s) => ({
        s,
        score: scoreText(
          query,
          s.title,
          s.subtitle,
          ...s.match.topics,
          ...data.topics.filter((m) => m.studyId === s.id).flatMap((m) => [m.name, ...m.aliases]),
        ),
      })),
      LIMIT.studies,
    ).map(({ s }) => studyItem(s, t)),
  );

  // (c) Topics.
  push(
    'topics',
    top(
      topics.map((m) => ({ m, score: scoreText(query, m.name, ...m.aliases) })),
      LIMIT.topics,
    ).map(({ m }) => topicItem(m, t)),
  );

  // (d) Key words across curated studies (lemma, English, transliteration, Strong's).
  const words = data.studies.flatMap((s) =>
    s.keyWords.map((w) => ({
      s,
      w,
      score: scoreText(query, w.english, w.transliteration, w.lemma, w.strong),
    })),
  );
  push(
    'words',
    top(words, LIMIT.words).map(({ s, w }) => ({
      id: `word:${s.id}:${w.id}`,
      group: 'words' as const,
      title: w.lemma,
      lang: langOf(w.language),
      subtitle: `${w.transliteration} · ${w.english} · ${s.title}`,
      action: { kind: 'open-word' as const, studyId: s.id, wordId: w.id },
    })),
  );

  // (e) Authors.
  push(
    'authors',
    top(
      data.authors.map((a) => ({ a, score: scoreText(query, a.name, ...(a.aliases ?? [])) })),
      LIMIT.authors,
    ).map(({ a }) => ({
      id: `author:${a.id}`,
      group: 'authors' as const,
      title: a.name,
      subtitle: [a.lifespan, a.tradition].filter(Boolean).join(' · '),
      action: { kind: 'open-author' as const, authorId: a.id },
    })),
  );

  // Always offer to ask the question in the conversation.
  const text = rawQuery.trim();
  push('ask', [
    {
      id: 'ask',
      group: 'ask',
      title: t('item.ask', { text }),
      subtitle: t('item.askSub'),
      action: { kind: 'ask', text },
    },
  ]);

  return groups;
}

function safeParseReference(q: string, locale: Locale): PassageRef | null {
  try {
    return parseReference(q, { locale });
  } catch {
    return null;
  }
}
