import type { Source } from '../../domain/models';

/**
 * Works cited by more than one curated module (studies and topic-index entries),
 * defined ONCE here so every module shares a single, accurate definition.
 *
 * Merge order in the SourceRegistry: base → shared → curated modules, so these
 * definitions win over any module that still declares the same id.
 *
 * Editions matter. Where two printed editions/translations of a work differ in
 * wording, each has its own id and a citation must use the edition it was read
 * in (and any quotation must match that edition verbatim):
 *   - council-of-trent-session-6        Waterworth (1848), Hanover Historical Texts Project
 *     council-of-trent-session-6-schaff Schaff, Creeds of Christendom vol. 2 (CCEL)
 *   - canons-of-dort                    Schaff, Creeds of Christendom vol. 3 (public domain)
 *     canons-of-dort-crcna-2011         CRCNA 2011 translation (copyrighted — summarise only, never quote)
 *   - formula-of-concord                Triglot Concordia (1921), BookOfConcord.org
 *     formula-of-concord-schaff         Epitome in Schaff, Creeds of Christendom vol. 3 (CCEL)
 *   - nicene-creed                      Schaff, Creeds of Christendom vol. 2 (texts of 325 and 381)
 *     nicene-creed-percival             Percival, NPNF² vol. 14 (the creed of 381), New Advent
 *   - westminster-confession            Orthodox Presbyterian Church online text
 *     westminster-confession-schaff     Schaff, Creeds of Christendom vol. 3 (with the American revisions noted)
 */
export const SHARED_SOURCES: Source[] = [
  {
    id: 'catechism-catholic-church',
    type: 'catechism',
    title: 'Catechism of the Catholic Church',
    authorIds: [],
    year: '1992',
    edition: 'Second edition (English translation 1994; revised 1997)',
    publisher: 'Libreria Editrice Vaticana',
    url: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM',
    license: { status: 'copyrighted', name: '© Libreria Editrice Vaticana', usage: 'summary-only' },
    description:
      'The official compendium of Catholic doctrine promulgated by John Paul II; paragraph numbers are cited (e.g. §§309–314 on providence and evil, §§1987–2029 on grace and justification).',
  },
  /* ---------------- Bible editions ---------------- */
  {
    id: 'lxx-brenton',
    type: 'original-text',
    title: 'Septuagint (Greek Old Testament), Brenton edition',
    authorIds: [],
    url: 'https://ebible.org/Scriptures/details.php?id=grcbrent',
    edition:
      'The Greek Septuagint with Apocrypha compiled by Sir Lancelot C. L. Brenton, with Brenton’s English translation (first published 1844), as distributed by eBible.org',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The ancient Greek translation of the Old Testament used by the New Testament writers and the early church; an early witness to how the Hebrew was read. Its Psalm numbering differs from the Hebrew (Psalm 23 is its Psalm 22).',
  },
  {
    id: 'clementine-vulgate',
    type: 'bible-translation',
    title: 'Clementine Vulgate (Latin Bible)',
    authorIds: [],
    url: 'https://ebible.org/Scriptures/details.php?id=latVUC',
    edition:
      'Clementine edition, as distributed by eBible.org. Its Psalm numbering follows the Septuagint (Psalm 23 is Psalm 22).',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The standard Latin Bible of the Western church, descended from Jerome’s Vulgate; in the Psalms it follows the Septuagint’s reading at several points.',
  },

  /* ---------------- Creeds & confessions ---------------- */
  {
    id: 'nicene-creed',
    type: 'creed',
    title: 'Nicene Creed (Nicaea 325; Constantinople 381)',
    authorIds: [],
    year: '325 / 381',
    url: 'https://ccel.org/ccel/schaff/creeds2/creeds2.iv.i.ii.ii.html',
    edition: 'Texts of 325 and 381 in Philip Schaff, The Creeds of Christendom, vol. 2, via CCEL',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The creed of the first two ecumenical councils, confessing the Son as “begotten, not made,” shared by Catholic, Orthodox and Protestant churches.',
  },
  {
    id: 'nicene-creed-percival',
    type: 'creed',
    title: 'The Nicene-Constantinopolitan Creed',
    authorIds: [],
    year: '381',
    publisher: 'First Council of Constantinople',
    url: 'https://www.newadvent.org/fathers/3808.htm',
    edition: 'Trans. Henry R. Percival, Nicene and Post-Nicene Fathers, 2nd series, vol. 14 (1900), via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The creed of the Council of Constantinople (381), expanding the Creed of Nicaea (325); confessed by Orthodox, Catholic and most Protestant churches.',
  },
  {
    id: 'augsburg-confession',
    type: 'confession',
    title: 'The Augsburg Confession',
    authorIds: [],
    year: '1530',
    url: 'https://bookofconcord.org/augsburg-confession/',
    edition: 'English text of the Triglot Concordia (1921), via BookOfConcord.org',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'The foundational confession of the Lutheran churches, presented at the Diet of Augsburg in 1530.',
  },
  {
    id: 'formula-of-concord',
    type: 'confession',
    title: 'The Formula of Concord',
    authorIds: [],
    year: '1577',
    url: 'https://bookofconcord.org/epitome/',
    edition: 'English text of the Triglot Concordia (1921), via BookOfConcord.org',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'Lutheran confession settling doctrinal disputes after Luther’s death, in an Epitome and a Solid Declaration; part of the Book of Concord (1580).',
  },
  {
    id: 'formula-of-concord-schaff',
    type: 'confession',
    title: 'The Formula of Concord (Epitome)',
    authorIds: [],
    year: '1577',
    url: 'https://ccel.org/ccel/schaff/creeds3/creeds3.iii.iv.html',
    edition: 'Epitome, Latin and English, in Philip Schaff, The Creeds of Christendom, vol. 3, via CCEL',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The Lutheran confession that settled intra-Lutheran controversies; Article XI of the Epitome treats the eternal predestination and election of God and cites Romans 8:30.',
  },
  {
    id: 'council-of-trent-session-6',
    type: 'confession',
    title: 'Council of Trent, Session VI: Decree on Justification',
    authorIds: [],
    year: '1547',
    url: 'https://history.hanover.edu/texts/trent/ct06.html',
    edition: 'Trans. J. Waterworth (London: Dolman, 1848), via Hanover Historical Texts Project',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The Catholic Church’s definitive teaching on justification, celebrated on 13 January 1547, with sixteen chapters and thirty-three canons.',
  },
  {
    id: 'council-of-trent-session-6-schaff',
    type: 'confession',
    title: 'Council of Trent, Sixth Session: Decree on Justification',
    authorIds: [],
    year: '1547',
    publisher: 'Council of Trent',
    url: 'https://ccel.org/ccel/schaff/creeds2/creeds2.v.i.i.iv.html',
    edition: 'Latin and English in Philip Schaff, The Creeds of Christendom, vol. 2, via CCEL',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The Catholic Church’s definitive teaching on justification, grace, predestination and perseverance in response to the Reformation.',
  },
  {
    id: 'articles-of-remonstrance',
    type: 'confession',
    title: 'The Five Articles of Remonstrance',
    authorIds: [],
    year: '1610',
    url: 'https://archive.org/details/creedschristendo03scha',
    edition:
      'English translation in Philip Schaff, The Creeds of Christendom, vol. 3, 4th ed., revised and enlarged (New York: Harper & Brothers; © 1877), pp. 545–549 (“The Five Arminian Articles”); also on CCEL',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'Five articles drawn up in 1610 by Dutch followers of Jacobus Arminius, setting out conditional election, universal atonement and resistible grace; answered by the Synod of Dort.',
  },
  {
    id: 'canons-of-dort',
    type: 'confession',
    title: 'The Canons of the Synod of Dort',
    authorIds: [],
    year: '1619',
    publisher: 'Synod of Dort',
    url: 'https://ccel.org/ccel/schaff/creeds3/creeds3.iv.xvi.html',
    edition: 'Latin and English in Philip Schaff, The Creeds of Christendom, vol. 3, via CCEL',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The Reformed churches’ answer to the Remonstrants, from divine election (First Head of Doctrine) to the perseverance of the saints (Fifth Head); a doctrinal standard of Reformed churches of Dutch heritage.',
  },
  {
    id: 'canons-of-dort-crcna-2011',
    type: 'confession',
    title: 'Canons of Dort (CRCNA translation)',
    authorIds: [],
    year: '1619',
    publisher: 'Synod of Dort (Dordrecht)',
    url: 'https://www.crcna.org/welcome/beliefs/confessions/canons-dort',
    edition: 'Modern English translation approved by Synod 2011 of the Christian Reformed Church in North America, linked for reading',
    license: {
      status: 'copyrighted',
      name: 'Translation © 2011, Faith Alive Christian Resources, Christian Reformed Church in North America',
      url: 'https://www.crcna.org/welcome/beliefs/confessions/canons-dort',
      usage: 'summary-only',
      attribution: 'The 1619 Canons are public domain, but this English translation is copyrighted; Emmaus summarises it and never reproduces its wording.',
    },
    description:
      'The Synod of Dort’s five “main points of doctrine” answering the Remonstrants; a doctrinal standard of Reformed churches of Dutch heritage.',
  },
  {
    id: 'westminster-confession',
    type: 'confession',
    title: 'Westminster Confession of Faith',
    authorIds: [],
    year: '1646',
    publisher: 'Westminster Assembly',
    url: 'https://www.opc.org/wcf.html',
    edition: 'Text as published online by the Orthodox Presbyterian Church',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'Reformed confession completed by the Westminster Assembly in 1646; the subordinate doctrinal standard of the Church of Scotland and most Presbyterian churches.',
  },
  {
    id: 'westminster-confession-schaff',
    type: 'confession',
    title: 'Westminster Confession of Faith',
    authorIds: [],
    year: '1646',
    publisher: 'Westminster Assembly',
    url: 'https://ccel.org/ccel/schaff/creeds3/creeds3.iv.xvii.ii.html',
    edition: 'English and Latin in Philip Schaff, The Creeds of Christendom, vol. 3, with the American revisions noted, via CCEL',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'The principal confession of Presbyterian churches, completed by the Westminster Assembly in 1646; chapter 3, “Of God’s Eternal Decree”, cites Romans 8:30.',
  },
  {
    id: 'methodist-articles-of-religion',
    type: 'confession',
    title: 'Articles of Religion (Methodist)',
    authorIds: ['wesley'],
    year: '1784',
    publisher: 'The United Methodist Church (current text)',
    url: 'https://www.umc.org/en/content/articles-of-religion',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'Wesley abridged the Church of England’s Thirty-Nine Articles to twenty-four and sent them to American Methodists, who added a twenty-fifth (“Of the Rulers of the United States of America”) and adopted them at the Christmas Conference of 1784.',
  },
  {
    id: 'confession-of-dositheus',
    type: 'confession',
    title: 'The Confession of Dositheus (Decrees of the Synod of Jerusalem)',
    authorIds: [],
    year: '1672',
    publisher: 'Synod of Jerusalem',
    url: 'https://archive.org/details/actsdecreesofsyn00orth',
    edition: 'Trans. J. N. W. B. Robertson, The Acts and Decrees of the Synod of Jerusalem (London: Thomas Baker, 1899)',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'Eighteen decrees of an Eastern Orthodox synod held under Patriarch Dositheus of Jerusalem, answering a Calvinist confession circulated under the name of Cyril Lucar.',
  },
  {
    id: 'joint-declaration-justification',
    type: 'confession',
    title: 'Joint Declaration on the Doctrine of Justification',
    authorIds: [],
    year: '1999',
    publisher: 'Lutheran World Federation and the Catholic Church (Pontifical Council for Promoting Christian Unity)',
    url: 'https://www.christianunity.va/content/unitacristiani/en/dialoghi/sezione-occidentale/luterani/dialogo/documenti-di-dialogo/1999-dichiarazione-congiunta-sulla-dottrina-della-giustificazion/en.html',
    license: {
      status: 'copyrighted',
      name: '© Lutheran World Federation and Pontifical Council for Promoting Christian Unity',
      usage: 'summary-only',
    },
    description:
      'Ecumenical agreement signed in Augsburg on 31 October 1999, stating a consensus in basic truths of the doctrine of justification; later affirmed by the World Methodist Council (2006), the Anglican Consultative Council (2016) and the World Communion of Reformed Churches (2017).',
  },
  {
    id: 'lwf-jddj',
    type: 'website',
    title: 'Joint Declaration on the Doctrine of Justification (JDDJ) — Lutheran World Federation',
    authorIds: [],
    publisher: 'Lutheran World Federation',
    url: 'https://lutheranworld.org/what-we-do/unity-church/joint-declaration-doctrine-justification-jddj',
    license: { status: 'copyrighted', name: '© Lutheran World Federation', usage: 'summary-only' },
    description: 'The LWF’s page on the Declaration and its later affirmation by Methodist, Anglican and Reformed communions.',
  },

  /* ---------------- Church fathers & medieval theology ---------------- */
  {
    id: 'irenaeus-against-heresies',
    type: 'book',
    title: 'Against Heresies',
    authorIds: ['irenaeus'],
    year: 'c. 180 (English trans. 1885)',
    publisher: 'Christian Literature Publishing Co. (Ante-Nicene Fathers, vol. 1)',
    url: 'https://www.newadvent.org/fathers/0103.htm',
    edition: 'Trans. Alexander Roberts and William Rambaut, Ante-Nicene Fathers, vol. 1 (1885); revised and edited for New Advent by Kevin Knight',
    license: { status: 'public-domain', name: 'Public domain (1885 translation)', usage: 'full-text' },
    description:
      'Irenaeus’s five-book refutation of Gnosticism and exposition of the apostolic faith: Book III contains early testimony about the origin of the four Gospels, Book IV his account of humanity growing toward the likeness of God, and Book V ends with his hope for the kingdom.',
  },
  {
    id: 'athanasius-on-the-incarnation',
    type: 'book',
    title: 'On the Incarnation of the Word',
    authorIds: ['athanasius'],
    year: '4th century (English trans. 1892)',
    publisher: 'Christian Literature Publishing Co. (Nicene and Post-Nicene Fathers, Second Series, vol. 4)',
    url: 'https://www.newadvent.org/fathers/2802.htm',
    edition: 'Trans. Archibald Robertson, Nicene and Post-Nicene Fathers, Second Series, vol. 4 (1892); revised and edited for New Advent by Kevin Knight',
    license: { status: 'public-domain', name: 'Public domain (1892 translation)', usage: 'full-text' },
    description:
      'Athanasius’s classic account of why the Word, through whom God made the world, became human: to rescue a humanity sliding into corruption, to conquer death and to renew creation.',
  },
  {
    id: 'augustine-city-of-god',
    type: 'book',
    title: 'The City of God',
    authorIds: ['augustine'],
    year: 'c. 413–426',
    url: 'https://www.newadvent.org/fathers/1201.htm',
    edition: 'Trans. Marcus Dods, Nicene and Post-Nicene Fathers, First Series, vol. 2 (1887); revised and edited for New Advent by Kevin Knight',
    license: { status: 'public-domain', name: 'Public domain (1887 translation)', usage: 'full-text' },
    description:
      'Augustine’s monumental defence of Christianity against pagan critics and account of the two cities; Book X engages the Platonists on the incarnation, and Book XX treats the last judgement and the thousand years of Revelation 20.',
  },
  {
    id: 'john-of-damascus-exposition',
    type: 'book',
    title: 'An Exposition of the Orthodox Faith (De Fide Orthodoxa)',
    authorIds: ['john-of-damascus'],
    year: '8th century',
    url: 'https://www.newadvent.org/fathers/3304.htm',
    edition: 'Trans. E. W. Watson and L. Pullan, Nicene and Post-Nicene Fathers, 2nd series, vol. 9 (1899), via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'A systematic summary of Greek patristic theology that remains a standard reference for Eastern Orthodox teaching; Book II, chapter 30, treats prescience and predestination.',
  },
  {
    id: 'aquinas-summa-theologiae',
    type: 'book',
    title: 'Summa Theologiae',
    authorIds: ['aquinas'],
    year: '1265–1274',
    url: 'https://www.newadvent.org/summa/',
    edition: 'Trans. Fathers of the English Dominican Province, 2nd rev. ed. (1920), via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description: 'Thomas Aquinas’s unfinished synthesis of theology, foundational for Catholic teaching.',
  },

  /* ---------------- Reference works ---------------- */
  {
    id: 'catholic-encyclopedia-predestination',
    type: 'encyclopedia',
    title: 'Predestination (The Catholic Encyclopedia, vol. 12)',
    authorIds: [],
    year: '1911',
    publisher: 'Robert Appleton Company',
    url: 'https://www.newadvent.org/cathen/12378a.htm',
    edition: 'Article by Joseph Pohle, via New Advent',
    license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
    description:
      'A Catholic account of the doctrine of predestination, its conciliar limits and the rival Thomist and Molinist schools.',
  },

  /* ---------------- Modern works (copyrighted: summaries only) ---------------- */
  {
    id: 'packer-knowing-god',
    type: 'book',
    title: 'Knowing God',
    authorIds: ['ji-packer'],
    year: '1973',
    publisher: 'Hodder & Stoughton; InterVarsity Press',
    url: 'https://en.wikipedia.org/wiki/Knowing_God',
    license: { status: 'copyrighted', name: '© 1973 J. I. Packer', usage: 'summary-only' },
    description: 'Packer’s best-known book; Part III, “If God Be for Us”, includes the chapter “Sons of God” on adoption.',
  },
  {
    id: 'wright-justification',
    type: 'book',
    title: 'Justification: God’s Plan and Paul’s Vision',
    authorIds: ['nt-wright'],
    year: '2009',
    publisher: 'SPCK (London); IVP Academic (Downers Grove)',
    url: 'https://research-portal.st-andrews.ac.uk/en/publications/justification-gods-plan-and-pauls-vision/',
    license: { status: 'copyrighted', name: '© 2009 N. T. Wright', usage: 'summary-only' },
    description:
      'Wright’s fullest statement of his reading of Paul on justification, written partly in reply to critics of the “New Perspective”, with exegesis of Galatians, Romans, Ephesians and other letters.',
  },
];
