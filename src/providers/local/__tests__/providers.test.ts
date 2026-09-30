/**
 * Provider tests against the generated datasets in public/data (read through a
 * Node fs loader). Regenerate the data with `npm run data:build`.
 */
import { describe, expect, it, vi } from 'vitest';
import { BOOKS } from '../../../domain/books';
import { BIBLE_VERSIONS } from '../../../domain/translations';
import { refKey } from '../../../domain/reference';
import { createLocalDatasetProviders } from '..';
import { createFetchLoader } from '../loader';
import type { BibleBookFile } from '../formats';
import type { LocalBookIntroduction, LocalLexiconEntry, LocalOriginalVerse, LocalPassage } from '../types';
import { findTextDefects } from '../cleaners';
import { createFsLoader } from './fsLoader';

const fsLoader = createFsLoader();
const providers = createLocalDatasetProviders({ loader: fsLoader, allowRemoteFallback: false });
const { scripture, originalText, lexicon, crossReferences, commentary, historicalContext } = providers;

describe('ScriptureProvider', () => {
  it('lists BSB first, then KJV and WEB, then the Portuguese, Spanish and French versions', () => {
    expect(scripture.id).toBe('local:scripture');
    expect(scripture.listTranslations().map((t) => [t.id, t.sourceId, t.language])).toEqual([
      ['BSB', 'bsb', 'en'],
      ['KJV', 'kjv', 'en'],
      ['WEB', 'web', 'en'],
      ['BLIVRE', 'biblia-livre', 'pt'],
      ['NBV', 'nova-biblia-viva', 'pt'],
      ['BPM', 'biblia-portuguesa-mundial', 'pt'],
      ['RVR1909', 'reina-valera-1909', 'es'],
      ['BLM', 'biblia-libre-para-el-mundo', 'es'],
      ['VBL', 'version-biblia-libre', 'es'],
      ['LSG', 'louis-segond-1910', 'fr'],
      ['DARBY', 'darby-francais', 'fr'],
      ['NCL', 'neo-crampon-libre', 'fr'],
      ['OST', 'ostervald', 'fr'],
    ]);
    expect(scripture.listTranslations().map((t) => t.id)).toEqual(BIBLE_VERSIONS.map((v) => v.id));
  });

  it('Romans 8:1 (BSB)', async () => {
    const p = await scripture.getPassage({ book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 1 }, 'BSB');
    expect(p.label).toBe('Romans 8:1');
    expect(p.sourceId).toBe('bsb');
    expect(p.chapters).toHaveLength(1);
    const [v] = p.chapters[0].verses;
    expect(v.text.startsWith('Therefore, there is now no condemnation')).toBe(true);
    expect(v.heading).toBe('Walking by the Spirit');
    expect(v.paragraphStart).toBe(true);
  });

  it('Psalm 23 keeps poetry lines, indents and the superscription', async () => {
    const p = (await scripture.getPassage({ book: 'PSA', startChapter: 23 }, 'BSB')) as LocalPassage;
    expect(p.label).toBe('Psalm 23');
    const ch = p.chapters[0];
    expect(ch.superscription).toBe('A Psalm of David.');
    expect(ch.verses).toHaveLength(6);
    expect(ch.verses[0].poetryLines).toEqual(['The LORD is my shepherd;', 'I shall not want.']);
    expect(ch.verses[0].poetryIndents).toEqual([1, 2]);
    expect(ch.verses[0].footnotes?.length).toBeGreaterThan(0);
  });

  it('John 3:16 in KJV and WEB', async () => {
    const ref = { book: 'JHN', startChapter: 3, startVerse: 16, endChapter: 3, endVerse: 16 };
    const kjv = await scripture.getPassage(ref, 'KJV');
    const web = await scripture.getPassage(ref, 'WEB');
    expect(kjv.chapters[0].verses[0].text).toMatch(/^For God so loved the world, that he gave his only begotten Son/);
    expect(kjv.chapters[0].verses[0].text).not.toContain('¶'); // KJV paragraph marks become paragraphStart
    expect(kjv.chapters[0].verses[0].paragraphStart).toBe(true);
    expect(web.chapters[0].verses[0].text).toMatch(/^For God so loved the world/);
    expect(web.sourceId).toBe('web');
  });

  it('multi-chapter Matthew 5–7', async () => {
    const p = await scripture.getPassage({ book: 'MAT', startChapter: 5, endChapter: 7 }, 'BSB');
    expect(p.label).toBe('Matthew 5–7');
    expect(p.chapters.map((c) => c.chapter)).toEqual([5, 6, 7]);
    expect(p.chapters[2].verses.at(-1)?.ref).toEqual({ book: 'MAT', chapter: 7, verse: 29 });
  });

  it('cross-chapter John 1:1–2:11', async () => {
    const p = await scripture.getPassage({ book: 'JHN', startChapter: 1, startVerse: 1, endChapter: 2, endVerse: 11 }, 'BSB');
    expect(p.label).toBe('John 1:1–2:11');
    expect(p.chapters[0].verses).toHaveLength(51);
    expect(p.chapters[1].verses.map((v) => v.ref.verse)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('whole book Jude', async () => {
    const p = await scripture.getPassage({ book: 'JUD', startChapter: 1, endChapter: 1 }, 'BSB');
    expect(p.label).toBe('Jude');
    expect(p.chapters[0].verses).toHaveLength(25);
  });

  it('verses the BSB omits are simply absent (Matt 17:21)', async () => {
    const p = await scripture.getPassage({ book: 'MAT', startChapter: 17, startVerse: 20, endChapter: 17, endVerse: 22 }, 'BSB');
    expect(p.chapters[0].verses.map((v) => v.ref.verse)).toEqual([20, 22]);
    const k = await scripture.getPassage({ book: 'MAT', startChapter: 17, startVerse: 21, endChapter: 17, endVerse: 21 }, 'KJV');
    expect(k.chapters[0].verses).toHaveLength(1);
  });

  it('verse counts', async () => {
    expect(await scripture.getVerseCount('ROM', 8)).toBe(39);
    expect(await scripture.getVerseCount('PSA', 119)).toBe(176);
    expect(await scripture.getVerseCount('MAT', 17)).toBe(27);
    expect(await scripture.getVerseCount('ROM', 99)).toBe(0);
  });

  it('rejects unknown books, translations and chapters with a clear error', async () => {
    await expect(scripture.getPassage({ book: 'XYZ', startChapter: 1 }, 'BSB')).rejects.toThrow(/Unknown book/);
    await expect(scripture.getPassage({ book: 'ROM', startChapter: 1 }, 'ESV' as never)).rejects.toThrow(/Unknown translation/);
    await expect(scripture.getPassage({ book: 'ROM', startChapter: 17 }, 'BSB')).rejects.toThrow(/no chapter 17/);
    await expect(scripture.getVerseCount('XYZ', 1)).rejects.toThrow(/Unknown book/);
  });
});

describe('ScriptureProvider — Bible versions in Portuguese, Spanish and French', () => {
  const NON_ENGLISH = BIBLE_VERSIONS.filter((v) => v.language !== 'en');
  const one = (book: string, c: number, v: number) => ({ book, startChapter: c, startVerse: v, endChapter: c, endVerse: v });

  it('Romans 8:1 in the default version of each language', async () => {
    const blivre = await scripture.getPassage(one('ROM', 8, 1), 'BLIVRE');
    expect(blivre.chapters[0].verses[0].text).toMatch(/^Portanto, agora, nenhuma condenação há para os que estão em Cristo Jesus/);
    expect(blivre.label).toBe('Romanos 8:1');
    expect(blivre.sourceId).toBe('biblia-livre');
    const rvr = await scripture.getPassage(one('ROM', 8, 1), 'RVR1909');
    expect(rvr.chapters[0].verses[0].text).toMatch(/^AHORA pues, ninguna condenación hay para los que están en Cristo Jesús/);
    expect(rvr.label).toBe('Romanos 8:1');
    const lsg = await scripture.getPassage(one('ROM', 8, 1), 'LSG');
    expect(lsg.chapters[0].verses[0].text).toMatch(/^Il n’y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ/);
    expect(lsg.label).toBe('Romains 8.1');
  });

  it.each(NON_ENGLISH.map((v) => v.id))('%s: Romans 8, John 1, Psalm 23, Ephesians 2 and 2 Corinthians 4 load with English verse numbers', async (id) => {
    const count = async (book: string, chapter: number) => {
      const p = (await scripture.getPassage({ book, startChapter: chapter }, id)) as LocalPassage;
      expect(p.translation).toBe(id);
      const verses = p.chapters[0].verses;
      expect(verses.every((v) => v.text.length > 0)).toBe(true);
      return verses.map((v) => v.ref.verse);
    };
    const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
    expect(await count('ROM', 8)).toEqual(range(39));
    expect(await count('JHN', 1)).toEqual(range(51));
    expect(await count('PSA', 23)).toEqual(range(6));
    expect(await count('EPH', 2)).toEqual(range(22));
    expect(await count('2CO', 4)).toEqual(range(18));
  });

  it('every non-English version has the 66 books, the English chapter counts and only English verse numbers', async () => {
    for (const v of NON_ENGLISH) {
      for (const b of BOOKS) {
        const file = await fsLoader.json<BibleBookFile>(`bible/${v.id.toLowerCase()}/${b.id}.json`);
        expect(file, `${v.id} ${b.id}`).not.toBeNull();
        expect(file!.translation).toBe(v.id);
        expect(file!.chapters.length, `${v.id} ${b.id}`).toBe(b.chapters);
        const kjv = (await fsLoader.json<BibleBookFile>(`bible/kjv/${b.id}.json`))!;
        file!.chapters.forEach((ch, i) => {
          const english = new Set(kjv.chapters[i].v.map(([n]) => n));
          for (const [n] of ch.v) expect(english.has(n), `${v.id} ${b.id} ${ch.c}:${n}`).toBe(true);
          for (const [ev, host] of Object.entries(ch.x ?? {})) {
            expect(english.has(Number(ev)), `${v.id} ${b.id} ${ch.c} x ${ev}`).toBe(true);
            if (host) expect(ch.v.some(([n]) => n === host)).toBe(true);
          }
          // every English verse is either present or accounted for in `x`
          for (const n of english) expect(ch.v.some(([m]) => m === n) || String(n) in (ch.x ?? {}), `${v.id} ${b.id} ${ch.c}:${n}`).toBe(true);
        });
      }
    }
  });

  it('French versions follow the English numbering where the Hebrew differs', async () => {
    // Malachi 4 (Hebrew 3:19–24), Joel 2:28 (Hebrew 3:1), Daniel 4:1 (Hebrew 3:31), Job 41:1 (Hebrew 40:25)
    const first = async (book: string, c: number, v: number, id: 'LSG' | 'DARBY' | 'NCL' | 'OST') => (await scripture.getPassage(one(book, c, v), id)).chapters[0].verses[0].text;
    for (const id of ['LSG', 'DARBY', 'NCL', 'OST'] as const) {
      expect(await first('MAL', 4, 1, id)).toMatch(/^Car voici/);
      expect(await first('JOL', 3, 1, id)).toMatch(/^Car voici/);
      expect(await first('DAN', 4, 1, id)).toMatch(/(Nebucadnetsar|Nabuchodonosor|Nébucadnetsar)/);
      expect(await first('JOB', 41, 1, id)).toMatch(/(crocodile|Léviathan|léviathan)/);
    }
    // Psalm titles numbered as verse 1 become the superscription
    const ps51 = (await scripture.getPassage({ book: 'PSA', startChapter: 51 }, 'LSG')) as LocalPassage;
    expect(ps51.chapters[0].superscription).toMatch(/^Au chef des chantres\. Psaume de David\. Lorsque Nathan/);
    expect(ps51.chapters[0].verses[0].text).toMatch(/^O Dieu! Aie pitié de moi/);
    expect(ps51.chapters[0].verses).toHaveLength(19);
    // the Greek additions of the néo-Crampon are left out of Daniel 3 (3:24 is the king's astonishment)
    expect(await first('DAN', 3, 24, 'NCL')).toMatch(/^Alors le roi Nabuchodonosor fut dans la stupeur/);
  });

  it('a verse printed inside its neighbour is returned with it (Acts 19:41 in the Louis Segond)', async () => {
    const p = (await scripture.getPassage(one('ACT', 19, 41), 'LSG')) as LocalPassage;
    const [v] = p.chapters[0].verses;
    expect(v.ref.verse).toBe(40);
    expect(v.alsoCovers).toEqual([41]);
    expect(v.text).toMatch(/congédia l’assemblée/);
    const whole = (await scripture.getPassage({ book: 'ACT', startChapter: 19 }, 'LSG')) as LocalPassage;
    expect(whole.chapters[0].verses.map((x) => x.ref.verse)).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
    expect(whole.chapters[0].verses.at(-1)?.alsoCovers).toEqual([41]);
  });

  it('verses a version lacks are listed as missing', async () => {
    // Isaiah 64:1 is the end of 63:19 in the Hebrew numbering the French versions follow
    const p = (await scripture.getPassage({ book: 'ISA', startChapter: 64, startVerse: 1, endChapter: 64, endVerse: 2 }, 'LSG')) as LocalPassage;
    expect(p.chapters[0].verses.map((v) => v.ref.verse)).toEqual([2]);
    expect(p.chapters[0].missingVerses).toEqual([1]);
  });

  it('keeps footnotes and superscriptions where the source has them', async () => {
    const ps23 = (await scripture.getPassage({ book: 'PSA', startChapter: 23 }, 'BLIVRE')) as LocalPassage;
    expect(ps23.chapters[0].superscription).toBe('Salmo de Davi:');
    expect(ps23.chapters[0].verses[0].text).toBe('O SENHOR é meu pastor, nada me faltará.');
    expect(ps23.label).toBe('Salmo 23');
    const lsg = (await scripture.getPassage({ book: 'PSA', startChapter: 23 }, 'LSG')) as LocalPassage;
    expect(lsg.label).toBe('Psaume 23');
    expect(lsg.chapters[0].verses[0].poetryLines?.length).toBeGreaterThan(1);
  });
});

describe('OriginalTextProvider', () => {
  it('John 1:1 begins with Ἐν (G1722)', async () => {
    const [verse] = await originalText.getOriginalText({ book: 'JHN', startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 1 });
    expect(verse.language).toBe('greek');
    expect(verse.sourceId).toBe('stepbible-tagnt');
    const w = verse.words[0];
    expect(w).toMatchObject({ index: 0, surface: 'Ἐν', strong: 'G1722', transliteration: 'En', morph: 'PREP', morphDescription: 'Preposition', language: 'greek' });
    const logos = verse.words.find((x) => x.strong === 'G3056');
    expect(logos?.morphDescription).toBe('Noun, nominative singular masculine');
  });

  it('Psalm 23:1 contains the divine name (H3068), without cantillation marks', async () => {
    const [verse] = (await originalText.getOriginalText({ book: 'PSA', startChapter: 23, startVerse: 1, endChapter: 23, endVerse: 1 })) as LocalOriginalVerse[];
    expect(verse.language).toBe('hebrew');
    expect(verse.sourceId).toBe('stepbible-tahot');
    const yhwh = verse.words.find((w) => w.strong === 'H3068');
    expect(yhwh).toBeDefined();
    expect(yhwh!.extendedStrong).toBe('H3068G');
    expect(yhwh!.surface).toBe('יְהוָה'.normalize('NFC'));
    expect(verse.words.every((w) => !/[֑-ֽ֯]/.test(w.surface))).toBe(true);
    const shepherd = verse.words.find((w) => w.strong === 'H7462');
    expect(shepherd?.morphDescription).toMatch(/^Verb, Qal participle/);
  });

  it('keeps Psalm titles apart (verse 0)', async () => {
    const chapter = await originalText.getOriginalText({ book: 'PSA', startChapter: 23 });
    expect(chapter.map((v) => v.ref.verse)).toEqual([1, 2, 3, 4, 5, 6]);
    const sup = await (originalText as unknown as { getSuperscription(b: string, c: number): Promise<LocalOriginalVerse | null> }).getSuperscription('PSA', 23);
    expect(sup?.words.map((w) => w.strong)).toEqual(['H4210', 'H1732']);
  });

  it('marks Aramaic words (Daniel 2:4b)', async () => {
    const [verse] = await originalText.getOriginalText({ book: 'DAN', startChapter: 2, startVerse: 4, endChapter: 2, endVerse: 4 });
    expect(verse.words.some((w) => w.language === 'aramaic')).toBe(true);
    expect(verse.words.some((w) => w.language === 'hebrew')).toBe(true);
  });

  it('uses English/KJV versification (Rom 16:25–27 at the end of Romans 16)', async () => {
    const verses = await originalText.getOriginalText({ book: 'ROM', startChapter: 16, startVerse: 25, endChapter: 16, endVerse: 27 });
    expect(verses.map((v) => v.ref.verse)).toEqual([25, 26, 27]);
  });
});

describe('LexiconProvider', () => {
  it('G2631 κατάκριμα', async () => {
    const e = (await lexicon.getEntry('G2631')) as LocalLexiconEntry;
    expect(e).toMatchObject({ strong: 'G2631', lemma: 'κατάκριμα', transliteration: 'katakrima', gloss: 'condemnation', language: 'greek', sourceId: 'stepbible-tbesg' });
    expect(e.partOfSpeech).toBe('Noun (neuter)');
    expect(e.definition).toContain('Rom 5:16, 18; 8:1');
    expect(e.definition).not.toMatch(/<[^>]+>/);
  });

  it('normalises spellings and picks the right sense', async () => {
    expect((await lexicon.getEntry('g02631'))?.lemma).toBe('κατάκριμα');
    const shepherd = (await lexicon.getEntry('H7462')) as LocalLexiconEntry;
    expect(shepherd).toMatchObject({ strong: 'H7462', extendedStrong: 'H7462B', lemma: 'רָעָה'.normalize('NFC'), gloss: 'to pasture', sourceId: 'stepbible-tbesh' });
    expect(shepherd.otherSenses?.map((s) => s.extendedStrong)).toContain('H7462A');
    expect((await lexicon.getEntry('H7462A'))?.gloss).toBe('House of Shepherds');
    expect((await lexicon.getEntry('H0430G'))?.gloss).toBe('God');
  });

  it('returns null / omits unknown numbers', async () => {
    expect(await lexicon.getEntry('G99999')).toBeNull();
    expect(await lexicon.getEntry('grace')).toBeNull();
    const map = await lexicon.getEntries(['G5485', 'H3068', 'nope']);
    expect([...map.keys()]).toEqual(['G5485', 'H3068']);
    expect(map.get('G5485')?.lemma).toBe('χάρις');
  });

  it('occurrences of G2631: Rom 5:16, 5:18, 8:1', async () => {
    const occ = await lexicon.getOccurrences('G2631');
    expect(occ).toMatchObject({ strong: 'G2631', total: 3, sourceId: 'stepbible-tagnt' });
    expect(occ!.refs).toEqual([
      { book: 'ROM', chapter: 5, verse: 16 },
      { book: 'ROM', chapter: 5, verse: 18 },
      { book: 'ROM', chapter: 8, verse: 1 },
    ]);
  });

  it('limits occurrences but reports the full total', async () => {
    const occ = await lexicon.getOccurrences('G5485', 5);
    expect(occ!.refs).toHaveLength(5);
    expect(occ!.total).toBeGreaterThan(100);
    expect(occ!.refs[0].book).toBe('LUK'); // canonical order: χάρις first occurs in Luke 1:30
    expect(await lexicon.getOccurrences('G99999')).toBeNull();
  });

  it('separates senses when an extended tag is given', async () => {
    const all = await lexicon.getOccurrences('H7462');
    const pasture = await lexicon.getOccurrences('H7462B');
    expect(pasture!.total).toBeGreaterThan(100);
    expect(pasture!.total).toBeLessThan(all!.total);
    expect(pasture!.refs.some((r) => r.book === 'PSA' && r.chapter === 23 && r.verse === 1)).toBe(true);
  });
});

describe('CrossReferenceProvider', () => {
  it('Romans 8:1 → John 3:18–19 (OpenBible votes)', async () => {
    const refs = await crossReferences.getCrossReferences({ book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 1 });
    expect(refs.length).toBeGreaterThan(0);
    expect(refs.length).toBeLessThanOrEqual(15);
    expect(refs.map((r) => refKey(r.target))).toContain('JHN.3.18-19');
    expect(refs[0]).toMatchObject({ from: { book: 'ROM', chapter: 8, verse: 1 }, sourceId: 'openbible-xrefs' });
    expect(refs.every((r, i) => i === 0 || r.score <= refs[i - 1].score)).toBe(true);
  });

  it('applies limitPerVerse and minScore across a range', async () => {
    const refs = await crossReferences.getCrossReferences({ book: 'ROM', startChapter: 8 }, { limitPerVerse: 3, minScore: 20 });
    const perVerse = new Map<number, number>();
    for (const r of refs) perVerse.set(r.from.verse, (perVerse.get(r.from.verse) ?? 0) + 1);
    expect(Math.max(...perVerse.values())).toBeLessThanOrEqual(3);
    expect(refs.every((r) => r.score >= 20)).toBe(true);
    expect(await crossReferences.getCrossReferences({ book: 'XYZ', startChapter: 1 })).toEqual([]);
  });
});

describe('CommentaryProvider', () => {
  it('lists the five commentaries with their source ids', () => {
    expect(commentary.listCommentaries().map((c) => [c.id, c.sourceId, c.style, c.testaments.join('+')])).toEqual([
      ['tyndale', 'tyndale-open-study-notes', 'notes', 'OT+NT'],
      ['calvin', 'calvin-commentaries', 'classic', 'OT+NT'],
      ['matthew-henry', 'matthew-henry-commentary', 'classic', 'OT+NT'],
      ['jfb', 'jfb-commentary', 'classic', 'OT+NT'],
      ['keil-delitzsch', 'keil-delitzsch-commentary', 'classic', 'OT'],
    ]);
    expect(commentary.listCommentaries()[0].name).toBe('Tyndale Open Study Notes');
  });

  it('Tyndale note on Romans 8:1', async () => {
    const notes = await commentary.getCommentary('tyndale', { book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 1 });
    const note = notes.find((n) => n.ref.startChapter === 8 && n.ref.startVerse === 1);
    expect(note).toBeDefined();
    expect(note!.text).toMatch(/^So now there is no condemnation/);
    expect(note!.sourceId).toBe('tyndale-open-study-notes');
  });

  it('Tyndale covers Jude and Judges separately (the API copy mixes them up)', async () => {
    const jude = await commentary.getCommentary('tyndale', { book: 'JUD', startChapter: 1, endChapter: 1 });
    expect(jude.length).toBeGreaterThan(10);
    expect(jude.every((n) => n.ref.startChapter === 1 && (n.ref.endChapter ?? 1) === 1)).toBe(true);
    const judges = await commentary.getCommentary('tyndale', { book: 'JDG', startChapter: 21 });
    expect(judges.length).toBeGreaterThan(0);
  });

  it('Calvin on Romans 8 is clean: no Latin verse block, no footnote markers, no mangled characters', async () => {
    const sections = await commentary.getCommentary('calvin', { book: 'ROM', startChapter: 8 });
    expect(sections.length).toBeGreaterThan(5);
    expect(sections[0].ref).toEqual({ book: 'ROM', startChapter: 8, startVerse: 1, endChapter: 8, endVerse: 4 });
    const text = sections.map((s) => s.text).join('\n\n');
    expect(text).not.toContain('[237]');
    expect(text).not.toMatch(/Nulla igitur condemnatio|Lex enim Spiritus|Romans 8:1-4/);
    expect(text).toContain('There is then, etc.');
    for (const s of sections) expect(findTextDefects(s.text, { footnoteMarkers: true })).toEqual([]);
  });

  it('classic commentaries are bundled for the curated books', async () => {
    for (const id of ['calvin', 'matthew-henry', 'jfb']) {
      const s = await commentary.getCommentary(id, { book: 'JHN', startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 1 });
      expect(s.length, id).toBeGreaterThan(0);
    }
    const kd = await commentary.getCommentary('keil-delitzsch', { book: 'PSA', startChapter: 23 });
    expect(kd.length).toBeGreaterThan(0);
    expect(await commentary.getCommentary('keil-delitzsch', { book: 'ROM', startChapter: 8 })).toEqual([]);
    expect(await commentary.getCommentary('nope', { book: 'ROM', startChapter: 8 })).toEqual([]);
  });

  it('non-bundled books return [] when the remote fallback is disabled', async () => {
    expect(await commentary.getCommentary('calvin', { book: 'ACT', startChapter: 2 })).toEqual([]);
  });

  it('fetches non-bundled chapters live and cleans them like the bundle', async () => {
    const calvinChapter = {
      chapter: {
        number: 2,
        content: [
          {
            type: 'verse',
            number: 1,
            content: [
              'Acts 2:1-4\n\n1. And when the days of Pentecost were fulfilled, they were all with one accord in one place. [83]\n\n1. Et quum complerentur dies Pentecostes, erant omnes unanimiter in eodem loco.\n\n1. When the days were fulfilled. This feast of Pentecost is so called of the number of fifty days.\n\nFootnotes:\n\n[83] A footnote.',
            ],
          },
        ],
      },
    };
    const remoteFetch = vi.fn(async (url: string | URL | Request) => {
      if (String(url) === 'https://bible.helloao.org/api/c/john-calvin/ACT/2.json') return new Response(JSON.stringify(calvinChapter), { status: 200 });
      return new Response('not found', { status: 404 });
    });
    const live = createLocalDatasetProviders({ loader: createFsLoader(), remoteFetch: remoteFetch as unknown as typeof fetch });
    const sections = await live.commentary.getCommentary('calvin', { book: 'ACT', startChapter: 2, startVerse: 1, endChapter: 2, endVerse: 3 });
    expect(remoteFetch).toHaveBeenCalledTimes(1);
    expect(sections).toEqual([
      {
        commentaryId: 'calvin',
        ref: { book: 'ACT', startChapter: 2, startVerse: 1, endChapter: 2, endVerse: 4 },
        text: '1. When the days were fulfilled. This feast of Pentecost is so called of the number of fifty days.',
        sourceId: 'calvin-commentaries',
      },
    ]);
    // cached: a second call does not refetch; books the source never covered are not requested
    await live.commentary.getCommentary('calvin', { book: 'ACT', startChapter: 2 });
    expect(remoteFetch).toHaveBeenCalledTimes(1);
    expect(await live.commentary.getCommentary('calvin', { book: 'JOB', startChapter: 1 })).toEqual([]);
    expect(remoteFetch).toHaveBeenCalledTimes(1);
  });

  it('rejects (rather than claiming "no comment") when the live fallback is unreachable', async () => {
    const offline = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    const live = createLocalDatasetProviders({ loader: createFsLoader(), remoteFetch: offline as unknown as typeof fetch });
    await expect(live.commentary.getCommentary('calvin', { book: 'ACT', startChapter: 3 })).rejects.toThrow('Failed to fetch');
    // not cached: once back online the chapter is requested again
    await expect(live.commentary.getCommentary('calvin', { book: 'ACT', startChapter: 3 })).rejects.toThrow();
    expect(offline).toHaveBeenCalledTimes(2);
  });
});

describe('HistoricalContextProvider', () => {
  it('Romans introduction', async () => {
    const intro = (await historicalContext.getBookIntroduction('ROM')) as LocalBookIntroduction;
    expect(intro.text.startsWith('Romans has been called')).toBe(true);
    expect(intro.text).toContain('\n\nSetting\n\n');
    expect(intro.sourceId).toBe('tyndale-open-study-notes');
    expect(intro.summary).toMatch(/Purpose/);
  });

  it('all 66 books have an introduction (Judges included)', async () => {
    for (const b of BOOKS) {
      const intro = await historicalContext.getBookIntroduction(b.id);
      expect(intro?.text.length, b.id).toBeGreaterThan(500);
    }
    expect((await historicalContext.getBookIntroduction('JDG'))?.text).toMatch(/Judges/);
    expect((await historicalContext.getBookIntroduction('JUD'))?.text).toMatch(/^The very brief letter of Jude/);
    expect(await historicalContext.getBookIntroduction('XYZ')).toBeNull();
  });
});

describe('DataLoader', () => {
  it('fetch loader: 404 and HTML fallbacks resolve to null; requests are deduplicated', async () => {
    const fetchImpl = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.endsWith('missing.json')) return new Response('nope', { status: 404 });
      if (u.endsWith('spa.json')) return new Response('<!doctype html>', { status: 200, headers: { 'content-type': 'text/html' } });
      return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const loader = createFetchLoader('/base/data/', fetchImpl as unknown as typeof fetch);
    const [a, b] = await Promise.all([loader.json('x.json'), loader.json('x.json')]);
    expect(a).toEqual({ ok: true });
    expect(b).toBe(a);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0][0]).toBe('/base/data/x.json');
    expect(await loader.json('missing.json')).toBeNull();
    expect(await loader.json('spa.json')).toBeNull();
  });

  it('providers read each file once', async () => {
    const loader = createFsLoader();
    const p = createLocalDatasetProviders({ loader, allowRemoteFallback: false });
    await Promise.all([
      p.scripture.getPassage({ book: 'EPH', startChapter: 1 }, 'BSB'),
      p.scripture.getPassage({ book: 'EPH', startChapter: 2 }, 'BSB'),
      p.scripture.getVerseCount('EPH', 3),
    ]);
    expect(loader.reads.filter((r) => r === 'bible/bsb/EPH.json')).toHaveLength(1);
  });
});
