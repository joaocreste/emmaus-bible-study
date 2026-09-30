/**
 * Reader vocabulary → the headings the 19th-century topical indexes use.
 *
 * Nave’s (1896) and Torrey’s (1897) file subjects under the English of their day:
 * a reader asking about “anxiety” finds Nave’s CARE, “depression” DESPONDENCY,
 * “greed” COVETOUSNESS. This table only widens the topic LOOKUP — every result is
 * still an entry that exists in the index, returned with its own references — so
 * it cannot introduce content. Keep it to plain vocabulary shifts; subjects the
 * indexes file under the same word need no entry (their own “See …” redirects are
 * already folded into each topic’s keywords by scripts/kb/topics.ts).
 */
export const READER_TERMS: Readonly<Record<string, readonly string[]>> = {
  anxiety: ['care'],
  anxious: ['care'],
  worry: ['care'],
  worrying: ['care'],
  stress: ['care'],
  depression: ['despondency', 'afflictions and adversities'],
  despair: ['despondency'],
  money: ['riches'],
  wealth: ['riches'],
  finances: ['money', 'riches'],
  greed: ['covetousness'],
  lying: ['falsehood'],
  lies: ['falsehood', 'lying'],
  dishonesty: ['falsehood', 'dishonesty'],
  alcohol: ['drunkenness', 'wine'],
  drinking: ['drunkenness'],
  grief: ['mourning', 'sorrow'],
  work: ['industry', 'labor'],
  job: ['industry', 'labor'],
  suffering: ['afflictions and adversities', 'afflictions'],
  remarriage: ['divorce', 'marriage'],
  generosity: ['liberality', 'giving'],
  doubt: ['doubting', 'unbelief'],
  doubts: ['doubting', 'unbelief'],
  // Nave’s files the texts on same-sex relations under SODOMY (Lev 18:22; Rom 1:26–27; 1 Cor 6:9 …)
  homosexuality: ['sodomy'],
  homosexual: ['sodomy'],
  'same sex': ['sodomy'],
  'same sex relations': ['sodomy'],
  'same sex marriage': ['sodomy', 'marriage'],
};

/** Index headings to look up for a (normalised) reader query, the query itself excluded. */
export function readerTermExpansions(normalizedQuery: string): string[] {
  const direct = READER_TERMS[normalizedQuery] ?? [];
  const words = normalizedQuery.split(' ').filter(Boolean);
  const perWord = words.length > 1 ? words.flatMap((w) => READER_TERMS[w] ?? []) : [];
  return [...new Set([...direct, ...perWord])].filter((t) => t !== normalizedQuery);
}

/**
 * Reader vocabulary → the older words the confessions, catechisms and dictionaries use
 * for the same subject ("divorce" → "put away", "bond of matrimony"). A full-text search
 * for the reader's word also looks these up (at a lower weight), so a tradition's own
 * statement surfaces even when it never uses the modern word. Like READER_TERMS this
 * only widens retrieval: every hit is still a document that exists.
 */
export const SEARCH_TERMS: Readonly<Record<string, readonly string[]>> = {
  divorce: ['bond of matrimony', 'marriage dissolved', 'desertion', 'separation from bed and board', 'innocent party', 'put away his wife', 'bill of divorcement'],
  remarriage: ['marry another', 'second marriage', 'innocent party'],
  anxiety: ['careful', 'cares of this life', 'providence', 'daily bread', 'heart troubled', 'fear and anxiety'],
  anxious: ['careful', 'cares of this life', 'providence', 'heart troubled'],
  worry: ['careful', 'cares of this life', 'providence', 'heart troubled'],
  predestination: ['election', 'reprobation', 'decree of god', 'foreknowledge'],
  election: ['predestination', 'reprobation', 'decree of god'],
  baptism: ['baptized', 'sacrament of baptism', 'infants baptized'],
  death: ['state of men after death', 'resurrection of the dead', 'souls of the righteous', 'purgatory'],
  heaven: ['state of men after death', 'souls of the righteous', 'life everlasting'],
  hell: ['everlasting punishment', 'eternal punishment', 'state of men after death'],
  wealth: ['riches', 'covetousness', 'mammon'],
  rich: ['riches', 'covetousness', 'mammon'],
  riches: ['covetousness', 'mammon'],
  women: ['women keep silence', 'deaconess', 'ordination'],
  ordination: ['holy orders', 'sacrament of order', 'ministers'],
  justification: ['justified by faith', 'imputed righteousness'],
  eucharist: ["lord's supper", 'real presence', 'sacrament of the altar'],
  communion: ["lord's supper", 'sacrament of the altar'],
};

/** Older phrasings to search alongside a (normalised) reader query, the query itself excluded. */
export function searchTermExpansions(normalizedQuery: string): string[] {
  const words = normalizedQuery.split(' ').filter(Boolean);
  const out = new Set<string>([...(SEARCH_TERMS[normalizedQuery] ?? []), ...words.flatMap((w) => SEARCH_TERMS[w] ?? [])]);
  out.delete(normalizedQuery);
  return [...out].slice(0, 8);
}
