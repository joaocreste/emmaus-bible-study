import type { Author } from '../../domain/models';

/**
 * Authors referenced by more than one curated module, defined ONCE here.
 * Merge order in the SourceRegistry: base → shared → curated modules.
 *
 * Matthew Henry’s Commentary: Henry died in 1714 having reached the end of Acts.
 * Romans–Revelation were completed by other Nonconformist ministers (list in the
 * preface to vol. 6, after J. B. Williams’s Memoirs of Matthew Henry, p. 308 —
 * https://ccel.org/ccel/henry/mhc6.html). Text from those books is attributed to
 * the continuator who wrote it (sourceId stays 'matthew-henry-commentary').
 */
export const SHARED_AUTHORS: Author[] = [
  /* ---------- Early church ---------- */
  {
    id: 'irenaeus',
    name: 'Irenaeus of Lyons',
    lifespan: '2nd century (d. after c. 191)',
    era: 'early-church',
    tradition: 'Greek Church Father',
    description:
      'Bishop of Lugdunum (Lyon) in Gaul, from Smyrna in Asia Minor, who had heard Polycarp preach; his Against Heresies (c. 180) opposed Gnosticism and shaped early Christian theology.',
    aliases: ['irenaeus', 'st irenaeus', 'irenaeus of lyons', 'irenaeus of lyon'],
    url: 'https://en.wikipedia.org/wiki/Irenaeus',
  },

  /* ---------- Medieval ---------- */
  {
    id: 'john-of-damascus',
    name: 'John of Damascus',
    lifespan: 'c. 675–749',
    era: 'medieval',
    tradition: 'Greek Church Father (Eastern Orthodox)',
    description:
      'Monk of Mar Saba near Jerusalem and defender of icons, whose Fount of Knowledge, including An Exact Exposition of the Orthodox Faith, summarised Greek patristic theology.',
    aliases: ['john of damascus', 'john damascene', 'damascene', 'st john of damascus'],
  },

  /* ---------- Reformation ---------- */
  {
    id: 'jacobus-arminius',
    name: 'Jacobus Arminius',
    lifespan: '1560–1609',
    era: 'reformation',
    tradition: 'Dutch Reformed (Remonstrant)',
    description:
      'Dutch theologian at Leiden whose followers, after his death, issued the Remonstrance of 1610 on election and grace; the namesake of Arminian theology.',
    aliases: ['arminius', 'jacobus arminius', 'jacob arminius'],
  },

  /* ---------- Post-Reformation: continuators of Matthew Henry’s Commentary ---------- */
  {
    id: 'john-evans',
    name: 'John Evans',
    lifespan: 'c. 1680–1730',
    era: 'post-reformation',
    tradition: 'English Presbyterian (Nonconformist)',
    description:
      'Welsh-born Presbyterian minister who succeeded Daniel Williams at Hand Alley, London, in 1716; after Matthew Henry’s death he wrote the exposition of Romans that completed Henry’s Commentary.',
    aliases: ['john evans'],
    url: 'https://biography.wales/article/s-EVAN-JOH-1680',
  },
  {
    id: 'daniel-mayo',
    name: 'Daniel Mayo',
    lifespan: 'c. 1672–1733',
    era: 'post-reformation',
    tradition: 'English Presbyterian (Nonconformist)',
    description:
      'Presbyterian minister at Kingston upon Thames and later in Hackney and Silver Street, London; after Matthew Henry’s death in 1714 he wrote the exposition of 2 Corinthians and 1–2 Thessalonians that completed Henry’s Commentary.',
    aliases: ['daniel mayo', 'mayo'],
    url: 'https://en.wikisource.org/wiki/Dictionary_of_National_Biography,_1885-1900/Mayo,_Daniel',
  },

  /* ---------- Modern ---------- */
  {
    id: 'charles-hodge',
    name: 'Charles Hodge',
    lifespan: '1797–1878',
    era: 'modern',
    tradition: 'Reformed (Presbyterian)',
    description: 'Principal of Princeton Theological Seminary and author of a three-volume Systematic Theology (1871–1873).',
    aliases: ['hodge', 'charles hodge'],
  },
  {
    id: 'bb-warfield',
    name: 'B. B. Warfield',
    lifespan: '1851–1921',
    era: 'modern',
    tradition: 'Reformed (Presbyterian)',
    description: 'Professor of theology at Princeton Theological Seminary and a leading defender of Reformed orthodoxy and biblical inerrancy.',
    aliases: ['warfield', 'b. b. warfield', 'bb warfield', 'benjamin warfield'],
  },
];
