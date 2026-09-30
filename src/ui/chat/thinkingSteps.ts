import { useEffect, useMemo, useState } from 'react';
import { findReferences, parseReference } from '../../domain/reference';
import { translator } from '../../i18n/catalog';
import { useI18n } from '../../i18n/I18nProvider';
import type { Locale } from '../../i18n/locales';

/** The pipeline stages shown while the engine works (spec §21, previewed honestly) — 'chat' message keys. */
export const PIPELINE_STEP_KEYS = ['step.passage', 'step.text', 'step.lexicon', 'step.crossrefs', 'step.commentators'] as const;

/** English labels (tests, and code outside the React tree). */
export const PIPELINE_STEPS = PIPELINE_STEP_KEYS.map((k) => translator('en', 'chat')(k));

type StepKey = (typeof PIPELINE_STEP_KEYS)[number] | 'step.topic';

interface StepRules {
  lexicon: RegExp;
  crossrefs: RegExp;
  commentators: RegExp;
}

/** What a question is most likely about, by its words. English rules always apply (readers mix languages). */
const EN_RULES: StepRules = {
  lexicon: /\b(greek|hebrew|aramaic|word|mean|meaning|lexicon|translat|original)/,
  crossrefs: /\b(cross|other passages|where else|elsewhere|connect|parallel|echo)/,
  commentators:
    /\b(say|said|says|commentar|thinker|preach|sermon|father|reformer|calvin|luther|augustine|keller|piper|spurgeon|lewis|wright|stott|packer|sproul|carson|graham|chrysostom|wesley|henry)/,
};

/** The reader's language's own words (a word start is any non-letter, so accented initials work). */
const LOCALE_RULES: Partial<Record<Locale, StepRules>> = {
  pt: {
    lexicon: /(?<!\p{L})(grego|grega|hebrai|aramaic|palavra|signific|l[eé]xic|tradu|original)/iu,
    crossrefs: /(?<!\p{L})(refer[eê]ncias? cruzadas?|outras? passage|onde mais|em outros? lugar|conect|paralel|ecoa|ecos?(?!\p{L}))/iu,
    commentators:
      /(?<!\p{L})(diz(?!\p{L})|disse|dizem|coment|pensador|prega|serm[aãõ]|pais da igreja|reformador|calvino|lutero|agostinho|cris[oó]stomo)/iu,
  },
  es: {
    lexicon: /(?<!\p{L})(griego|griega|hebre[oa]|arame[oa]|palabra|signific|l[eé]xic|tradu|original)/iu,
    crossrefs: /(?<!\p{L})(referencias? cruzadas?|otros? pasaje|d[oó]nde m[aá]s|en otros? lugar|conect|relaciona|paralel|ecos?(?!\p{L}))/iu,
    commentators: /(?<!\p{L})(dice|dijo|dicen|coment|pensador|predic|serm[oó]n|padres de la iglesia|reformador|calvino|lutero|agust[ií]n|cris[oó]stomo)/iu,
  },
  fr: {
    lexicon: /(?<!\p{L})(grec|h[eé]breu|h[eé]bra|aram[eé]en|mots?(?!\p{L})|signifi|sens(?!\p{L})|lexique|tradu|original)/iu,
    crossrefs: /(?<!\p{L})(r[eé]f[eé]rences? crois[eé]es?|autres? passages?|ailleurs|o[uù] encore|reli(?:er|ent|e|é)(?!\p{L})|liens?(?!\p{L})|parall[eè]l|[eé]chos?(?!\p{L}))/iu,
    commentators:
      /(?<!\p{L})(dit(?!\p{L})|disait|disent|commentai|commentateur|penseur|pr[eê]ch|pr[eé]dic|sermon|p[eè]res de l|r[eé]formateur|calvin|luther|augustin|chrysostome)/iu,
  },
};

function matches(rule: keyof StepRules, text: string, lower: string, locale: Locale): boolean {
  return EN_RULES[rule].test(lower) || !!LOCALE_RULES[locale]?.[rule].test(text);
}

/** Order the step keys so the first one matches what the question is most likely about. */
export function stepKeysFor(text: string | null | undefined, locale: Locale = 'en'): StepKey[] {
  const raw = text ?? '';
  const t = raw.toLowerCase();
  let first: StepKey;
  if (matches('lexicon', raw, t, locale)) first = 'step.lexicon';
  else if (matches('crossrefs', raw, t, locale)) first = 'step.crossrefs';
  else if (matches('commentators', raw, t, locale)) first = 'step.commentators';
  else if (hasReference(raw, locale)) first = 'step.passage';
  else if (t.trim()) first = 'step.topic';
  else first = 'step.text';
  return [first, ...PIPELINE_STEP_KEYS.filter((s) => s !== first)];
}

/** The step labels, in `locale`, most likely one first. */
export function stepsFor(text: string | null | undefined, locale: Locale = 'en'): string[] {
  const t = translator(locale, 'chat');
  return stepKeysFor(text, locale).map((k) => t(k));
}

function hasReference(text: string, locale: Locale): boolean {
  try {
    return !!parseReference(text, { locale }) || findReferences(text, { locale }).length > 0;
  } catch {
    return false;
  }
}

/** Rotating step label (in the reader's language) while `active`; restarts for each new request text. */
export function useThinkingStep(active: boolean, text: string | null | undefined, intervalMs = 900): string {
  const { locale } = useI18n();
  const [index, setIndex] = useState(0);
  const steps = useMemo(() => stepsFor(text, locale), [text, locale]);
  useEffect(() => {
    setIndex(0);
    if (!active) return;
    const id = window.setInterval(() => setIndex((i) => i + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [active, text, intervalMs]);
  return steps[Math.min(index, steps.length - 1)];
}
