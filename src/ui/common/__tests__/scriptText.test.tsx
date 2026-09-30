import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { renderWithScripts, splitScripts } from '../ScriptText';

const join = (text: string) =>
  splitScripts(text)
    .map((r) => r.text)
    .join('');

describe('splitScripts', () => {
  it('leaves plain English alone', () => {
    expect(splitScripts('No condemnation')).toEqual([{ text: 'No condemnation', script: null }]);
  });

  it('marks Greek runs, keeping multi-word phrases together', () => {
    expect(splitScripts('Focused on κατάκριμα (condemnation)')).toEqual([
      { text: 'Focused on ', script: null },
      { text: 'κατάκριμα', script: 'greek' },
      { text: ' (condemnation)', script: null },
    ]);
    expect(splitScripts('ὁ λόγος was')).toEqual([
      { text: 'ὁ λόγος', script: 'greek' },
      { text: ' was', script: null },
    ]);
    expect(splitScripts('Does μονογενής mean “only begotten”?')[1]).toEqual({ text: 'μονογενής', script: 'greek' });
    expect(splitScripts('κατά-κριμα, -τος, τό').filter((r) => r.script === 'greek').map((r) => r.text)).toEqual([
      'κατά-κριμα',
      'τος',
      'τό',
    ]);
  });

  it('marks Hebrew runs, joining words, maqaf and points', () => {
    const runs = splitScripts('Exodus 34:6 (רַב־חֶסֶד וֶאֱמֶת)');
    expect(runs).toEqual([
      { text: 'Exodus 34:6 (', script: null },
      { text: 'רַב־חֶסֶד וֶאֱמֶת', script: 'hebrew' },
      { text: ')', script: null },
    ]);
    expect(splitScripts('H5095 נָהַל')[1]).toEqual({ text: 'נָהַל', script: 'hebrew' });
  });

  it('never changes the text', () => {
    for (const t of ['אָן by itself usually means where?', 'Noun, accusative singular feminine (κατὰ…', 'a ἀγάπη b חֶסֶד c']) {
      expect(join(t)).toBe(t);
    }
  });
});

describe('renderWithScripts', () => {
  it('tags Greek with lang="grc" and isolates Hebrew right-to-left', () => {
    const html = renderToStaticMarkup(<>{renderWithScripts('χάρις and חֶסֶד')}</>);
    expect(html).toBe('<span lang="grc" class="t-greek">χάρις</span> and <bdi lang="hbo" dir="rtl" class="t-hebrew">חֶסֶד</bdi>');
  });
});
