import { describe, expect, it } from 'vitest';
import { BASE_AUTHORS } from '../../../data/registry/base-authors';
import { citationAuthorName, cleanLocator, displayYear, localizeYear } from '../attribution';

const name = (n: string, shortName?: string) => citationAuthorName({ name: n, shortName });

describe('citationAuthorName', () => {
  it('uses the surname of ordinary names', () => {
    expect(name('Charles H. Spurgeon')).toBe('Spurgeon');
    expect(name('Timothy Keller')).toBe('Keller');
    expect(name('C. S. Lewis')).toBe('Lewis');
    expect(name('David A. deSilva')).toBe('deSilva');
    expect(name('Flavius Josephus')).toBe('Josephus');
    expect(name('Rashi')).toBe('Rashi');
    expect(name('Martin Luther King Jr.')).toBe('King');
    expect(name('Ludwig van Beethoven')).toBe('van Beethoven');
  });

  it('never turns a place or epithet into the author', () => {
    expect(name('Augustine of Hippo')).toBe('Augustine of Hippo');
    expect(name('John of Damascus')).toBe('John of Damascus');
    expect(name('Irenaeus of Lyons')).toBe('Irenaeus of Lyons');
    expect(name('Photius I of Constantinople')).toBe('Photius I of Constantinople');
    expect(name('Justin Martyr')).toBe('Justin Martyr');
    expect(name('John Chrysostom')).toBe('Chrysostom');
    expect(name('Gregory the Great')).toBe('Gregory the Great');
  });

  it('prefers a curated short name', () => {
    expect(name('Augustine of Hippo', 'Augustine')).toBe('Augustine');
  });

  it('lists every member of a team', () => {
    expect(name('C. F. Keil & Franz Delitzsch')).toBe('Keil & Delitzsch');
    expect(name('Jamieson, Fausset & Brown')).toBe('Jamieson, Fausset & Brown');
  });

  it('gives every registry author a name that is part of their full name', () => {
    for (const a of BASE_AUTHORS) {
      const short = citationAuthorName(a);
      expect(short.length).toBeGreaterThan(1);
      for (const part of short.split(/,\s*|\s*&\s*/)) expect(a.name).toContain(part);
    }
  });
});

describe('displayYear', () => {
  it('flattens a parenthetical inside the year', () => {
    expect(displayYear('c. 421 (English trans. 1887)')).toBe('c. 421; English trans. 1887');
    expect(displayYear('1540–1564 (English trans. 1843–1855)')).toBe('1540–1564; English trans. 1843–1855');
    expect(displayYear('2016')).toBe('2016');
    expect(displayYear(undefined)).toBeUndefined();
    expect(displayYear('  ')).toBeUndefined();
  });
});

describe('cleanLocator', () => {
  it('drops the work title repeated at the start of a locator', () => {
    expect(cleanLocator('The Treasury of David, Psalm 23, Exposition, v1', { title: 'The Treasury of David' })).toBe(
      'Psalm 23, Exposition, v1',
    );
    expect(cleanLocator('Enchiridion, ch. 11', { title: 'Enchiridion (Handbook on Faith, Hope and Love)' })).toBe('ch. 11');
    expect(cleanLocator('“The Glory of the Incarnation,” 11 December 2016', { title: 'The Glory of the Incarnation', year: '2016' })).toBe(
      '11 December 2016',
    );
  });

  it('drops a repeated year and keeps everything else', () => {
    expect(cleanLocator('ch. 3 (1552)', { title: 'Institutes', year: '1552' })).toBe('ch. 3');
    expect(cleanLocator('on Rom 8:1', { title: 'Commentary on Romans' })).toBe('on Rom 8:1');
    // a title that only appears later in the locator is left alone
    expect(cleanLocator('Commentary on Romans 8', { title: 'Romans' })).toBe('Commentary on Romans 8');
    expect(cleanLocator('The Treasury of David', { title: 'The Treasury of David' })).toBeUndefined();
    expect(cleanLocator(undefined, { title: 'x' })).toBeUndefined();
  });
});

describe('years in other languages', () => {
  it('translates only the English metadata words', () => {
    expect(displayYear('c. 421 (English trans. 1887)', 'pt')).toBe('c. 421; trad. inglesa 1887');
    expect(displayYear('c. 421 (English trans. 1887)', 'fr')).toBe('v. 421; trad. anglaise 1887');
    expect(localizeYear('4th century (English trans. 1892)', 'es')).toBe('siglo IV (trad. inglesa 1892)');
    expect(localizeYear('8th century', 'fr')).toBe('VIIIe siècle');
    expect(localizeYear('1611 (1769 Oxford text)', 'pt')).toBe('1611 (1769 Oxford text)');
    expect(localizeYear('c. 421 (English trans. 1887)', 'en')).toBe('c. 421 (English trans. 1887)');
  });
});

