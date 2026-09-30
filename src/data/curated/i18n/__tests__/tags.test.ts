/** Every English search tag of the curated library has pt/es/fr words (docs/I18N.md §4). */
import { describe, expect, it } from 'vitest';
import { localTags, TAG_GLOSSARIES, withLocalTags } from '../tags';

const modules = import.meta.glob<{ id: string }>(['../../studies/*.ts', '../../topics/*.ts'], { eager: true, import: 'default' });

function tagsOf(node: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(node)) node.forEach((x) => tagsOf(x, out));
  else if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      if (key === 'tags' && Array.isArray(child) && child.every((x) => typeof x === 'string')) child.forEach((t) => out.add(t));
      else tagsOf(child, out);
    }
  }
  return out;
}

const english = tagsOf(Object.values(modules));

describe('tag glossaries', () => {
  it('finds the curated tags', () => {
    expect(english.size).toBeGreaterThan(500);
  });

  for (const [locale, glossary] of Object.entries(TAG_GLOSSARIES)) {
    it(`${locale}: every curated tag has lowercase translations`, () => {
      const missing = [...english].filter((tag) => !glossary[tag]?.length);
      expect(missing).toEqual([]);
      const bad = Object.entries(glossary).filter(([, words]) => words.some((w) => !w.trim() || w !== w.toLocaleLowerCase(locale)));
      expect(bad).toEqual([]);
    });
  }

  it('keeps the English tags and appends the translations', () => {
    const tag = [...english][0];
    expect(localTags([tag], 'pt').slice(0, 1)).toEqual([tag]);
    expect(localTags([tag], 'en')).toEqual([tag]);
    const study = { theology: [{ id: 'x', tags: [tag] }] };
    expect(withLocalTags(study, 'fr').theology[0].tags).toEqual(localTags([tag], 'fr'));
    expect(withLocalTags(study, 'en')).toBe(study);
    const xrefs = { crossReferences: [{ id: 'y', tags: [tag] }] };
    expect(withLocalTags(xrefs, 'es').crossReferences[0].tags).toEqual([tag]);
  });
});
