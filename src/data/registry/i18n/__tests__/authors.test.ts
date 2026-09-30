/**
 * Localized authors (src/data/registry/i18n/authors.ts): every author the registry knows —
 * base, shared, knowledge-base and confession registries and the authors declared by curated
 * studies and topics — has a complete Portuguese, Spanish and French entry; translations keep
 * the English facts (years, Greek words); localized names resolve in chat; English is unchanged.
 */
import { describe, expect, it } from 'vitest';
import { BASE_AUTHORS } from '../../base-authors';
import { CONFESSION_AUTHORS } from '../../confession-sources';
import { KB_AUTHORS } from '../../kb-sources';
import { SHARED_AUTHORS } from '../../shared-authors';
import { AUTHOR_TRANSLATIONS, authorNameByEnglishName, authorTranslation, localizedAuthorAliases } from '..';
import type { NonEnglishLocale } from '../../../../domain/bookNames';
import { authorDisplayName, citationAuthorName, hasAuthorTranslation, localizeAuthor } from '../../../../domain/attribution';
import type { Author } from '../../../../domain/models';
import { detectAuthorMention } from '../../../../engine/intent';
import { personName } from '../../../../engine/compose';
import { lowerText } from '../../../../engine/text';
import { createCuratedProviders } from '../../../../providers/curated';
import { loadCuratedStudies, loadCuratedTopics } from '../../../../providers/curated/modules';

const LOCALES: NonEnglishLocale[] = ['pt', 'es', 'fr'];
const registry = createCuratedProviders().sources;
const authors = registry.allAuthors();

/** English authors as defined (before the registry adds localized aliases). */
const englishById = new Map<string, Author>();
for (const a of [
  ...BASE_AUTHORS,
  ...SHARED_AUTHORS,
  ...KB_AUTHORS,
  ...CONFESSION_AUTHORS,
  ...loadCuratedStudies().flatMap((s) => s.authors ?? []),
  ...loadCuratedTopics().flatMap((t) => t.authors ?? []),
]) {
  if (!englishById.has(a.id)) englishById.set(a.id, a);
}

const numbers = (s: string) => new Set(s.match(/\d+/g) ?? []);
const greek = (s: string) => s.match(/[\p{Script=Greek}]+/gu) ?? [];

describe('author registry in pt / es / fr', () => {
  it('covers every registry and curated author', () => {
    expect(englishById.size).toBeGreaterThanOrEqual(77);
    expect(authors.length).toBe(englishById.size);
    const missing = [...englishById.keys()].filter((id) => !AUTHOR_TRANSLATIONS[id]);
    expect(missing, 'authors without a pt/es/fr entry').toEqual([]);
  });

  it('has no entries for authors the registry does not know', () => {
    expect(Object.keys(AUTHOR_TRANSLATIONS).filter((id) => !englishById.has(id))).toEqual([]);
  });

  it.each([...englishById.values()].map((a) => [a.id, a] as const))('%s: complete entries that translate the English registry', (_id, en) => {
    const entry = AUTHOR_TRANSLATIONS[en.id];
    expect(entry.en, 'entry was written for this English name').toBe(en.name);
    for (const locale of LOCALES) {
      const t = entry[locale];
      const where = `${en.id} (${locale})`;
      for (const field of ['name', 'shortName', 'tradition', 'description'] as const) {
        expect(t[field]?.trim(), `${where}: ${field}`).toBeTruthy();
        expect(t[field], `${where}: ${field} is trimmed`).toBe(t[field].trim());
        expect(t[field], `${where}: ${field} uses typographic apostrophes`).not.toMatch(/'/);
      }
      expect(t.description, `${where}: description is translated`).not.toBe(en.description);
      // no new facts, none dropped: every number and Greek word of the English description is kept
      for (const n of numbers(en.description)) expect(numbers(t.description), `${where}: keeps ${n}`).toContain(n);
      for (const g of greek(en.description)) expect(t.description, `${where}: keeps ${g}`).toContain(g);
      // a name that stays as in English keeps the English citation form
      if (t.name === en.name) expect(t.shortName, `${where}: short name`).toBe(citationAuthorName(en));
      for (const alias of t.aliases ?? []) expect(alias, `${where}: alias`).toBe(alias.toLowerCase().trim());
    }
  });

  it('localizes lifespans that carry English words, and only those', () => {
    for (const en of englishById.values()) {
      for (const locale of LOCALES) {
        const t = AUTHOR_TRANSLATIONS[en.id][locale];
        const where = `${en.id} (${locale})`;
        if (en.lifespan && /[A-Za-z]/.test(en.lifespan)) {
          expect(t.lifespan, `${where}: lifespan "${en.lifespan}"`).toBeTruthy();
          // same years (an ordinal century is written in Roman numerals: “2nd century” → “século II”)
          const years = (s: string) => s.replace(/\b\d+(st|nd|rd|th) century\b/g, '').match(/\d+/g);
          expect(years(t.lifespan!), `${where}: same years`).toEqual(years(en.lifespan));
          expect(t.lifespan, `${where}: no English abbreviations`).not.toMatch(/(^|[\s(])(b|d|fl)\.\s(\d|c\.|after)|\b(BC|AD|after|century|founded)\b/);
        } else {
          expect(t.lifespan, `${where}: numeric lifespan needs no translation`).toBeUndefined();
        }
      }
      expect(AUTHOR_TRANSLATIONS[en.id].fr.lifespan ?? '', `${en.id}: French “v.” for circa`).not.toMatch(/\bc\.\s*\d/);
    }
  });

  it('follows French typography (no-break space before ; : ? ! and inside « »)', () => {
    for (const [id, entry] of Object.entries(AUTHOR_TRANSLATIONS)) {
      for (const text of [entry.fr.tradition, entry.fr.description, entry.fr.lifespan ?? '']) {
        expect(text, id).not.toMatch(/ [;:?!»]|« /);
        expect(text, id).not.toMatch(/[^ ][;:?!»]\s|«[^ ]/);
      }
    }
  });

  it('uses the conventional names of fathers, doctors and reformers — and keeps modern names', () => {
    const names = (id: string) => LOCALES.map((l) => AUTHOR_TRANSLATIONS[id][l].name);
    expect(names('augustine')).toEqual(['Agostinho de Hipona', 'Agustín de Hipona', 'Augustin d’Hippone']);
    expect(names('calvin')).toEqual(['João Calvino', 'Juan Calvino', 'Jean Calvin']);
    expect(names('luther')).toEqual(['Martinho Lutero', 'Martín Lutero', 'Martin Luther']);
    expect(names('chrysostom')).toEqual(['João Crisóstomo', 'Juan Crisóstomo', 'Jean Chrysostome']);
    expect(names('aquinas')).toEqual(['Tomás de Aquino', 'Tomás de Aquino', 'Thomas d’Aquin']);
    expect(names('irenaeus')).toEqual(['Ireneu de Lião', 'Ireneo de Lyon', 'Irénée de Lyon']);
    for (const id of ['wesley', 'tim-keller', 'cs-lewis', 'john-owen', 'spurgeon', 'bonhoeffer']) {
      expect(new Set(names(id)), id).toEqual(new Set([englishById.get(id)!.name]));
    }
    expect(LOCALES.map((l) => AUTHOR_TRANSLATIONS.augustine[l].shortName)).toEqual(['Agostinho', 'Agustín', 'Augustin']);
    expect(LOCALES.map((l) => AUTHOR_TRANSLATIONS.calvin[l].shortName)).toEqual(['Calvino', 'Calvino', 'Calvin']);
  });
});

describe('attribution helpers', () => {
  const augustine = registry.getAuthor('augustine')!;

  it('English output is unchanged', () => {
    for (const a of authors) {
      expect(localizeAuthor(a, 'en')).toBe(a);
      expect(localizeAuthor(a)).toBe(a);
      expect(citationAuthorName(a, 'en')).toBe(citationAuthorName(a));
      expect(citationAuthorName(a)).toBe(citationAuthorName({ name: a.name, shortName: a.shortName }));
      expect(authorDisplayName(a, 'en')).toBe(a.name);
      expect(hasAuthorTranslation(a, 'en')).toBe(false);
      expect(personName(a.name, 'en')).toBe(a.name);
    }
    expect(authorTranslation('augustine', 'en')).toBeUndefined();
    expect(authorNameByEnglishName('John Calvin', 'en')).toBeUndefined();
  });

  it('localizeAuthor returns the author in the reader’s language, with a stable identity', () => {
    const pt = localizeAuthor(augustine, 'pt');
    expect(pt).toMatchObject({
      id: 'augustine',
      name: 'Agostinho de Hipona',
      shortName: 'Agostinho',
      tradition: 'Padre latino da Igreja',
      lifespan: '354–430',
      era: 'early-church',
    });
    expect(pt.url).toBe(augustine.url);
    expect(pt.description).toMatch(/^Bispo de Hipona/);
    expect(localizeAuthor(augustine, 'pt')).toBe(pt);
    expect(localizeAuthor(undefined, 'pt')).toBeUndefined();
    expect(localizeAuthor(registry.getAuthor('john-piper')!, 'fr').lifespan).toBe('né en 1946');
    expect(localizeAuthor(registry.getAuthor('chrysostom')!, 'fr').lifespan).toBe('v. 347–407');
    // an author the overlay does not know stays as it is
    const stranger: Author = { id: 'x-unknown', name: 'Jane Doe', era: 'contemporary', tradition: 'Anglican', description: 'Test.' };
    expect(localizeAuthor(stranger, 'es')).toBe(stranger);
    expect(hasAuthorTranslation(stranger, 'es')).toBe(false);
  });

  it('citationAuthorName and authorDisplayName follow the locale', () => {
    expect(LOCALES.map((l) => citationAuthorName(augustine, l))).toEqual(['Agostinho', 'Agustín', 'Augustin']);
    expect(citationAuthorName(localizeAuthor(augustine, 'es'))).toBe('Agustín');
    expect(citationAuthorName(registry.getAuthor('keil-delitzsch')!, 'fr')).toBe('Keil & Delitzsch');
    expect(LOCALES.map((l) => authorDisplayName(registry.getAuthor('calvin')!, l))).toEqual(['João Calvino', 'Juan Calvino', 'Jean Calvin']);
  });

  it('personName falls back to registry authors by their English name', () => {
    expect(personName('John Calvin', 'pt')).toBe('João Calvino');
    expect(personName('Augustine of Hippo', 'fr')).toBe('Augustin d’Hippone');
    expect(personName('Paul', 'pt')).toBe('Paulo'); // traditional book authors still come from the engine catalog
    expect(personName('Someone Else', 'es')).toBe('Someone Else');
  });
});

describe('localized names resolve to the author in chat', () => {
  it('every localized name and short name finds its author', () => {
    for (const [id, entry] of Object.entries(AUTHOR_TRANSLATIONS)) {
      for (const locale of LOCALES) {
        const t = entry[locale];
        if (t.name === entry.en || entry.descriptive) continue;
        expect(registry.findAuthor(t.name)?.id, `${locale}: ${t.name}`).toBe(id);
        expect(registry.findAuthor(t.shortName)?.id, `${locale}: ${t.shortName}`).toBe(id);
      }
    }
  });

  it('every extra alias finds its author', () => {
    for (const [id, entry] of Object.entries(AUTHOR_TRANSLATIONS)) {
      for (const locale of LOCALES) for (const alias of entry[locale].aliases ?? []) expect(registry.findAuthor(alias)?.id, alias).toBe(id);
    }
  });

  it.each([
    ['O que Agostinho disse sobre isso?', 'augustine'],
    ['o que santo agostinho ensinou sobre a graça', 'augustine'],
    ['¿Qué dijo Calvino?', 'calvin'],
    ['¿Qué dice Juan Calvino de este pasaje?', 'calvin'],
    ['Qu’a dit Irénée de Lyon ?', 'irenaeus'],
    ['O que Ireneu de Lião escreveu?', 'irenaeus'],
    ['E Martinho Lutero?', 'luther'],
    ['¿Y Martín Lutero?', 'luther'],
    ['Que dit Jean Chrysostome ?', 'chrysostom'],
    ['São João Crisóstomo', 'chrysostom'],
    ['Atanásio de Alexandria', 'athanasius'],
    ["Qu'en dit Athanase ?", 'athanasius'],
    ['Tomás de Aquino', 'aquinas'],
    ['Qu’en pense Thomas d’Aquin ?', 'aquinas'],
    ['Flávio Josefo', 'josephus'],
    ['Filón de Alejandría', 'philo'],
    ['Que dit Rachi ?', 'rashi'],
    ['Eusèbe de Césarée', 'eusebius'],
    ['Teodoreto de Ciro', 'theodoret'],
    ['Suetônio', 'suetonius'],
    ['O que disse o Papa João Paulo II?', 'john-paul-ii'],
    ['¿Qué escribió Juan Pablo II?', 'john-paul-ii'],
    ['Jean-Paul II', 'john-paul-ii'],
    ['Justino Mártir', 'justin-martyr'],
    ['Fócio', 'photius'],
    ['Teófilo de Antioquía', 'theophilus-of-antioch'],
    ['Cirilo de Jerusalém', 'cyril-of-jerusalem'],
    ['Juan Damasceno', 'john-of-damascus'],
    ['Jacó Armínio', 'jacobus-arminius'],
    ['Filipe Melanchthon', 'philip-melanchthon'],
  ])('findAuthor(%s) → %s', (text, id) => {
    expect(registry.findAuthor(text)?.id).toBe(id);
  });

  it.each([
    ['O que Agostinho disse sobre isso?', 'augustine'],
    ['¿Qué dijo Calvino?', 'calvin'],
    ['Qu’a dit Augustin ?', 'augustine'],
    ['E o que João Calvino pensava?', 'calvin'],
  ])('the classifier recognises %s as %s', (text, id) => {
    expect(detectAuthorMention(text, lowerText(text), { findAuthor: (t) => registry.findAuthor(t) })?.id).toBe(id);
  });

  it('adds no bare English surnames that belong to other authors', () => {
    expect(registry.findAuthor('Barclay')?.id).toBe('john-barclay');
    expect(registry.findAuthor('Keller')?.id).toBe('tim-keller');
    expect(registry.findAuthor('Henry')?.id).toBe('matthew-henry');
    expect(localizedAuthorAliases('robert-barclay')).toEqual([]);
    expect(localizedAuthorAliases('phillip-keller')).toEqual([]);
    expect(registry.getAuthor('robert-barclay')!.aliases).toEqual(englishById.get('robert-barclay')!.aliases);
  });

  it('keeps the English name and aliases first', () => {
    const a = registry.getAuthor('augustine')!;
    const en = englishById.get('augustine')!;
    expect(a.name).toBe(en.name);
    expect(a.aliases!.slice(0, en.aliases!.length)).toEqual(en.aliases);
    expect(a.aliases).toEqual(expect.arrayContaining(['agostinho', 'agostinho de hipona', 'santo agostinho', 'agustín', 'san agustín', 'augustin', 'augustin d’hippone']));
  });
});
