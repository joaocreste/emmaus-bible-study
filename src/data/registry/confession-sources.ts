import type { Author, License, Source } from '../../domain/models';

/**
 * Creeds, confessions, catechisms and other public-domain doctrinal texts in the
 * knowledge base (kb/corpus/confessions-*.json, kb/corpus/catholic-encyclopedia.json),
 * built by scripts/kb/confessions. Owned by the kb-confessions agent.
 *
 * Ids that already exist elsewhere in the registry for the SAME edition are reused by the
 * corpora, not redefined here: nicene-creed, nicene-creed-percival, westminster-confession,
 * canons-of-dort, augsburg-confession, formula-of-concord, council-of-trent-session-6,
 * confession-of-dositheus (shared-sources.ts); council-of-trent-session-24, wesley-sermons, the per-article
 * catholic-encyclopedia-* entries and the authors luther, wesley and philip-melanchthon
 * (base registry and curated modules). A different printing of the same work gets its own id
 * (e.g. methodist-articles-of-religion is the United Methodist Church's current text;
 * methodist-articles-of-religion-schaff is the 1784 text as printed by Schaff).
 */

const PD: License = { status: 'public-domain', name: 'Public domain', usage: 'full-text' };
const SCHAFF_2 = 'Philip Schaff, The Creeds of Christendom, vol. 2: The Greek and Latin Creeds (New York: Harper & Brothers, 1877), via the Christian Classics Ethereal Library';
const SCHAFF_3 = 'Philip Schaff, The Creeds of Christendom, vol. 3: The Evangelical Protestant Creeds (New York: Harper & Brothers, 1877), via the Christian Classics Ethereal Library';
const TRIGLOT = 'English text of the Triglot Concordia (St. Louis: Concordia Publishing House, 1921), via BookOfConcord.org';
const WATERWORTH = 'Trans. J. Waterworth, The Canons and Decrees of the Sacred and Oecumenical Council of Trent (London: Dolman, 1848), via the Hanover Historical Texts Project';

/* ------------------------------------------------------------------ */
/* Ecumenical creeds                                                   */
/* ------------------------------------------------------------------ */

const ECUMENICAL: Source[] = [
  {
    id: 'apostles-creed',
    type: 'creed',
    title: 'The Apostles’ Creed',
    authorIds: [],
    url: 'https://ccel.org/ccel/schaff/creeds2/creeds2.iv.i.i.i.html',
    edition: `Received form (forma recepta), English text in ${SCHAFF_2}`,
    license: PD,
    description:
      'The baptismal creed of the Western church in its received form, confessed by Catholic, Lutheran, Reformed, Anglican, Methodist and many other churches.',
  },
  {
    id: 'chalcedonian-definition',
    type: 'creed',
    title: 'The Definition of Chalcedon',
    authorIds: ['council-of-chalcedon'],
    year: '451',
    publisher: 'Council of Chalcedon',
    url: 'https://ccel.org/ccel/schaff/creeds2/creeds2.iv.i.iii.html',
    edition: `English text in ${SCHAFF_2}`,
    license: PD,
    description:
      'The Council of Chalcedon’s confession of one Christ “in two natures”, truly God and truly man, received by Catholic, Orthodox and most Protestant churches.',
  },
  {
    id: 'athanasian-creed',
    type: 'creed',
    title: 'The Athanasian Creed (Quicunque vult)',
    authorIds: [],
    year: 'c. 500',
    url: 'https://ccel.org/ccel/schaff/creeds2/creeds2.iv.i.iv.html',
    edition: `English text in ${SCHAFF_2}`,
    license: PD,
    description:
      'A Latin creed of the late fifth or early sixth century, traditionally but not actually by Athanasius, setting out the doctrines of the Trinity and the Incarnation; received in the Western churches.',
  },
  {
    id: 'creed-of-nicaea-percival',
    type: 'creed',
    title: 'The Creed of Nicaea',
    authorIds: ['council-of-nicaea'],
    year: '325',
    publisher: 'First Council of Nicaea',
    url: 'https://www.newadvent.org/fathers/3801.htm',
    edition: 'Trans. Henry R. Percival, Nicene and Post-Nicene Fathers, 2nd series, vol. 14 (1900), via New Advent',
    license: PD,
    description: 'The original creed of the First Council of Nicaea (325), with its anathemas against the teaching of Arius; later expanded into the Nicene-Constantinopolitan Creed.',
  },
];

/* ------------------------------------------------------------------ */
/* Reformed                                                            */
/* ------------------------------------------------------------------ */

const REFORMED: Source[] = [
  {
    id: 'westminster-shorter-catechism-opc',
    type: 'catechism',
    title: 'Westminster Shorter Catechism',
    authorIds: ['westminster-assembly'],
    year: '1647',
    publisher: 'Westminster Assembly',
    url: 'https://www.opc.org/sc.html',
    edition: 'Text as published online by the Orthodox Presbyterian Church (without proof texts)',
    license: PD,
    description: 'The Westminster Assembly’s catechism of 107 questions for instruction, a doctrinal standard of Presbyterian churches alongside the Westminster Confession.',
  },
  {
    id: 'westminster-larger-catechism-opc',
    type: 'catechism',
    title: 'Westminster Larger Catechism',
    authorIds: ['westminster-assembly'],
    year: '1648',
    publisher: 'Westminster Assembly',
    url: 'https://www.opc.org/lc.html',
    edition: 'Text as published online by the Orthodox Presbyterian Church (without proof texts)',
    license: PD,
    description: 'The Westminster Assembly’s fuller catechism of 196 questions, intended for public exposition from the pulpit; a doctrinal standard of Presbyterian churches.',
  },
  {
    id: 'heidelberg-catechism-schaff',
    type: 'catechism',
    title: 'The Heidelberg Catechism',
    authorIds: ['ursinus-olevianus'],
    year: '1563',
    url: 'https://ccel.org/ccel/schaff/creeds3/creeds3.iv.vi.html',
    edition: `German and English in ${SCHAFF_3}`,
    license: PD,
    description:
      'The catechism of the Reformed church of the Palatinate in 129 questions, arranged under misery, redemption and gratitude; a doctrinal standard of Reformed churches of German and Dutch heritage.',
  },
  {
    id: 'belgic-confession-schaff',
    type: 'confession',
    title: 'The Belgic Confession',
    authorIds: ['guido-de-bres'],
    year: '1561 (revised 1619)',
    url: 'https://ccel.org/ccel/schaff/creeds3/creeds3.iv.viii.html',
    edition: `French and English (text as revised by the Synod of Dort) in ${SCHAFF_3}`,
    license: PD,
    description: 'The confession of the Reformed churches of the Netherlands in 37 articles, written by Guido de Brès; with the Heidelberg Catechism and the Canons of Dort one of the Three Forms of Unity.',
  },
];

/* ------------------------------------------------------------------ */
/* Lutheran & Anglican                                                 */
/* ------------------------------------------------------------------ */

const LUTHERAN_ANGLICAN: Source[] = [
  {
    id: 'luther-small-catechism-triglot',
    type: 'catechism',
    title: 'Luther’s Small Catechism',
    authorIds: ['luther'],
    year: '1529',
    url: 'https://bookofconcord.org/small-catechism/',
    edition: TRIGLOT,
    license: PD,
    description:
      'Luther’s brief catechism for households on the Ten Commandments, the Creed, the Lord’s Prayer, Baptism, Confession and the Sacrament of the Altar; part of the Lutheran Book of Concord (1580).',
  },
  {
    id: 'thirty-nine-articles',
    type: 'confession',
    title: 'The Thirty-Nine Articles of Religion',
    authorIds: ['church-of-england'],
    year: '1571',
    publisher: 'Church of England',
    url: 'https://en.wikisource.org/wiki/Book_of_Common_Prayer_(1863)/Articles_of_Religion',
    edition: 'Text of the Book of Common Prayer (1662) in an 1863 printing, as transcribed on Wikisource (transcription slips corrected against other witnesses)',
    license: PD,
    description:
      'The doctrinal articles of the Church of England, agreed in 1563 and settled in English in 1571; printed in the Book of Common Prayer and historically a standard of Anglican churches.',
  },
];

/* ------------------------------------------------------------------ */
/* Catholic                                                            */
/* ------------------------------------------------------------------ */

/** Sessions of the Council of Trent in Waterworth's translation (sessions 6 and 24 are defined elsewhere). */
const trentSession = (n: number, roman: string, title: string, year: string, pages: string, description: string): Source => ({
  id: `council-of-trent-session-${n}`,
  type: 'confession',
  title: `Council of Trent, Session ${roman}: ${title}`,
  authorIds: ['council-of-trent'],
  year,
  publisher: 'Council of Trent',
  url: `https://history.hanover.edu/texts/trent/ct${String(n).padStart(2, '0')}.html`,
  edition: `${WATERWORTH}; pp. ${pages}`,
  license: PD,
  description,
});

const CATHOLIC: Source[] = [
  trentSession(3, 'III', 'Decree touching the Symbol of Faith', '1546', '15–17', 'The Council’s opening doctrinal act (4 February 1546): it receives the Nicene-Constantinopolitan Creed as the foundation of its work.'),
  trentSession(4, 'IV', 'Decrees concerning the Canonical Scriptures', '1546', '17–21', 'The Council’s decrees of 8 April 1546 on Scripture and tradition, the list of canonical books (including those Protestants call the Apocrypha) and the authority of the Vulgate.'),
  trentSession(5, 'V', 'Decree concerning Original Sin', '1546', '21–29', 'The Council’s decree of 17 June 1546 on Adam’s sin, its transmission to all, and its remission in baptism, with the remaining concupiscence.'),
  trentSession(7, 'VII', 'Decree on the Sacraments', '1547', '53–67', 'The Council’s canons of 3 March 1547 on the sacraments in general, on baptism (including infant baptism) and on confirmation.'),
  trentSession(13, 'XIII', 'Decree concerning the Most Holy Sacrament of the Eucharist', '1551', '75–91', 'The Council’s decree of 11 October 1551 on the real presence of Christ in the Eucharist and on transubstantiation, with eleven canons.'),
  trentSession(14, 'XIV', 'On the Most Holy Sacraments of Penance and Extreme Unction', '1551', '92–121', 'The Council’s doctrine and canons of 25 November 1551 on penance (contrition, confession, satisfaction) and on extreme unction.'),
  trentSession(21, 'XXI', 'Decree on Communion under Both Species and the Communion of Infants', '1562', '140–152', 'The Council’s doctrine and canons of 16 July 1562 on receiving communion under one or both kinds and on the communion of little children.'),
  trentSession(22, 'XXII', 'Doctrine on the Sacrifice of the Mass', '1562', '152–170', 'The Council’s doctrine and canons of 17 September 1562 on the Mass as a true and propitiatory sacrifice.'),
  trentSession(23, 'XXIII', 'Doctrine on the Sacrament of Order', '1563', '170–192', 'The Council’s doctrine and canons of 15 July 1563 on the priesthood, the orders of ministry and the hierarchy.'),
  trentSession(25, 'XXV', 'Decrees on Purgatory, on the Saints and Sacred Images, and on Indulgences', '1563', '232–289', 'The Council’s closing decrees of 3–4 December 1563 on purgatory, the invocation and veneration of saints, relics and sacred images, indulgences, fasts and the Index of books.'),
  {
    id: 'roman-catechism-mchugh-callan',
    type: 'catechism',
    title: 'The Roman Catechism (Catechism of the Council of Trent for Parish Priests)',
    authorIds: ['council-of-trent'],
    year: '1566',
    publisher: 'Issued by order of Pope Pius V',
    url: 'https://archive.org/details/catechismofcounc0000jose',
    edition:
      'Trans. John A. McHugh and Charles J. Callan, Catechism of the Council of Trent for Parish Priests (New York: Joseph F. Wagner, 1923; public domain in the United States); text as transcribed, without the translators’ notes and marginal references, by the Nazareth Resource Library (cin.org), checked against the 1923 printing',
    license: PD,
    description:
      'The catechism the Council of Trent ordered for the instruction of parish priests, published at Rome under Pope Pius V in 1566: an exposition of the Creed, the sacraments, the Ten Commandments and the Lord’s Prayer, and the Catholic Church’s principal official catechism before the Catechism of the Catholic Church (1992).',
  },
];

/* ------------------------------------------------------------------ */
/* Eastern Orthodox, Methodist, Baptist                                */
/* ------------------------------------------------------------------ */

const ORTHODOX_METHODIST_BAPTIST: Source[] = [
  {
    id: 'philaret-longer-catechism-schaff',
    type: 'catechism',
    title: 'The Longer Catechism of the Orthodox, Catholic, Eastern Church',
    authorIds: ['philaret-of-moscow'],
    year: '1830 edition',
    publisher: 'Holy Governing Synod of the Russian Church',
    url: 'https://ccel.org/ccel/schaff/creeds2/creeds2.vi.iii.html',
    edition: `Trans. R. W. Blackmore, The Doctrine of the Russian Church (Aberdeen, 1845), as printed with numbered questions in ${SCHAFF_2}`,
    license: PD,
    description:
      'The catechism of Metropolitan Philaret of Moscow, approved by the Holy Synod of the Russian Church; in 611 questions on faith (the Creed and the sacraments), hope (the Lord’s Prayer and the Beatitudes) and love (the Ten Commandments), long the standard catechism of Russian Orthodoxy.',
  },
  {
    id: 'methodist-articles-of-religion-schaff',
    type: 'confession',
    title: 'Articles of Religion (Methodist Episcopal Church)',
    authorIds: ['wesley'],
    year: '1784',
    url: 'https://ccel.org/ccel/schaff/creeds3/creeds3.v.vi.html',
    edition: `Text of The Doctrines and Discipline of the Methodist Episcopal Church (ed. Harris, New York, 1872), as printed in ${SCHAFF_3}`,
    license: PD,
    description:
      'The twenty-five articles John Wesley abridged from the Thirty-Nine Articles for the American Methodists, adopted in 1784 (Article 23, on the rulers of the United States, is an American addition); the doctrinal standard of the Methodist Episcopal churches.',
  },
  {
    id: 'second-london-baptist-confession',
    type: 'confession',
    title: 'The Second London Baptist Confession of Faith',
    authorIds: ['particular-baptist-assembly-1689'],
    year: '1677 (adopted 1689)',
    url: 'https://ccel.org/ccel/anonymous/bcf',
    edition: 'Text of the 1677/1688 printings with their Scripture proofs, original spelling, as published by the Christian Classics Ethereal Library (“The 1677/89 London Baptist Confession of Faith”)',
    license: PD,
    description:
      'The confession of the Particular (Calvinistic) Baptists of England, adapted from the Westminster Confession and the Savoy Declaration with Baptist teaching on the church and on believers’ baptism; adopted by their General Assembly in London in 1689 and later, as the Philadelphia Confession, by Baptists in America.',
  },
];

/* ------------------------------------------------------------------ */
/* The Catholic Encyclopedia (1907–1914), one source per article         */
/* ------------------------------------------------------------------ */

/** Article of the Catholic Encyclopedia as published by New Advent (metadata from its citation block). */
const ce = (slug: string, file: string, title: string, volume: string, year: string, author: string, description: string): Source => ({
  id: `catholic-encyclopedia-${slug}`,
  type: 'encyclopedia',
  title: `${title} (The Catholic Encyclopedia, vol. ${volume})`,
  authorIds: [],
  year,
  publisher: 'Robert Appleton Company',
  url: `https://www.newadvent.org/cathen/${file}.htm`,
  edition: `Article by ${author}, via New Advent`,
  license: PD,
  description,
});

const CATHOLIC_ENCYCLOPEDIA: Source[] = [
  {
    id: 'catholic-encyclopedia',
    type: 'encyclopedia',
    title: 'The Catholic Encyclopedia',
    authorIds: [],
    year: '1907–1914',
    publisher: 'Robert Appleton Company',
    url: 'https://www.newadvent.org/cathen/',
    edition: 'Fifteen volumes and index (New York, 1907–1914); electronic text by New Advent',
    license: PD,
    description:
      'The English-language Catholic reference work of the early twentieth century, written by Catholic scholars under the editorship of Charles G. Herbermann; it reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.',
  },
  ce('divorce-moral-theology', '05054c', 'Divorce (in Moral Theology)', '5', '1909', 'Augustinus Lehmkuhl',
    'Catholic Encyclopedia article (1909) on divorce and separation in Catholic moral theology: the indissolubility of Christian marriage, the dissolution of non-Christian and of unconsummated marriages, and separation from bed and board. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('divorce-civil-jurisprudence', '05064a', 'Divorce (in Civil Jurisprudence)', '5', '1909', 'Walter George Smith',
    'Catholic Encyclopedia article (1909) on divorce legislation among the Hebrews, Greeks and Romans, in the Christian empire, in England, in modern Europe and in the United States. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('sacrament-of-marriage', '09707a', 'Sacrament of Marriage', '9', '1910', 'Augustinus Lehmkuhl',
    'Catholic Encyclopedia article (1910) on marriage as a sacrament: the proof of its sacramental character, its minister, matter and form. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('marriage-moral-canonical', '09699a', 'Moral and Canonical Aspect of Marriage', '9', '1910', 'Joseph Selinger',
    'Catholic Encyclopedia article (1910) on the moral and canonical law of marriage: its divine institution, its indissolubility, matrimonial consent, and the Church’s marriage legislation and courts. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('adultery', '01163a', 'Adultery', '1', '1907', 'John Melody',
    'Catholic Encyclopedia article (1907) on adultery: its nature, its guilt and the obligations it entails. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('woman', '15687b', 'Woman', '15', '1912', 'Augustin Rössler and William Fanning',
    'Catholic Encyclopedia article (1912) on women: their position in society, in English-speaking countries and in canon law. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('sanctifying-grace', '06701a', 'Sanctifying Grace', '6', '1909', 'Joseph Pohle',
    'Catholic Encyclopedia article (1909) on sanctifying grace: justification as the preparation for it, and its nature and characteristics. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('actual-grace', '06689x', 'Actual Grace', '6', '1909', 'Joseph Pohle',
    'Catholic Encyclopedia article (1909) on actual grace: its nature and properties. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('justification', '08573a', 'Justification', '8', '1910', 'Joseph Pohle',
    'Catholic Encyclopedia article (1910) on justification: the Protestant and the Catholic doctrine. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('merit', '10202b', 'Merit', '10', '1911', 'Joseph Pohle',
    'Catholic Encyclopedia article (1911) on merit: its nature, existence, conditions and objects. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('salvation', '13407a', 'Salvation', '13', '1912', 'Anthony Maas',
    'Catholic Encyclopedia article (1912) on salvation: the salvation of the human race and of the individual. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('free-will', '06259a', 'Free Will', '6', '1909', 'Michael Maher',
    'Catholic Encyclopedia article (1909) on free will: the philosophical question, its history and the argument for moral liberty. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('divine-providence', '12510a', 'Divine Providence', '12', '1911', 'Leslie Walker',
    'Catholic Encyclopedia article (1911) on divine providence: the testimony of universal belief, of Scripture, the Fathers and the councils, and its philosophical development. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('evil', '05649a', 'Evil', '5', '1909', 'Alfred Sharpe',
    'Catholic Encyclopedia article (1909) on evil: its nature and origin and its relation to the goodness of God. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('original-sin', '11312a', 'Original Sin', '11', '1911', 'Stéphane Harent',
    'Catholic Encyclopedia article (1911) on original sin: its meaning, its adversaries, its basis in Scripture and tradition, and its nature. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('sin', '14004b', 'Sin', '14', '1912', 'Arthur Charles O’Neil',
    'Catholic Encyclopedia article (1912) on sin: its nature and division, mortal and venial sin. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('faith', '05752c', 'Faith', '5', '1909', 'Hugh Pope',
    'Catholic Encyclopedia article (1909) on faith: its object, the act and habit of faith, and faith in relation to works. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('hope', '07465b', 'Hope', '7', '1910', 'Joseph Delany',
    'Catholic Encyclopedia article (1910) on hope as a theological virtue. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('charity', '09397a', 'Love (Theological Virtue)', '9', '1910', 'Joseph Sollier',
    'Catholic Encyclopedia article (1910) on love (charity) as a theological virtue: love of God and love of neighbour. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('prayer', '12345b', 'Prayer', '12', '1911', 'John Wynne',
    'Catholic Encyclopedia article (1911) on prayer: its objects, conditions, effects, necessity and kinds. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('holy-ghost', '07409a', 'Holy Ghost', '7', '1910', 'Jacques Forget',
    'Catholic Encyclopedia article (1910) on the Holy Spirit: the dogma, the errors opposed to it, his procession and the Filioque, and his gifts and fruits. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('incarnation', '07706b', 'The Incarnation', '7', '1910', 'Walter Drum',
    'Catholic Encyclopedia article (1910) on the Incarnation: its fact, nature and effects. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('atonement', '02055a', 'Doctrine of the Atonement', '2', '1907', 'William Kent',
    'Catholic Encyclopedia article (1907) on the doctrine of the Atonement and its history. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('the-church', '03744a', 'The Church', '3', '1908', 'George Joyce',
    'Catholic Encyclopedia article (1908) on the Church: its constitution by Christ, its visibility, authority, members and marks. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('the-pope', '12260a', 'The Pope', '12', '1911', 'George Joyce',
    'Catholic Encyclopedia article (1911) on the pope: the primacy of Peter and of the Roman see and the nature and extent of papal power. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('infallibility', '07790a', 'Infallibility', '7', '1910', 'Patrick Toner',
    'Catholic Encyclopedia article (1910) on infallibility: its meaning, proof, organs and scope. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('tradition', '15006b', 'Tradition and Living Magisterium', '15', '1912', 'Jean Bainvel',
    'Catholic Encyclopedia article (1912) on tradition and the living magisterium: the relation of Scripture, tradition and the Church’s teaching authority. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('canon-new-testament', '03274a', 'Canon of the New Testament', '3', '1908', 'George Reid',
    'Catholic Encyclopedia article (1908) on the canon of the New Testament: its formation, the period of discussion and its fixation. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('canon-old-testament', '03267a', 'Canon of the Old Testament', '3', '1908', 'George Reid',
    'Catholic Encyclopedia article (1908) on the canon of the Old Testament, including the deuterocanonical books, among the Jews and in the Church. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('inspiration-of-the-bible', '08045a', 'Inspiration of the Bible', '8', '1910', 'Alfred Durand',
    'Catholic Encyclopedia article (1910) on the inspiration of the Bible: its nature and extent, and Protestant views. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('communion-of-saints', '04171a', 'The Communion of Saints', '4', '1908', 'Joseph Sollier',
    'Catholic Encyclopedia article (1908) on the communion of saints: the Catholic doctrine and Protestant views. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('virgin-mary', '15464b', 'The Blessed Virgin Mary', '15', '1912', 'Anthony Maas',
    'Catholic Encyclopedia article (1912) on the Blessed Virgin Mary in Old Testament prophecy and types, in the New Testament and in early Christian writings. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('sacraments', '13295a', 'Sacraments', '13', '1912', 'Daniel Kennedy',
    'Catholic Encyclopedia article (1912) on the sacraments: their nature, origin, number, effects, minister and recipient. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('eucharist-as-sacrament', '05584a', 'The Blessed Eucharist as a Sacrament', '5', '1909', 'Joseph Pohle',
    'Catholic Encyclopedia article (1909) on the Eucharist as a sacrament: its matter and form, its effects, its necessity for salvation, its minister and its recipient (including communion under one kind). It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('real-presence', '05573a', 'The Real Presence of Christ in the Eucharist', '5', '1909', 'Joseph Pohle',
    'Catholic Encyclopedia article (1909) on the real presence of Christ in the Eucharist and transubstantiation. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('sacrifice-of-the-mass', '10006a', 'Sacrifice of the Mass', '10', '1911', 'Joseph Pohle',
    'Catholic Encyclopedia article (1911) on the Mass as a sacrifice: its existence, nature and causality. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('sacrament-of-penance', '11618c', 'The Sacrament of Penance', '11', '1911', 'Edward Hanna',
    'Catholic Encyclopedia article (1911) on the sacrament of penance: confession, satisfaction, the seal of confession and public penance. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('indulgences', '07783a', 'Indulgences', '7', '1910', 'William Kent',
    'Catholic Encyclopedia article (1910) on indulgences: what they are and are not, their basis, abuses and effects. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('purgatory', '12575a', 'Purgatory', '12', '1911', 'Edward Hanna',
    'Catholic Encyclopedia article (1911) on purgatory: the Catholic doctrine, its proofs and prayer for the dead. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('extreme-unction', '05716a', 'Extreme Unction', '5', '1909', 'Patrick Toner',
    'Catholic Encyclopedia article (1909) on extreme unction (the anointing of the sick): its rite, efficacy, matter and form, minister, subject and effects. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('holy-orders', '11279a', 'Holy Orders', '11', '1911', 'Hubert Ahaus',
    'Catholic Encyclopedia article (1911) on holy orders as a sacrament. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('heaven', '07170a', 'Heaven', '7', '1910', 'Joseph Hontheim',
    'Catholic Encyclopedia article (1910) on heaven: its existence, the beatific vision and the happiness of the blessed. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('hell', '07207a', 'Hell', '7', '1910', 'Joseph Hontheim',
    'Catholic Encyclopedia article (1910) on hell: its existence and eternity and the pains of the damned. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('general-resurrection', '12792a', 'General Resurrection', '12', '1911', 'Anthony Maas',
    'Catholic Encyclopedia article (1911) on the general resurrection of the body and the characteristics of the risen body. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('general-judgment', '08552a', 'General Judgment', '8', '1910', 'John McHugh',
    'Catholic Encyclopedia article (1910) on the general judgment: its existence, the signs preceding it, its circumstances and results. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('particular-judgment', '08550a', 'Particular Judgment', '8', '1910', 'John McHugh',
    'Catholic Encyclopedia article (1910) on the particular judgment of each soul immediately after death: the dogma, its proof from Scripture and the Fathers, opposing views, and the prompt fulfilment of the sentence. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('preparation-for-death', '04660c', 'Preparation for Death', '4', '1908', 'Joseph Delany',
    'Catholic Encyclopedia article (1908) on preparing for death: a righteous life, calling the priest, settling one’s affairs, confession, viaticum, extreme unction and the last blessing. It reflects Catholic teaching and practice before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('millennium', '10307a', 'Millennium and Millenarianism', '10', '1911', 'Johann Peter Kirsch',
    'Catholic Encyclopedia article (1911) on millennium and millenarianism (chiliasm), the expectation of a thousand-year earthly reign of Christ, and its history. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('use-of-wealth', '15571a', 'Use of Wealth', '15', '1912', 'Joseph Delany',
    'Catholic Encyclopedia article (1912) on the Christian use of wealth. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
  ce('war', '15546c', 'War', '15', '1912', 'Charles Macksey',
    'Catholic Encyclopedia article (1912) on war: the right of war, who possesses it, its just causes and its limits. It reflects Catholic teaching and scholarship before the 1917 Code of Canon Law and the Second Vatican Council.'),
];

export const CONFESSION_SOURCES: Source[] = [...ECUMENICAL, ...REFORMED, ...LUTHERAN_ANGLICAN, ...CATHOLIC, ...CATHOLIC_ENCYCLOPEDIA, ...ORTHODOX_METHODIST_BAPTIST];

/* ------------------------------------------------------------------ */
/* Authors (councils, assemblies and churches as institutional authors) */
/* ------------------------------------------------------------------ */

export const CONFESSION_AUTHORS: Author[] = [
  {
    id: 'council-of-nicaea',
    name: 'First Council of Nicaea',
    shortName: 'Nicaea',
    lifespan: '325',
    era: 'early-church',
    tradition: 'Ecumenical council',
    description: 'The first ecumenical council, summoned by Constantine in 325; it condemned Arius and confessed the Son “of one substance” with the Father.',
    aliases: ['council of nicaea', 'council of nicea', 'nicaea', 'nicea'],
  },
  {
    id: 'council-of-constantinople-381',
    name: 'First Council of Constantinople',
    shortName: 'Constantinople I',
    lifespan: '381',
    era: 'early-church',
    tradition: 'Ecumenical council',
    description: 'The second ecumenical council (381), which confirmed the faith of Nicaea and confessed the divinity of the Holy Spirit; its creed is the Nicene Creed as churches recite it.',
    aliases: ['council of constantinople', 'first council of constantinople'],
  },
  {
    id: 'council-of-chalcedon',
    name: 'Council of Chalcedon',
    shortName: 'Chalcedon',
    lifespan: '451',
    era: 'early-church',
    tradition: 'Ecumenical council',
    description: 'The fourth ecumenical council (451), which defined that Christ is one person in two natures, divine and human.',
    aliases: ['council of chalcedon', 'chalcedon'],
  },
  {
    id: 'westminster-assembly',
    name: 'Westminster Assembly',
    shortName: 'Westminster Assembly',
    lifespan: '1643–1653',
    era: 'reformation',
    tradition: 'Reformed (Presbyterian)',
    description: 'The assembly of divines summoned by the English Parliament that wrote the Westminster Confession of Faith and the Larger and Shorter Catechisms.',
    aliases: ['westminster assembly', 'westminster divines'],
  },
  {
    id: 'ursinus-olevianus',
    name: 'Zacharias Ursinus and Caspar Olevianus',
    shortName: 'Ursinus and Olevianus',
    era: 'reformation',
    tradition: 'Reformed',
    description:
      'Heidelberg theologians traditionally named as the authors of the Heidelberg Catechism (1563), prepared at the order of Elector Frederick III of the Palatinate; Ursinus is generally regarded as its principal author.',
    aliases: ['ursinus', 'zacharias ursinus', 'olevianus', 'caspar olevianus'],
  },
  {
    id: 'guido-de-bres',
    name: 'Guido de Brès',
    lifespan: '1522–1567',
    era: 'reformation',
    tradition: 'Reformed',
    description: 'Reformed preacher of the Southern Netherlands, author of the Belgic Confession (1561); executed at Valenciennes in 1567.',
    aliases: ['guido de bres', 'guy de bray', 'de bres'],
  },
  {
    id: 'synod-of-dort',
    name: 'Synod of Dort',
    shortName: 'Synod of Dort',
    lifespan: '1618–1619',
    era: 'reformation',
    tradition: 'Reformed',
    description: 'The national synod of the Dutch Reformed Church at Dordrecht, with delegates from other Reformed churches, which answered the Remonstrants in the Canons of Dort.',
    aliases: ['synod of dort', 'synod of dordt', 'dort', 'dordt'],
  },
  {
    id: 'formula-of-concord-theologians',
    name: 'The theologians of the Formula of Concord',
    shortName: 'Formula of Concord',
    lifespan: '1577',
    era: 'reformation',
    tradition: 'Lutheran',
    description:
      'Jakob Andreae, Martin Chemnitz, Nikolaus Selnecker, David Chytraeus, Andreas Musculus and Christoph Körner, who drafted the Formula of Concord (1577).',
    aliases: ['andreae', 'jakob andreae', 'chemnitz', 'martin chemnitz'],
  },
  {
    id: 'council-of-trent',
    name: 'Council of Trent',
    shortName: 'Trent',
    lifespan: '1545–1563',
    era: 'reformation',
    tradition: 'Catholic',
    description: 'The nineteenth ecumenical council of the Catholic Church, meeting at Trent in three periods between 1545 and 1563; it defined Catholic doctrine in response to the Protestant Reformation.',
    aliases: ['council of trent', 'trent', 'tridentine'],
  },
  {
    id: 'philaret-of-moscow',
    name: 'Philaret of Moscow',
    shortName: 'Philaret',
    lifespan: '1782–1867',
    era: 'modern',
    tradition: 'Eastern Orthodox (Russian)',
    description: 'Vasily Drozdov, Metropolitan of Moscow and the leading Russian Orthodox theologian and preacher of his century; author of the Longer Catechism of the Russian Church.',
    aliases: ['philaret', 'filaret', 'philaret of moscow', 'philaret drozdov'],
  },
  {
    id: 'synod-of-jerusalem-1672',
    name: 'Synod of Jerusalem (1672)',
    shortName: 'Synod of Jerusalem',
    lifespan: '1672',
    era: 'post-reformation',
    tradition: 'Eastern Orthodox',
    description:
      'A synod of Eastern Orthodox bishops held at Jerusalem (Bethlehem) in 1672 under Dositheus II, Patriarch of Jerusalem, whose decrees (the Confession of Dositheus) answered the Calvinist confession published under the name of Cyril Lucar.',
    aliases: ['synod of jerusalem', 'council of jerusalem 1672', 'synod of bethlehem', 'council of bethlehem', 'dositheus', 'confession of dositheus'],
  },
  {
    id: 'particular-baptist-assembly-1689',
    name: 'General Assembly of Particular Baptists (London, 1689)',
    shortName: 'London Baptist Assembly (1689)',
    lifespan: '1689',
    era: 'post-reformation',
    tradition: 'Baptist (Particular)',
    description: 'The assembly of ministers and messengers of the Particular (Calvinistic) Baptist churches of England and Wales that met in London in 1689 and adopted the Confession first published in 1677.',
  },
  {
    id: 'church-of-england',
    name: 'Church of England',
    shortName: 'Church of England',
    era: 'reformation',
    tradition: 'Anglican',
    description: 'The established church of England, whose Convocation agreed the Thirty-Nine Articles of Religion (1563; English text settled 1571).',
    aliases: ['church of england', 'anglican church'],
  },
];
