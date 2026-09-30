import type { CuratedStudy, PassageRef, VerseRef } from '../../../domain/models';
import { cite, synthesis, summaryOf, verifiedQuote, lexical, historical, literary, text } from '../../../domain/provenance';

/**
 * Curated passage study — Psalm 23, “The LORD Is My Shepherd”.
 *
 * Demonstrates (spec §18): Hebrew terminology, ancient Near Eastern shepherd
 * imagery, explained cross-references and historical commentary.
 * Every lexical fact was checked against STEPBible TBESH/TAHOT; every quotation
 * against the linked public-domain text. Deliberately contains no Tim Keller
 * material (none verified for this psalm); W. Phillip Keller is a different author.
 */

/* ------------------------------------------------------------------ */
/* Reference helpers                                                   */
/* ------------------------------------------------------------------ */

/** A verse of Psalm 23. */
const v = (verse: number): VerseRef => ({ book: 'PSA', chapter: 23, verse });

/** A range inside Psalm 23 (single verse when `end` is omitted). */
const ps23 = (start: number, end: number = start): PassageRef => ({
  book: 'PSA',
  startChapter: 23,
  startVerse: start,
  endChapter: 23,
  endVerse: end,
});

/** Any verse range within one chapter. */
const ref = (book: string, chapter: number, start: number, end: number = start): PassageRef => ({
  book,
  startChapter: chapter,
  startVerse: start,
  endChapter: chapter,
  endVerse: end,
});

/** Whole chapter range (for the book outline). */
const chapters = (book: string, start: number, end: number): PassageRef => ({ book, startChapter: start, endChapter: end });

/* ------------------------------------------------------------------ */
/* Frequently used citations                                           */
/* ------------------------------------------------------------------ */

const STEP_URL = 'https://github.com/STEPBible/STEPBible-Data';
const tahot = (locator: string) => cite('stepbible-tahot', locator, STEP_URL);
const tbesh = (locator: string) => cite('stepbible-tbesh', locator, STEP_URL);
const tagnt = (locator: string) => cite('stepbible-tagnt', locator, STEP_URL);
const bsb = (locator: string) => cite('bsb', locator);
const kjv = (locator: string) => cite('kjv', locator);
const lxx = (locator: string) => cite('lxx-brenton', locator, 'https://bible.helloao.org/api/grc_bre/PSA/22.json');
/** Brenton’s English translation of the Septuagint Psalms. */
const lxxEng = (locator: string) => cite('lxx-brenton', locator, 'https://bible.helloao.org/api/eng_bre/PSA/22.json');

const TYNDALE_PS23 = 'https://bible.helloao.org/api/c/tyndale/PSA/23.json';
const tyndale = (locator: string, url: string = TYNDALE_PS23) => cite('tyndale-open-study-notes', locator, url);
const tyndaleIntro = cite('tyndale-open-study-notes', 'Introduction to Psalms', 'https://bible.helloao.org/api/c/tyndale/books.json');

const CALVIN_URL = 'https://bible.helloao.org/api/c/john-calvin/PSA/23.json';
const HENRY_URL = 'https://bible.helloao.org/api/c/matthew-henry/PSA/23.json';
const KD_URL = 'https://bible.helloao.org/api/c/keil-delitzsch/PSA/23.json';
const GILL_URL = 'https://bible.helloao.org/api/c/john-gill/PSA/23.json';
const TOD_URL = 'https://archive.spurgeon.org/treasury/ps023.php';
const AUGUSTINE_URL = 'https://www.newadvent.org/fathers/1801023.htm';
const CYRIL_URL = 'https://www.newadvent.org/fathers/310122.htm';
const MACLAREN_URL = 'https://biblehub.com/commentaries/maclaren/psalms/23.htm';
const MEYER_URL = 'https://archive.org/details/shepherdpsalm00meye';
const HAMMURABI_URL = 'https://avalon.law.yale.edu/ancient/hamcode.asp';
const CHABAD_URL = 'https://www.chabad.org/library/article_cdo/aid/3832324/jewish/Psalm-23-L-rd-Is-My-Shepherd.htm';
const WIKI_CYRIL_URL = 'https://en.wikipedia.org/wiki/Cyril_of_Jerusalem';
/** Rashi on Ps 23:4 (Hebrew text), Hebrew Wikisource. */
const RASHI_URL = 'https://he.wikisource.org/wiki/%D7%A8%D7%A9%22%D7%99_%D7%A2%D7%9C_%D7%AA%D7%94%D7%9C%D7%99%D7%9D_%D7%9B%D7%92_%D7%93';
/** Delitzsch, Biblical Commentary on the Psalms, vol. 1, trans. F. Bolton (T. & T. Clark, 1880), scanned at the Internet Archive. */
const KD_PRINT_URL = 'https://archive.org/details/biblicalcommenta188001deli';

const calvin = (locator: string) => cite('calvin-commentaries', locator, CALVIN_URL);
const henry = (locator: string) => cite('matthew-henry-commentary', locator, HENRY_URL);
const kd = (locator: string) => cite('keil-delitzsch-commentary', locator, KD_URL);
const gill = (locator: string) => cite('john-gill-exposition', locator, GILL_URL);
const treasury = (locator: string) => cite('spurgeon-treasury-of-david', locator, TOD_URL);
/** Augustine, Exposition on Psalm 23 (his Ps 22), by section. */
const augustine = (sections: string) => cite('augustine-expositions-psalms', `Exposition on Psalm 23 (Augustine’s Ps 22)${sections ? `, ${sections}` : ''}`, AUGUSTINE_URL);

/* ------------------------------------------------------------------ */
/* Study                                                               */
/* ------------------------------------------------------------------ */

const study: CuratedStudy = {
  id: 'psalm-23',
  kind: 'passage',
  title: 'Psalm 23',
  subtitle: 'The LORD Is My Shepherd',
  passage: { book: 'PSA', startChapter: 23 },
  match: {
    references: [{ book: 'PSA', startChapter: 23 }],
    topics: [
      'psalm 23',
      'the lord is my shepherd',
      'lord is my shepherd',
      'the shepherd psalm',
      'shepherd psalm',
      'shepherd',
      'valley of the shadow of death',
      'green pastures',
      'still waters',
    ],
  },

  summary: text(
    'Psalm 23 is a psalm of trust in which David confesses the LORD — Israel’s covenant God — first as his shepherd and then as his host. Its images come from the working life of a Judean shepherd and from the ancient Near Eastern habit of calling kings shepherds: pasture and water, guidance on right paths, protection in a dark ravine, a table spread before enemies, oil for the guest’s head and an overflowing cup. At its centre — by one count of the Hebrew words, exactly in the middle — stands the confession “for You are with me,” and it ends with the LORD’s goodness and loyal love (ḥesed) pursuing the psalmist home to the LORD’s house. The prophets took up the shepherd image for God’s promised care of his scattered people, and the New Testament presents Jesus as the good, great and chief Shepherd.',
    synthesis(
      tyndale('on Ps 23 and 23:1-3'),
      tyndale('on Ezek 34:1-24', 'https://bible.helloao.org/api/c/tyndale/EZK/34.json'),
      tahot('Ps 23:1–6'),
      bsb('John 10:11; Heb 13:20; 1 Pet 5:4'),
    ),
  ),

  opening: text(
    'Welcome to Psalm 23 — perhaps the most loved song in the Bible, and one that rewards slow reading. We can look at the Hebrew words behind “shepherd,” “want” and “the shadow of death,” at the ancient world in which kings were called shepherds, and at how this picture of God runs all the way to Jesus the Good Shepherd. Where would you like to begin?',
    synthesis(tahot('Ps 23'), tyndale('on Ps 23:1-3'), bsb('John 10:11')),
  ),

  /* ---------------------------------------------------------------- */
  /* Original languages                                               */
  /* ---------------------------------------------------------------- */
  keyWords: [
    {
      id: 'psalm-23:kw:yhwh',
      strong: 'H3068G',
      language: 'hebrew',
      lemma: 'יהוה',
      transliteration: 'YHWH',
      pronunciation: 'YAH-weh (scholarly reconstruction)',
      english: 'the LORD',
      anchors: [
        { verse: v(1), phrases: { BSB: 'The LORD', KJV: 'The LORD' } },
        { verse: v(6), phrases: { BSB: 'the LORD', KJV: 'the LORD' } },
      ],
      grammar: 'Proper noun — the personal name of God',
      basicMeaning: 'LORD — the proper name of the one true God',
      semanticRange: [
        'the personal, covenant name of Israel’s God, revealed to Moses (Exod 3:14–15)',
        'read aloud as ’Adonai (“Lord”) in Jewish tradition — hence “LORD” in small capitals in English Bibles',
        'rendered “Jehovah” in older English (as in Calvin’s translators) and “Yahweh” in modern scholarship and the classic World English Bible',
      ],
      notableOccurrences: [
        { ref: ref('EXO', 3, 14, 15), note: 'God reveals his name to Moses, linking it with “I AM WHO I AM.”' },
        { ref: ref('DEU', 2, 7), note: '“The LORD your God has been with you … you have lacked nothing” — the name joined to presence and provision.' },
        { ref: ps23(6), note: 'The name returns in the psalm’s last line — “the house of the LORD” — framing the whole psalm.' },
      ],
      significance: text(
        'David does not begin with a general word for God but with his covenant name: the God who bound himself to Israel at the exodus is the one he calls “my shepherd.” In STEPBible’s tagged Hebrew text the name appears only twice in this psalm — as the first word after the heading “A Psalm of David” and in its last line — so everything in between is held inside the LORD’s care. English Bibles print LORD in small capitals to signal this name, which Jewish readers voice as ’Adonai (“Lord”); the lexicon notes that the name was written with the vowels of ’Adonai, which is where the older form “Jehovah” comes from. Across the Hebrew Bible the name is tagged more than 6,500 times.',
        synthesis(tbesh('H3068G יְהֹוָה'), tahot('Ps 23:1, 6; occurrence count of H3068G made for this study'), bsb('Exod 3:14–15')),
      ),
      caution: 'The Hebrew text preserves only the consonants YHWH with borrowed vowels; “Yahweh” is the usual scholarly reconstruction of a pronunciation the Masoretic text does not preserve.',
      provenance: lexical(tbesh('H3068G'), tahot('Ps 23:1, 6')),
    },
    {
      id: 'psalm-23:kw:raah',
      strong: 'H7462B',
      language: 'hebrew',
      lemma: 'רָעָה',
      transliteration: 'ra.ah',
      pronunciation: 'rah-AH',
      english: 'shepherd',
      anchors: [{ verse: v(1), phrases: { BSB: 'shepherd', KJV: 'shepherd', WEB: 'shepherd' } }],
      grammar: 'Verb, Qal active participle, masculine singular construct, with 1st-person suffix — rōʿî, “my shepherd” (literally “the one shepherding me”)',
      basicMeaning: 'to pasture, tend, shepherd',
      semanticRange: [
        'to tend and pasture a flock',
        'as a participle: shepherd, herdsman',
        'figuratively, of a ruler or teacher caring for people',
        'of animals: to feed, graze',
      ],
      notableOccurrences: [
        { ref: ref('GEN', 48, 15), note: 'Jacob blesses “the God who has been my shepherd all my life” — the same participle, the Bible’s first personal “shepherd” confession.' },
        { ref: ref('2SA', 5, 2), note: '“You will shepherd My people Israel” — the verb describes David’s kingship.' },
        { ref: ref('EZK', 34, 15), note: '“I will tend My flock” — God promises to shepherd his people in person.' },
        { ref: ref('ISA', 40, 11), note: '“He tends His flock like a shepherd” — the noun and the verb together.' },
      ],
      significance: text(
        'Hebrew uses a participle here: rōʿî is “the one who shepherds me,” an ongoing activity rather than a static title. In Israel and its neighbours this was royal language — kings were called the shepherds of their people — so to call the LORD “my shepherd” is to confess him as both king and carer, and David, himself a king, places himself among the sheep. Words tagged with this verb occur 169 times in STEPBible’s Hebrew Bible, from Jacob’s blessing (Gen 48:15) to Ezekiel’s promise that God himself will shepherd his flock (Ezek 34:15).',
        synthesis(
          tbesh('H7462B רָעָה'),
          tahot('Ps 23:1; occurrence count of H7462B made for this study'),
          tyndale('on Ps 23:1-3'),
          tyndale('on Ezek 34:1-24', 'https://bible.helloao.org/api/c/tyndale/EZK/34.json'),
        ),
      ),
      caution: 'The word itself does not carry “tenderness” or “authority” in every use; those overtones come from how the psalm and the wider Old Testament develop the image.',
      provenance: lexical(tbesh('H7462B'), tahot('Ps 23:1')),
    },
    {
      id: 'psalm-23:kw:chaser',
      strong: 'H2637',
      language: 'hebrew',
      lemma: 'חָסֵר',
      transliteration: 'cha.ser',
      pronunciation: 'khah-SAIR',
      english: 'want / lack',
      anchors: [{ verse: v(1), phrases: { BSB: 'not want', KJV: 'not want', WEB: 'lack nothing' } }],
      grammar: 'Verb, Qal imperfect (yiqtol), 1st person common singular — ʾeḥsār, “I lack / I shall lack”',
      basicMeaning: 'to lack',
      semanticRange: ['to lack, be without, have a need', 'to be lacking, run short', 'to diminish, decrease'],
      notableOccurrences: [
        { ref: ref('DEU', 2, 7), note: '“You have lacked nothing” — Moses on Israel’s forty years in the wilderness.' },
        { ref: ref('NEH', 9, 21), note: '“They lacked nothing” — the same memory in Israel’s great prayer of confession.' },
        { ref: ref('DEU', 8, 9), note: 'The promised land, “where you will lack nothing.”' },
        { ref: ref('PSA', 34, 10), note: '“Those who seek the LORD lack no good thing.”' },
      ],
      significance: text(
        '“I shall not want” is a claim about sufficiency, not luxury: the verb means to lack or be without. It is the verb that sums up Israel’s wilderness years — “you have lacked nothing” (Deut 2:7; compare Neh 9:21) — so the line can be heard as applying Israel’s wilderness experience to one person’s life, a link the Tyndale notes and Sinclair Ferguson both draw: the God who provided for Israel in the desert is the psalmist’s shepherd too. The verb occurs 23 times in the Hebrew Bible (STEPBible tagging, counted for this study).',
        synthesis(
          tbesh('H2637 חָסֵר'),
          tahot('Ps 23:1; Deut 2:7; Neh 9:21; occurrence count made for this study'),
          bsb('Deut 2:7; Neh 9:21'),
          tyndale('on Ps 23:1'),
          cite('ferguson-lord-is-my-shepherd'),
        ),
      ),
      caution: 'The line promises that the sheep will not lack what the Shepherd knows it needs — Psalm 34:10 speaks of “no good thing” — not that every wish will be granted.',
      provenance: lexical(tbesh('H2637'), tahot('Ps 23:1')),
    },
    {
      id: 'psalm-23:kw:nephesh',
      strong: 'H5315G',
      language: 'hebrew',
      lemma: 'נֶפֶשׁ',
      transliteration: 'ne.phesh',
      pronunciation: 'NEH-fesh',
      english: 'soul',
      anchors: [{ verse: v(3), phrases: { BSB: 'soul', KJV: 'soul', WEB: 'soul' } }],
      grammar: 'Noun, feminine singular construct, with 1st-person suffix — nafšî, “my soul / my life / myself”',
      basicMeaning: 'soul, self, life',
      semanticRange: [
        'life, the living self',
        'the person — “myself”',
        'appetite, desire',
        'the inner being, seat of emotion and will',
        'neck (in a couple of texts)',
      ],
      notableOccurrences: [
        { ref: ref('GEN', 2, 7), note: 'The man became “a living being” (nefesh) when God breathed life into him.' },
        { ref: ref('PSA', 19, 7), note: 'The law of the LORD is perfect, “reviving the soul” — the same noun with the same verb (šûb) in another stem.' },
        { ref: ref('DEU', 6, 5), note: 'Love the LORD “with all your soul” — the whole self.' },
      ],
      significance: text(
        'Nefesh covers the whole living self — breath, appetite, emotion, will and life itself — as well as what the lexicon calls “the inner being of man.” In 23:3 the pastoral picture points to the whole person: “He restores my soul” means that the Shepherd brings the exhausted or wandering sheep back to life and strength, not only that he refreshes a spiritual faculty. The noun occurs 754 times in STEPBible’s tagging, across senses from “life” and “person” to “appetite.”',
        synthesis(tbesh('H5315G נֶפֶשׁ'), tahot('Ps 23:3; Gen 2:7; Ps 19:7; occurrence count of H5315 made for this study'), kd('on Ps 23:3')),
      ),
      caution: 'The English word “soul” can suggest only an inner, spiritual part; here the context points to the whole self. The word study alone does not settle wider questions of biblical anthropology, on which Christians differ.',
      provenance: lexical(tbesh('H5315G'), tahot('Ps 23:3')),
    },
    {
      id: 'psalm-23:kw:shuv',
      strong: 'H7725H',
      language: 'hebrew',
      lemma: 'שׁוּב',
      transliteration: 'shuv',
      pronunciation: 'shoov',
      english: 'restores',
      anchors: [
        { verse: v(3), phrases: { BSB: 'restores', KJV: 'restoreth', WEB: 'restores' } },
        { verse: v(6), phrases: { BSB: 'dwell', KJV: 'dwell', WEB: 'dwell' } },
      ],
      grammar: 'Verb, Polel imperfect (tagged Piel in STEPBible; Polel is the intensive stem of hollow roots like šûb), 3rd masculine singular — yəšôbēb, “he brings back, restores” (in 23:6 the Masoretic text has wəšabtî, Qal perfect with waw, “and I will return”)',
      basicMeaning: 'to return, turn back; (Polel) to bring back, restore, refresh',
      semanticRange: [
        'to turn back, return',
        'to turn back to God — repent',
        '(Polel, Hiphil) to bring back, restore, refresh',
        'to give back, repay',
      ],
      notableOccurrences: [
        { ref: ref('PSA', 19, 7), note: '“Reviving the soul” — šûb (Hiphil) with nefesh, as in 23:3.' },
        { ref: ref('JER', 23, 3), note: '“I will return them to their pasture” — God bringing back his scattered flock.' },
        { ref: ps23(6), note: 'The Masoretic vowels read “and I will return”; the ancient versions read “I will dwell” (see the textual note).' },
      ],
      significance: text(
        'The verb’s basic movement is “turn back.” In this stem it means to bring someone back — a straying sheep returned, a fainting life revived — which is why translations vary between “restores,” “refreshes” and “brings back.” Franz Delitzsch, in the Keil–Delitzsch commentary, describes it as bringing back a soul that has, as it were, flown away, so that it comes to itself again. The verb may also echo at the end of the psalm: the Hebrew text as vocalised reads “and I will return” in verse 6, so the Shepherd who brings me back (v3) is matched by my coming home to his house.',
        synthesis(tbesh('H7725G/H7725H שׁוּב'), tahot('Ps 23:3, 6'), kd('on Ps 23:3 and 23:6')),
      ),
      caution: 'Whether 23:3 means moral restoration (repentance) or renewed strength is debated; the pastoral image comfortably holds both, but neither should be pressed from the word alone.',
      provenance: lexical(tbesh('H7725G, H7725H'), tahot('Ps 23:3, 6')),
    },
    {
      id: 'psalm-23:kw:tsalmavet',
      strong: 'H6757',
      language: 'hebrew',
      lemma: 'צַלְמָוֶת',
      transliteration: 'tsal.ma.vet',
      pronunciation: 'tsal-MAH-veth',
      english: 'shadow of death',
      anchors: [{ verse: v(4), phrases: { BSB: 'shadow of death', KJV: 'shadow of death', WEB: 'shadow of death' } }],
      grammar: 'Noun, masculine singular absolute — in the phrase bəgêʾ ṣalmāwet, “in a valley of death-shadow / deep darkness”',
      basicMeaning: 'death-shadow, deep darkness',
      semanticRange: [
        'deep darkness, thick gloom',
        'death-shadow — extreme danger or distress',
        'the darkness of the realm of the dead (Job 10:21–22; 38:17)',
        'the threatening darkness of the wilderness (Jer 2:6)',
      ],
      notableOccurrences: [
        { ref: ref('JOB', 38, 17), note: '“The gates of the shadow of death,” parallel to “the gates of death.”' },
        { ref: ref('JER', 2, 6), note: 'The wilderness as “a land of drought and darkness” — the same word for the desert’s menace.' },
        { ref: ref('ISA', 9, 2), note: '“The land of the shadow of death,” on which a great light dawns (quoted in Matt 4:16).' },
      ],
      significance: text(
        'A reader of Hebrew could hear two things in this rare word: “shadow” (ṣēl) + “death” (māwet), and a word for thick darkness. The Masoretic vowels and the Greek Septuagint (skia thanatou) support “shadow of death”; many modern scholars derive it from a root meaning “to be dark,” hence the BSB footnote “the valley of deep darkness.” It occurs 18 times, 10 of them in Job, usually of darkness at its most threatening (Amos 5:8 uses it simply of the darkness God turns into dawn). Either way the picture is a gorge so dark that death seems close — and it is there that the psalm says “You are with me.”',
        synthesis(
          tbesh('H6757 צַלְמָוֶת'),
          tahot('Ps 23:4; Amos 5:8; occurrence count of H6757 made for this study'),
          bsb('Ps 23:4 footnote; Amos 5:8'),
          lxx('Ps 22:4 LXX (= Ps 23:4)'),
          kd('on Ps 23:4'),
        ),
      ),
      caution: 'The verse is about walking through danger in God’s company, not only about the moment of dying; it is rightly read at funerals, but its first sense is broader.',
      provenance: lexical(tbesh('H6757'), tahot('Ps 23:4')),
    },
    {
      id: 'psalm-23:kw:shevet',
      strong: 'H7626G',
      language: 'hebrew',
      lemma: 'שֵׁבֶט',
      transliteration: 'she.vet',
      pronunciation: 'SHEH-vet',
      english: 'rod',
      anchors: [{ verse: v(4), phrases: { BSB: 'Your rod', KJV: 'thy rod', WEB: 'your rod' } }],
      grammar: 'Noun, masculine singular construct, with 2nd-person suffix — šibṭəkā, “your rod”',
      basicMeaning: 'rod, staff, sceptre; tribe',
      semanticRange: [
        'rod or club — a shepherd’s implement',
        'sceptre — the mark of a ruler’s authority',
        'rod of discipline',
        'tribe (the word’s commonest sense)',
      ],
      notableOccurrences: [
        { ref: ref('MIC', 7, 14), note: '“Shepherd with Your staff Your people” — the same word in a prayer to God as shepherd.' },
        { ref: ref('LEV', 27, 32), note: 'Animals counted as they pass “under the shepherd’s rod.”' },
        { ref: ref('GEN', 49, 10), note: '“The scepter will not depart from Judah” — the royal sense.' },
      ],
      significance: text(
        'The shepherd’s šēbeṭ was a club or rod for beating off predators and for guiding and counting the flock; its partner in this verse, the mišʿenet (“staff,” H4938B), is related to a word for “support” — something to lean on. The same word šēbeṭ also means a ruler’s sceptre, so the image quietly joins protection with royal authority. The comfort of verse 4 comes not from the absence of danger but from seeing the Shepherd’s weapon and support within reach.',
        synthesis(tbesh('H7626G שֵׁבֶט; H4938A–B'), tahot('Ps 23:4'), tyndale('on Ps 23:4'), bsb('Lev 27:32; Mic 7:14; Gen 49:10')),
      ),
      provenance: lexical(tbesh('H7626G; H4938B'), tahot('Ps 23:4')),
    },
    {
      id: 'psalm-23:kw:dashan',
      strong: 'H1878',
      language: 'hebrew',
      lemma: 'דָּשֵׁן',
      transliteration: 'da.shen',
      pronunciation: 'dah-SHANE',
      english: 'anoint',
      anchors: [{ verse: v(5), phrases: { BSB: 'anoint', KJV: 'anointest', WEB: 'anoint' } }],
      grammar: 'Verb, Piel perfect, 2nd masculine singular — diššantā, “you have anointed / made fat”',
      basicMeaning: 'to prosper, be fat; (Piel) to make fat, anoint',
      semanticRange: [
        'to be fat, grow fat — a picture of prosperity',
        '(Piel) to make fat, anoint',
        '(Piel) to find an offering “fat,” i.e. acceptable',
        '(Piel) to clear away the fatty ashes of the altar',
      ],
      notableOccurrences: [
        { ref: ref('PSA', 20, 3), note: '“Look favorably on your burnt offerings” — literally, find them fat.' },
        { ref: ref('PRO', 11, 25), note: '“A generous soul will prosper” — being made fat as a picture of flourishing.' },
        { ref: ref('PRO', 15, 30), note: '“Good news nourishes the bones” — literally “makes fat,” the same Piel stem as “You anoint” in 23:5.' },
      ],
      significance: text(
        'This is not māšaḥ, the verb for anointing kings and priests (the root of “Messiah,” used when Samuel anointed David, 1 Sam 16:13), but a homely verb meaning “to make fat” — to lavish rich oil on a guest. The KJV margin notes it: “Heb. makest fat.” The host of verse 5 does not merely admit David to his table; he honours him with the abundance a generous host showed a welcome guest (compare Luke 7:46). The verb occurs 11 times.',
        synthesis(
          tbesh('H1878 דָּשֵׁן; H4886 מָשַׁח'),
          tahot('Ps 23:5; 1 Sam 16:13; Prov 15:30; occurrence count of H1878 made for this study'),
          kjv('Ps 23:5 margin'),
          bsb('Prov 15:30; Luke 7:46'),
        ),
      ),
      provenance: lexical(tbesh('H1878'), tahot('Ps 23:5')),
    },
    {
      id: 'psalm-23:kw:hesed',
      strong: 'H2617A',
      language: 'hebrew',
      lemma: 'חֶסֶד',
      transliteration: 'che.sed',
      pronunciation: 'KHEH-sed',
      english: 'mercy / loving kindness',
      anchors: [{ verse: v(6), phrases: { BSB: 'mercy', KJV: 'mercy', WEB: 'loving kindness' } }],
      grammar: 'Noun, masculine singular absolute, joined by “and” — wāḥesed',
      basicMeaning: 'kindness, goodness, faithfulness',
      semanticRange: [
        'loyal love within a relationship or covenant',
        'kindness shown beyond obligation',
        'faithfulness, steadfast love — of God’s covenant commitment',
      ],
      notableOccurrences: [
        { ref: ref('EXO', 15, 13), note: '“With loving devotion You will lead the people You have redeemed” — ḥesed that leads to God’s dwelling.' },
        { ref: ref('EXO', 34, 6), note: 'The LORD, “abounding in loving devotion and faithfulness.”' },
        { ref: ref('PSA', 136, 1), note: 'Israel’s refrain: “His loving devotion endures forever.”' },
      ],
      significance: text(
        'Ḥesed is loyal, committed love — the kindness of someone who has bound himself to you. STEPBible’s interlinear glosses it here as “covenant loyalty,” while translations reach for “mercy,” “loving kindness,” “steadfast love” or “loving devotion.” Paired with “goodness,” it turns the last verse into a statement about the LORD’s character: the God who led Israel “with loving devotion” to his holy dwelling (Exod 15:13) will do the same for one sheep. It occurs about 245 times in the tagged text.',
        synthesis(tbesh('H2617A חֶסֶד'), tahot('Ps 23:6; Exod 15:13; occurrence count of H2617A made for this study'), bsb('Exod 15:13')),
      ),
      caution: 'No single English word captures ḥesed; avoid treating one translation (for example “grace”) as its fixed meaning.',
      provenance: lexical(tbesh('H2617A'), tahot('Ps 23:6')),
    },
    {
      id: 'psalm-23:kw:radaph',
      strong: 'H7291',
      language: 'hebrew',
      lemma: 'רָדַף',
      transliteration: 'ra.daph',
      pronunciation: 'rah-DAHF',
      english: 'follow',
      anchors: [{ verse: v(6), phrases: { BSB: 'follow', KJV: 'follow', WEB: 'follow' } }],
      grammar: 'Verb, Qal imperfect, 3rd masculine plural, with 1st-person suffix — yirdəpûnî, “they will pursue me”',
      basicMeaning: 'to pursue',
      semanticRange: [
        'to pursue, chase — especially of enemies',
        'to persecute, harass',
        'to follow after, aim to secure (e.g. justice)',
        'to run after',
      ],
      notableOccurrences: [
        { ref: ref('EXO', 14, 9), note: 'The Egyptians “pursued” Israel to the sea.' },
        { ref: ref('PSA', 7, 5), note: '“Then may my enemy pursue me” — in David’s psalms the verb usually describes enemies in pursuit (Ps 7:1; 31:15; 143:3).' },
        { ref: ref('DEU', 16, 20), note: '“Pursue justice, and justice alone.”' },
      ],
      significance: text(
        '“Follow” is gentle; the Hebrew is stronger. Rādap̄ is the verb for hunting down an enemy or chasing a fugitive — the word David’s psalms use of those who hunt him. Here the pursuers are God’s goodness and ḥesed. Franz Delitzsch, in the Keil–Delitzsch commentary, draws out the reversal: the psalmist’s foes are pursuing him, but only goodness and favour will pursue him now, all the days of his life. The verb occurs 143 times in the tagged text.',
        synthesis(tbesh('H7291 רָדַף'), tahot('Ps 23:6; Ps 7:1, 5; 31:15; 143:3; occurrence count of H7291 made for this study'), kd('on Ps 23:6')),
      ),
      provenance: lexical(tbesh('H7291'), tahot('Ps 23:6')),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Cross-references                                                 */
  /* ---------------------------------------------------------------- */
  crossReferences: [
    {
      id: 'psalm-23:xr:gen-48-15',
      from: ps23(1),
      target: ref('GEN', 48, 15, 16),
      relationship: 'same-concept',
      title: 'Jacob’s shepherd God',
      explanation: text(
        'The first person in Scripture to call God his shepherd is Jacob, blessing Joseph’s sons at the end of a long and troubled life: “the God who has been my shepherd all my life to this day.” The Hebrew uses the same participle of rāʿâ as Psalm 23:1. Jacob’s confession looks back over a lifetime of being kept; David makes the same personal confession, and Sinclair Ferguson suggests he learned to say it from Jacob.',
        synthesis(tahot('Gen 48:15; Ps 23:1'), bsb('Gen 48:15–16'), cite('ferguson-lord-is-my-shepherd')),
      ),
      tags: ['shepherd', 'patriarchs', 'providence'],
    },
    {
      id: 'psalm-23:xr:exod-15-13',
      from: ps23(2, 3),
      target: ref('EXO', 15, 13),
      relationship: 'allusion',
      title: 'Led with ḥesed to God’s holy dwelling',
      explanation: text(
        'Moses’ song after the Red Sea shares an unusual cluster of words with Psalm 23: with his ḥesed (23:6) God will “lead” the people he redeemed (nāḥâ — the verb the BSB renders “guides” in 23:3) and “guide” them (nāhal — BSB “leads” in 23:2) to his holy “dwelling” (nāweh, a word that also means pasture or the abode of a flock). The overlap suggests that the psalm reads one person’s life through the pattern of the exodus — rescued, led, provided for and brought to God’s house.',
        synthesis(tahot('Exod 15:13; Ps 23:2–3, 6'), tbesh('H5148; H5095; H2617A; H5116A'), bsb('Exod 15:13')),
      ),
      tags: ['exodus', 'guidance', 'hesed', 'house'],
    },
    {
      id: 'psalm-23:xr:deut-2-7',
      from: ps23(1),
      target: ref('DEU', 2, 7),
      relationship: 'same-concept',
      title: 'Forty years, and “you have lacked nothing”',
      explanation: text(
        'Moses sums up the wilderness years: “The LORD your God has been with you these forty years, and you have lacked nothing.” The verb is the same as “I shall not want” (ḥāsēr), and the verse joins God’s presence (“with you”) to his provision — the two themes of Psalm 23:1 and 23:4. Nehemiah 9:21 recalls the same history with the same verb. The psalm does not mention the wilderness, but the Tyndale notes on 23:1 and Sinclair Ferguson both point to this verse: read alongside it, the single sheep of Psalm 23 enjoys what the whole flock of Israel experienced in the desert.',
        synthesis(tahot('Deut 2:7; Neh 9:21; Ps 23:1'), bsb('Deut 2:7; Neh 9:21'), tyndale('on Ps 23:1'), cite('ferguson-lord-is-my-shepherd')),
      ),
      tags: ['want', 'wilderness', 'provision', 'presence'],
    },
    {
      id: 'psalm-23:xr:ps-80-1',
      from: ps23(1),
      target: ref('PSA', 80, 1),
      relationship: 'same-concept',
      title: 'Shepherd of Israel',
      explanation: text(
        'Psalm 80 prays to God as “Shepherd of Israel, who leads Joseph like a flock,” enthroned between the cherubim. It shows the communal and royal side of the image: the LORD shepherds his whole people as their king. Psalm 23 turns that national confession into a personal one — “my shepherd.”',
        synthesis(tahot('Ps 80:1'), bsb('Ps 80:1'), tyndale('on Ps 80:1-2', 'https://bible.helloao.org/api/c/tyndale/PSA/80.json')),
      ),
      tags: ['shepherd', 'king', 'israel'],
    },
    {
      id: 'psalm-23:xr:ps-27-4',
      from: ps23(6),
      target: ref('PSA', 27, 4),
      relationship: 'parallel',
      title: 'Dwelling in the LORD’s house all my days',
      explanation: text(
        'Psalm 27:4 is the closest parallel to 23:6: “to dwell in the house of the LORD all the days of my life.” It shares the Hebrew phrase “all the days of my life” and uses šibtî, “my dwelling,” from yāšab — the verb the ancient translations read in 23:6. It also shows what “the house of the LORD” meant to David: the place to gaze on the LORD’s beauty and seek him in his temple.',
        synthesis(tahot('Ps 27:4; Ps 23:6'), bsb('Ps 27:4'), tyndale('on Pss 23–28')),
      ),
      tags: ['house', 'dwell', 'worship'],
    },
    {
      id: 'psalm-23:xr:ps-16-5',
      from: ps23(5),
      target: ref('PSA', 16, 5),
      relationship: 'thematic',
      title: 'The LORD, my portion and my cup',
      explanation: text(
        'Another psalm of David uses the cup as a picture of one’s allotted portion: “The LORD is my chosen portion and my cup; You have made my lot secure.” Read alongside 23:5, the overflowing cup is more than a full drink: it is a life whose portion, given by God, is more than enough.',
        synthesis(bsb('Ps 16:5; Ps 23:5')),
      ),
      tags: ['cup', 'provision', 'portion'],
    },
    {
      id: 'psalm-23:xr:isa-40-11',
      from: ps23(1, 2),
      target: ref('ISA', 40, 11),
      relationship: 'thematic',
      title: 'He gently leads the nursing ewes',
      explanation: text(
        'Isaiah’s message of comfort to the exiles pictures the LORD coming as a shepherd: he gathers the lambs in his arms and “gently leads” the nursing ewes. The Hebrew uses the same two words as Psalm 23 — rāʿâ, “shepherd,” and nāhal, “lead,” a rare verb (10 occurrences) for leading with care to rest and refreshment. What David confessed personally, the prophet promises to a whole people coming home.',
        synthesis(tahot('Isa 40:11; Ps 23:1–2; occurrence count of H5095 made for this study'), tbesh('H5095 נָהַל'), bsb('Isa 40:11')),
      ),
      tags: ['shepherd', 'guidance', 'exile', 'comfort'],
    },
    {
      id: 'psalm-23:xr:isa-43-2',
      from: ps23(4),
      target: ref('ISA', 43, 2),
      relationship: 'thematic',
      title: '“I will be with you” through waters and fire',
      explanation: text(
        'God’s promise to Israel — “When you pass through the waters, I will be with you … when you walk through the fire, you will not be scorched” — follows the same logic as 23:4. Neither text promises that God’s people will avoid danger; both promise his presence in it. That is why the psalmist can say, “I will fear no evil, for You are with me.”',
        synthesis(bsb('Isa 43:2; Ps 23:4'), calvin('on Ps 23:4')),
      ),
      tags: ['presence', 'fear', 'suffering'],
    },
    {
      id: 'psalm-23:xr:jer-23-1',
      from: ps23(1, 3),
      target: ref('JER', 23, 1, 6),
      relationship: 'contrast',
      title: 'Bad shepherds and the righteous Branch',
      explanation: text(
        'Jeremiah denounces Judah’s kings as shepherds who “destroy and scatter the sheep,” then promises that the LORD himself will gather his flock and bring them back to their pasture, and will raise up for David a righteous Branch. It is Psalm 23 in reverse: where human shepherds failed to provide, guide and protect, God will do what the psalm confesses. The coming king’s name, “The LORD Our Righteousness” (ṣidqēnû, from the same root as ṣedeq, “righteousness,” in 23:3), can be heard as answering the psalm’s “paths of righteousness.”',
        synthesis(
          bsb('Jer 23:1–6 (with footnote on 23:6)'),
          tahot('Jer 23:3, 6; Ps 23:3'),
          tyndale('on Jer 23:1-4', 'https://bible.helloao.org/api/c/tyndale/JER/23.json'),
        ),
      ),
      tags: ['shepherd', 'king', 'righteousness', 'messiah'],
    },
    {
      id: 'psalm-23:xr:ezek-34-11',
      from: ps23(1, 3),
      target: ref('EZK', 34, 11, 24),
      relationship: 'parallel',
      title: 'God will shepherd his flock himself',
      explanation: text(
        'Ezekiel 34 reads like Psalm 23 turned into divine promise. After condemning Israel’s selfish shepherds, God says, “I Myself will search for My flock,” “I will feed them in good pasture … there they will lie down,” “I will tend My flock and make them lie down” (the same verb and stem as “He makes me lie down,” 23:2), and “I will seek the lost, bring back the strays.” Then he promises “one shepherd, My servant David” (34:23) — the chapter Jesus has in view when he calls himself the good shepherd, according to the Tyndale notes on John 10.',
        synthesis(
          tahot('Ezek 34:14–15; Ps 23:2'),
          bsb('Ezek 34:11–24'),
          tyndale('on Ezek 34:12-16', 'https://bible.helloao.org/api/c/tyndale/EZK/34.json'),
          tyndale('on John 10:1-21', 'https://bible.helloao.org/api/c/tyndale/JHN/10.json'),
        ),
      ),
      tags: ['shepherd', 'rest', 'promise', 'david', 'messiah'],
    },
    {
      id: 'psalm-23:xr:luke-7-44',
      from: ps23(5),
      target: ref('LUK', 7, 44, 46),
      relationship: 'historical',
      title: 'Anointing a guest’s head with oil',
      explanation: text(
        'When Simon the Pharisee neglected the usual courtesies, Jesus observed, “You did not anoint My head with oil.” The Tyndale notes explain that anointing a guest’s head with olive oil was a way to honour a respected visitor. The scene shows the custom behind 23:5: the LORD treats the psalmist not as a tolerated stranger but as an honoured guest.',
        synthesis(bsb('Luke 7:44–46'), tyndale('on Luke 7:44-46', 'https://bible.helloao.org/api/c/tyndale/LUK/7.json')),
      ),
      tags: ['anoint', 'hospitality', 'table'],
    },
    {
      id: 'psalm-23:xr:mark-6-34',
      from: ps23(1, 2),
      target: ref('MRK', 6, 34, 42),
      relationship: 'allusion',
      title: 'Sheep without a shepherd, seated on green grass',
      explanation: text(
        'Mark tells how Jesus had compassion on the crowd “because they were like sheep without a shepherd” (echoing Num 27:17), taught them, had them sit down “on the green grass,” and fed them until they “all ate and were satisfied.” Many readers hear Psalm 23 behind the scene — the shepherd who makes his flock lie down in green pasture and provides so that they lack nothing — with Jesus doing what the psalm says the LORD does. Kenneth Bailey gives a chapter of his study of the shepherd theme to this passage.',
        synthesis(bsb('Mark 6:34–42; Num 27:17'), tagnt('Mark 6:39'), cite('bailey-good-shepherd', 'ch. 5')),
      ),
      tags: ['shepherd', 'provision', 'compassion', 'green pastures'],
    },
    {
      id: 'psalm-23:xr:luke-15-3',
      from: ps23(3),
      target: ref('LUK', 15, 3, 7),
      relationship: 'thematic',
      title: 'The shepherd who brings back the lost',
      explanation: text(
        'In Jesus’ parable the shepherd leaves the ninety-nine, goes after the one lost sheep “until he finds it,” and carries it home on his shoulders rejoicing. The story gives narrative shape to “He restores my soul” — the Shepherd brings back the one who has strayed — and Jesus applies it to God’s joy over one sinner who repents. Matthew Henry reads 23:3 in just this way: the Shepherd restores me when I wander.',
        synthesis(bsb('Luke 15:3–7'), henry('on Ps 23:3')),
      ),
      tags: ['restore', 'lost', 'repentance'],
    },
    {
      id: 'psalm-23:xr:john-10-11',
      from: ps23(1),
      target: ref('JHN', 10, 11, 18),
      relationship: 'same-concept',
      title: '“I am the good shepherd”',
      explanation: text(
        'Jesus claims for himself the role Psalm 23 gives to the LORD and that Ezekiel 34 promised God would take up in person: “I am the good shepherd.” He knows his sheep and they know him; unlike the hired hand, he “lays down His life for the sheep” and takes it up again. Christians therefore read Psalm 23 as fulfilled in Christ — not because David wrote about Jesus directly, but because the Shepherd he trusted has come near in Jesus. The Tyndale notes on John 10 place Psalm 23 within the Old Testament tradition of God as Israel’s shepherd that Jesus draws on, and say that he reflects on Israel’s leaders in the light of Ezekiel 34. Franz Delitzsch, in the Keil–Delitzsch commentary, makes the connection: the psalmist’s “my shepherd” finds its answer in “I am the good shepherd.”',
        synthesis(bsb('John 10:11–18'), tagnt('John 10:11'), kd('on Ps 23:1'), tyndale('on John 10:1-21', 'https://bible.helloao.org/api/c/tyndale/JHN/10.json')),
      ),
      tags: ['good shepherd', 'christ', 'fulfilment', 'life'],
    },
    {
      id: 'psalm-23:xr:heb-13-20',
      from: ps23(4),
      target: ref('HEB', 13, 20, 21),
      relationship: 'same-concept',
      title: 'The great Shepherd, brought back from the dead',
      explanation: text(
        'Hebrews blesses “the God of peace, who … brought back from the dead our Lord Jesus, that great Shepherd of the sheep.” The Greek phrase “the shepherd of the sheep,” with God bringing him up, echoes the Greek Old Testament of Isaiah 63:11, which speaks of God bringing Moses, “the shepherd of the sheep,” up from the sea. The Shepherd who leads his flock through the valley of the shadow of death has himself gone through death and out again.',
        synthesis(tagnt('Heb 13:20'), cite('lxx-brenton', 'Isa 63:11 LXX', 'https://bible.helloao.org/api/grc_bre/ISA/63.json'), bsb('Heb 13:20; Isa 63:11')),
      ),
      tags: ['great shepherd', 'resurrection', 'death', 'christ'],
    },
    {
      id: 'psalm-23:xr:1pet-2-25',
      from: ps23(3),
      target: ref('1PE', 2, 25),
      relationship: 'same-concept',
      title: 'Returned to the Shepherd of your souls',
      explanation: text(
        'Peter, quoting Isaiah 53:6, tells believers that they were “like sheep going astray,” but have now “returned to the Shepherd and Overseer of your souls.” His Greek shares three key words with the Septuagint of Psalm 23 (Ps 22 in its numbering): the verb for turning back (epistrephō — “he turned back my soul,” 22:3 LXX), “soul” (psychē) and “shepherd” (poimēn/poimainō). What the psalm describes from the sheep’s side — the Shepherd restoring the soul — Peter describes as conversion to Christ.',
        synthesis(tagnt('1 Pet 2:25'), lxx('Ps 22:1, 3 LXX (= Ps 23:1, 3)'), bsb('1 Pet 2:25')),
      ),
      tags: ['restore', 'soul', 'conversion', 'shepherd'],
    },
    {
      id: 'psalm-23:xr:1pet-5-4',
      from: ps23(1),
      target: ref('1PE', 5, 2, 4),
      relationship: 'same-concept',
      title: 'The Chief Shepherd will appear',
      explanation: text(
        'Peter urges church elders to “be shepherds of God’s flock” willingly and humbly, as examples rather than lords, because “the Chief Shepherd” will appear. Psalm 23’s picture of God’s shepherding becomes the pattern for leaders in the church, who are under-shepherds answerable to Christ. F. B. Meyer maps the three New Testament titles onto Psalms 22–24: the Good Shepherd who died, the Great Shepherd who keeps his flock, and the Chief Shepherd who is coming again.',
        synthesis(bsb('1 Pet 5:2–4'), cite('meyer-shepherd-psalm', 'ch. 1', MEYER_URL), tyndale('on Ezek 34:1-24', 'https://bible.helloao.org/api/c/tyndale/EZK/34.json')),
      ),
      tags: ['chief shepherd', 'church', 'leadership', 'hope'],
    },
    {
      id: 'psalm-23:xr:rev-7-17',
      from: ps23(1, 2),
      target: ref('REV', 7, 17),
      relationship: 'allusion',
      title: 'The Lamb will be their shepherd',
      explanation: text(
        'The BSB’s own note on Psalm 23:1 points here. In John’s vision “the Lamb in the center of the throne will be their shepherd” and will “lead them to springs of living water,” wiping away every tear. The Greek verbs for “shepherd” (poimainō) and “lead” (hodēgeō) are the ones the Septuagint uses in Psalm 23:1 and 3, and the scene also takes up Isaiah 49:10, where God leads his people — with nāhal, the verb of 23:2 — beside springs of water (the BSB notes on Rev 7:17 point to both Psalm 23:1 and Isaiah 49:10). Revelation fulfils Isaiah’s promise in language that echoes Psalm 23: the psalm’s pastures and waters become a picture of the final home of God’s people.',
        synthesis(bsb('Ps 23:1 footnote; Rev 7:17 footnotes; Isa 49:10'), tagnt('Rev 7:17'), lxx('Ps 22:1, 3 LXX (= Ps 23:1, 3)'), tahot('Isa 49:10'), kd('on Ps 23:2')),
      ),
      tags: ['lamb', 'hope', 'waters', 'eschatology'],
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Historical & cultural context                                    */
  /* ---------------------------------------------------------------- */
  context: [
    {
      id: 'psalm-23:ctx:shepherd-kings',
      category: 'ancient-near-east',
      title: 'Kings as shepherds in the ancient Near East',
      summary:
        'Across the ancient Near East rulers were routinely called the shepherds of their people. In the epilogue to his law code, Hammurabi of Babylon (reigned c. 1792–1750 BC) calls himself “the salvation-bearing shepherd, whose staff is straight.” When David calls the LORD “my shepherd,” he is using royal language — and, as a king himself, placing himself among the sheep.',
      detail:
        'The Tyndale notes observe that the earthly king was understood to represent the divine shepherd who had set him over his people, and that good kings who led their people strongly and wisely resembled shepherds. Israel’s Scriptures use the image of David (“You will shepherd My people Israel,” 2 Sam 5:2), of the Persian king Cyrus (“My shepherd,” Isa 44:28) and, negatively, of the kings who scattered the flock (Jer 23:1–2; Ezek 34:2–6). Hammurabi’s epilogue even gathers images that recall the psalm — a straight staff, a good shadow spread over his city, people allowed to repose in peace — but the psalm gives the shepherd’s role to God rather than to a human king.',
      relatedVerses: [v(1), v(4)],
      tags: ['shepherd', 'king', 'hammurabi', 'ancient near east', 'original audience'],
      provenance: historical(
        'editorial',
        cite('king-code-of-hammurabi', 'Epilogue', HAMMURABI_URL),
        cite('wikipedia-hammurabi', undefined, 'https://en.wikipedia.org/wiki/Hammurabi'),
        tyndale('on Ezek 34:1-24', 'https://bible.helloao.org/api/c/tyndale/EZK/34.json'),
        tyndale('on Ps 23:1-3'),
        bsb('2 Sam 5:2; Isa 44:28'),
      ),
    },
    {
      id: 'psalm-23:ctx:shepherding',
      category: 'customs',
      title: 'A shepherd’s work in ancient Israel',
      summary:
        'Shepherding was hard, exposed work. David was out with his father’s sheep when Samuel sent for him (1 Sam 16:11), and he told Saul how he had rescued lambs from a lion and a bear (1 Sam 17:34–35). Shepherds had to protect the flock from wild animals, endure heat, cold, wind and rain, know their sheep individually and lead them to good pasture and quiet water.',
      detail:
        'At night a wilderness shepherd might keep the flock in a sheepfold — a pen with low stone walls topped with thorny branches. By day he led from the front, and the sheep followed a voice they knew (John 10:3–4); a good shepherd leads rather than drives. Jacob’s refusal to drive nursing animals too hard, moving “at a comfortable pace for the livestock” (Gen 33:13–14), uses a form of nāhal, the verb translated “He leads me” in 23:2.',
      relatedVerses: [v(1), v(2)],
      tags: ['shepherd', 'david', 'sheep', 'customs', 'original audience'],
      provenance: historical(
        'editorial',
        tyndale('on Ezek 34:1-24', 'https://bible.helloao.org/api/c/tyndale/EZK/34.json'),
        tyndale('on John 10:1, 10:3, 10:4', 'https://bible.helloao.org/api/c/tyndale/JHN/10.json'),
        bsb('1 Sam 16:11; 17:34–35; Gen 33:13–14'),
        tahot('Gen 33:14'),
      ),
    },
    {
      id: 'psalm-23:ctx:wilderness',
      category: 'geography',
      title: 'Pastures, ravines and the wilderness',
      summary:
        'The psalm’s landscape is one David knew: his father’s few sheep grazed “in the wilderness” (1 Sam 17:28), where green pasture and quiet water are precious. The “valley” of verse 4 (gêʾ) is, in the lexicon’s words, a steep valley or narrow gorge, and Jeremiah uses the word ṣalmāwet for the menace of the wilderness — “a land of drought and darkness” (Jer 2:6).',
      detail:
        'Franz Delitzsch, in the Keil–Delitzsch commentary, explains the word for “pastures” (nāʾôt) as a resting or dwelling place, even an oasis — a verdant spot in the desert. Israel’s memory of the wilderness also shaped the psalm’s language: there the LORD led his people “like a flock” (Ps 78:52) and they “lacked nothing” (Deut 2:7).',
      relatedVerses: [v(2), v(4)],
      tags: ['wilderness', 'valley', 'geography', 'pastures', 'water'],
      provenance: historical(
        'editorial',
        tbesh('H1516R גַּיְא; H6757; H4999'),
        tahot('Jer 2:6'),
        kd('on Ps 23:2'),
        bsb('1 Sam 17:28; Jer 2:6; Ps 78:52; Deut 2:7'),
      ),
    },
    {
      id: 'psalm-23:ctx:rod-staff',
      category: 'customs',
      title: 'Rod and staff',
      summary:
        'The shepherd carried two tools. The šēbeṭ was a rod or club — a shepherd’s implement, as the lexicon puts it — used to fight off predators and to guide and count the flock; the mišʿenet was a staff to lean on. The Tyndale notes observe that the shepherd used his rod and staff to fend off danger.',
      detail:
        'Leviticus mentions animals counted as they pass “under the shepherd’s rod” (Lev 27:32), and David went out to face Goliath with “his staff in his hand” (1 Sam 17:40) — the Tyndale notes observe that Goliath could see only the staff, not the concealed sling. The same word šēbeṭ is used for a ruler’s sceptre (Gen 49:10), and Micah prays, “Shepherd with Your staff Your people” (Mic 7:14).',
      relatedVerses: [v(4)],
      tags: ['rod', 'staff', 'comfort', 'protection', 'customs'],
      provenance: historical(
        'editorial',
        tbesh('H7626G; H4938A–B'),
        tyndale('on Ps 23:4'),
        tyndale('on 1 Sam 17:43', 'https://bible.helloao.org/api/c/tyndale/1SA/17.json'),
        bsb('Lev 27:32; 1 Sam 17:40; Gen 49:10; Mic 7:14'),
      ),
    },
    {
      id: 'psalm-23:ctx:hospitality',
      category: 'customs',
      title: 'The host’s table and the anointed guest',
      summary:
        'Verse 5 draws on the customs of hospitality. The host prepares a meal for his guest in full view of enemies who can watch but cannot trouble him, and honours him by anointing his head with oil. In Jesus’ day, anointing a guest’s head with olive oil was still a way to honour a respected visitor (Luke 7:44–46).',
      detail:
        'The Tyndale notes add that anointing the head showed a guest honour, hospitality and refreshment (compare Ps 92:10; 133:2). Franz Delitzsch, in the Keil–Delitzsch commentary, suggests a concrete moment in David’s life: when he fled from Absalom, allies brought beds, food and drink to his exhausted people in the wilderness (2 Sam 17:27–29). The psalm itself, however, names no occasion.',
      relatedVerses: [v(5)],
      tags: ['table', 'anoint', 'oil', 'cup', 'enemies', 'hospitality', 'customs'],
      provenance: historical(
        'editorial',
        tyndale('on Ps 23:5'),
        tyndale('on Luke 7:44-46', 'https://bible.helloao.org/api/c/tyndale/LUK/7.json'),
        kd('on Ps 23:5'),
        bsb('Luke 7:44–46; 2 Sam 17:27–29'),
      ),
    },
    {
      id: 'psalm-23:ctx:superscription',
      category: 'authorship',
      title: '“A Psalm of David”',
      summary:
        'The Hebrew heading, mizmôr lədāwid, is usually translated “A Psalm of David.” The preposition lə- can mean “by,” “for,” “dedicated to” or “concerning,” so the heading may name David as author or connect the psalm with him; the Tyndale introduction urges caution about reading every such heading as authorship, while granting that many of these psalms could have been written by David.',
      detail:
        'In Hebrew Bibles the heading is counted as part of verse 1, which is why Hebrew and English verse numbers often differ. Interpreters who accept Davidic authorship differ about when he wrote it: Calvin reads it as the words of David at the height of his royal prosperity, Spurgeon and Maclaren picture the king looking back on his shepherd years, and Franz Delitzsch (in the Keil–Delitzsch commentary) connects it with David’s flight from Absalom (2 Sam 17:27–29). The text itself gives no occasion.',
      relatedVerses: [v(1)],
      tags: ['david', 'authorship', 'superscription', 'title', 'date'],
      provenance: historical(
        'editorial',
        tyndaleIntro,
        tahot('Ps 23:0 (Heb. 23:1a)'),
        calvin('on Ps 23:1'),
        cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 3006', 'https://ccel.org/ccel/spurgeon/sermons52.xxxix.html'),
        cite('maclaren-expositions-of-holy-scripture', '“The Shepherd King of Israel”', MACLAREN_URL),
        kd('on Ps 23:5-6'),
      ),
    },
    {
      id: 'psalm-23:ctx:genre',
      category: 'genre',
      title: 'A psalm of trust',
      summary:
        'Psalm 23 belongs to the psalms of trust: it contains no complaint and no petition, only confident statements about God and to God. The Tyndale notes call it a psalm of trust and confidence in the Lord and place it in a group (Pss 23–28) that develops God’s shepherding care, guidance, goodness and the longing to live in his house.',
      detail:
        'It sits in Book One of the Psalter (Pss 1–41), where the divine name YHWH predominates. Matthew Henry contrasts it with the many psalms of David that are full of complaints: this one, he says, is full of comforts. Its poetry works mainly by paired lines and images rather than rhyme (whether Hebrew poetry has a regular metre is debated).',
      relatedVerses: [v(1)],
      tags: ['genre', 'trust', 'poetry', 'psalms'],
      provenance: literary(tyndale('on Pss 23–28; Ps 23'), tyndaleIntro, henry('introduction to Ps 23')),
    },
    {
      id: 'psalm-23:ctx:christian-worship',
      category: 'religious',
      title: 'Psalm 23 in Christian worship',
      summary:
        'Christians have prayed and sung this psalm from the early church onward. In the late fourth century the mystagogic lectures ascribed to Cyril of Jerusalem (some scholars assign them to his successor John) used verse 5 to teach the newly baptized about the Lord’s Table and the anointing they had received, and Augustine read its “water of refreshing” as baptism. The Scottish metrical version “The Lord’s my shepherd” first appeared in the Scots Metrical Psalter of 1650, and Spurgeon remarked that verse 4 had been sung at countless deathbeds.',
      detail:
        'Spurgeon opened his 1880 sermon on verse 4 by quoting the Scottish metrical version. Henry W. Baker’s hymn “The King of love my Shepherd is” paraphrases the psalm with explicit reference to Christ and his cross; F. B. Meyer printed it at the front of The Shepherd Psalm.',
      relatedVerses: [v(4), v(5)],
      tags: ['worship', 'liturgy', 'baptism', 'eucharist', 'funeral', 'hymn'],
      provenance: historical(
        'editorial',
        cite('cyril-catechetical-lectures', 'Lecture 22 (Mystagogic 4), §7', CYRIL_URL),
        cite('wikipedia-cyril-of-jerusalem', 'Mystagogic Catecheses (date and authorship)', WIKI_CYRIL_URL),
        augustine('§2'),
        cite('wikipedia-the-lords-my-shepherd', undefined, 'https://en.wikipedia.org/wiki/The_Lord%27s_My_Shepherd'),
        treasury('Exposition, v4'),
        cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 1595', 'https://www.spurgeon.org/resource-library/sermons/the-valley-of-the-shadow-of-death/'),
        cite('meyer-shepherd-psalm', 'front matter', MEYER_URL),
      ),
    },
    {
      id: 'psalm-23:ctx:jewish-tradition',
      category: 'jewish-tradition',
      title: 'Psalm 23 in Jewish reading and prayer',
      summary:
        'In Jewish practice the psalm (Mizmor leDavid) is prayed especially on the Sabbath: an article on Chabad.org describes it as most famously sung at the third Sabbath meal, adds that some communities (including Chabad) also say it before the other Sabbath meals, and traces the custom to the sixteenth-century kabbalist Isaac Luria. The article presents it as a confession that God provides.',
      detail:
        'Jewish interpreters have read the psalm against Israel’s story. According to John Gill’s notes, the Aramaic Targum paraphrases verse 1 of God feeding Israel in the wilderness, reads the dark valley as captivity and understands the house of verse 6 as the sanctuary, while the medieval commentators Rashi and David Kimchi linked the valley with David’s flight from Saul in the wilderness of Ziph.',
      relatedVerses: [v(1), v(4), v(6)],
      tags: ['jewish', 'sabbath', 'targum', 'rashi', 'kimchi', 'liturgy'],
      provenance: historical('editorial', cite('chabad-psalm-23', undefined, CHABAD_URL), gill('on Ps 23:1, 4, 6'), cite('rashi-on-psalms', 'on Ps 23:4', RASHI_URL)),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Literary context                                                 */
  /* ---------------------------------------------------------------- */
  literary: {
    placeInBook: text(
      'Psalm 23 sits in Book One of the Psalter (Pss 1–41), among the psalms linked with David (Pss 3–32; 34–41), where the divine name YHWH predominates. It follows Psalm 22, which opens “My God, my God, why have You forsaken me?”, and precedes Psalm 24, where the King of Glory enters his gates. Spurgeon notes that it follows Psalm 22, “peculiarly the Psalm of the Cross,” and that the shepherd psalm comes only after it; F. B. Meyer reports that Psalm 23 “has sometimes been called the Psalm of the Crook,” lying between the Psalm of the Cross and the Psalm of the Crown. The Tyndale notes also group Psalms 23–28 around God’s shepherding care, his guidance, his goodness and the longing to live in his house.',
      synthesis(tyndaleIntro, tyndale('on Pss 23–28'), treasury('introduction'), cite('meyer-shepherd-psalm', 'ch. 1', MEYER_URL), bsb('Ps 22:1; 24:7')),
    ),
    argument: text(
      'The psalm moves in two stages. In verses 1–4 the LORD is the shepherd: he provides (v1), gives rest and water (v2), restores and guides (v3), and accompanies the sheep through the darkest valley (v4). In verses 5–6 the picture becomes a banquet: the LORD is the host who spreads a table in front of enemies, honours the guest with oil and fills his cup, until goodness and ḥesed pursue the psalmist all his days and bring him to the LORD’s house. On the way David stops talking about God and begins talking to him — “He” becomes “You” at the moment the valley turns dark.',
      synthesis(kd('on Ps 23:4-5'), cite('maclaren-expositions-of-holy-scripture', '“The Shepherd King of Israel”', MACLAREN_URL), tahot('Ps 23:2–5 (verb persons)')),
    ),
    placeInCanon: text(
      'The shepherd image runs through the whole Bible. Jacob blesses “the God who has been my shepherd” (Gen 48:15); God leads Israel through the wilderness like a flock (Ps 78:52); David is taken from the sheepfolds to shepherd Israel (Ps 78:70–72; 2 Sam 5:2). When Israel’s kings fail as shepherds, the prophets promise that God himself will shepherd his people and raise up a shepherd from David’s line (Jer 23:1–6; Ezek 34:11–24). Jesus claims the role (John 10:11), the New Testament letters call him the great and the chief Shepherd (Heb 13:20; 1 Pet 5:4), and Revelation closes the story with the Lamb shepherding his people to springs of living water (Rev 7:17).',
      synthesis(
        bsb('Gen 48:15; Ps 78:52, 70–72; 2 Sam 5:2; Jer 23:1–6; Ezek 34:11–24; John 10:11; Heb 13:20; 1 Pet 5:4; Rev 7:17'),
        tyndale('on John 10:1-21', 'https://bible.helloao.org/api/c/tyndale/JHN/10.json'),
      ),
    ),
    bookOutline: [
      { label: 'Book One — Psalms 1–41', ref: chapters('PSA', 1, 41), current: true },
      { label: 'Book Two — Psalms 42–72', ref: chapters('PSA', 42, 72) },
      { label: 'Book Three — Psalms 73–89', ref: chapters('PSA', 73, 89) },
      { label: 'Book Four — Psalms 90–106', ref: chapters('PSA', 90, 106) },
      { label: 'Book Five — Psalms 107–150', ref: chapters('PSA', 107, 150) },
    ],
    passageOutline: [
      { label: 'The LORD my shepherd: provision, rest and guidance', ref: ps23(1, 3) },
      { label: 'Through the darkest valley: “You are with me”', ref: ps23(4) },
      { label: 'The LORD my host: table, oil and cup', ref: ps23(5) },
      { label: 'Pursued by goodness, at home in the LORD’s house', ref: ps23(6) },
    ],
    features: [
      {
        id: 'psalm-23:lit:centre',
        type: 'poetry',
        title: '“For You are with me” at the centre (by one word count)',
        description:
          'Counting the Hebrew words of verses 1–6 as they are divided in STEPBible’s tagged text (leaving aside the heading “A Psalm of David” and counting words joined by a maqqef hyphen separately), the psalm has 55 words. The three words kî-ʾattāh ʿimmādî, “for You are with me” (v4), are words 27–29: exactly 26 words come before them and exactly 26 after. Whether or not the poet counted, the confession of God’s presence stands at the psalm’s arithmetical and emotional centre. The result depends on the counting convention — treat maqqef-joined words as one and the halves no longer balance — so it is best offered as an observation, not a proof of design.',
        verses: [v(4)],
        structure: [
          { label: 'Words 1–26', text: 'vv. 1–4a: the LORD as shepherd, up to “I will fear no evil”', ref: ps23(1, 4), level: 0 },
          { label: 'Words 27–29', text: 'kî-ʾattāh ʿimmādî — “for You are with me”', ref: ps23(4), level: 1 },
          { label: 'Words 30–55', text: 'vv. 4b–6: rod and staff, table, oil and cup, goodness and ḥesed, the LORD’s house', ref: ps23(4, 6), level: 0 },
        ],
        tags: ['structure', 'centre', 'presence', 'with me'],
        provenance: literary(tahot('Ps 23:1–6 — word count made for this study (words #03–#06 of v1 through #12 of v6)')),
      },
      {
        id: 'psalm-23:lit:he-to-you',
        type: 'transition',
        title: 'From “He” to “You”',
        description:
          'In verses 1–3 David speaks about the LORD in the third person (“He makes me lie down … He leads me … He restores … He guides”). In verse 4, as the valley darkens, he turns to address God directly — “for You are with me; Your rod and Your staff” — and keeps speaking to him through verse 5 (“You prepare … You anoint”). Verse 6 closes with the name again: “the house of the LORD.” The grammar enacts the psalm’s point: in danger, talk about God becomes talk with God.',
        verses: [v(3), v(4), v(5)],
        tags: ['structure', 'prayer', 'presence', 'grammar'],
        provenance: literary(tahot('Ps 23:2–5 — 3rd-person verbs in vv2–3, 2nd-person forms in vv4–5'), bsb('Ps 23:2–5')),
      },
      {
        id: 'psalm-23:lit:inclusio',
        type: 'inclusio',
        title: 'Framed by the LORD’s name',
        description:
          'The divine name YHWH occurs only twice in the psalm — as the first word after the heading “A Psalm of David” (v1) and in its last line (v6, “the house of the LORD”). The frame holds everything in between — pasture, valley, table — inside the LORD’s name.',
        verses: [v(1), v(6)],
        tags: ['structure', 'divine name', 'lord'],
        provenance: literary(tahot('Ps 23:1 (word #03) and 23:6 (word #10), H3068G')),
      },
      {
        id: 'psalm-23:lit:two-images',
        type: 'metaphor',
        title: 'Shepherd and host — or one journey?',
        description:
          'Most commentators see two pictures: the LORD as shepherd (vv1–4) and as host (vv5–6). Franz Delitzsch, in the Keil–Delitzsch commentary, notes that the figure of the shepherd fades after verse 4 and that of the host appears; Maclaren divides the psalm into two halves — the sheep of his pasture and the guests at his table and in his house. The images can also be read as one continuous journey, from pasture through the valley to the host’s house, and the vocabulary the psalm shares with Exodus 15:13 (the verbs for leading and guiding, ḥesed, God’s “dwelling”) suggests an echo of Israel’s exodus journey.',
        verses: [v(1), v(4), v(5), v(6)],
        tags: ['metaphor', 'shepherd', 'host', 'journey', 'exodus'],
        provenance: literary(
          kd('on Ps 23:4-5'),
          cite('maclaren-expositions-of-holy-scripture', '“The Shepherd King of Israel”', MACLAREN_URL),
          tahot('Exod 15:13; Ps 23:2–3, 6'),
        ),
      },
      {
        id: 'psalm-23:lit:return-echo',
        type: 'repetition',
        title: 'Brought back — and coming home',
        description:
          'The verb šûb (“turn back, return”) appears in verse 3 — “He restores (brings back) my soul” — and, in the Hebrew text as vocalised by the Masoretes, again in verse 6: wəšabtî, “and I will return” to the house of the LORD. On that reading the psalm is framed by a double return: the Shepherd brings me back, and I come back home. Many translations follow the ancient versions and read “I will dwell” instead (see the textual note in Perspectives).',
        verses: [v(3), v(6)],
        tags: ['repetition', 'restore', 'return', 'dwell'],
        provenance: literary(tahot('Ps 23:3 (H7725H); 23:6 (H7725G, alternative H3427)'), kd('on Ps 23:6')),
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Theology                                                         */
  /* ---------------------------------------------------------------- */
  theology: [
    {
      id: 'psalm-23:th:shepherd-king',
      category: 'providence',
      title: 'The LORD as shepherd-king: provision, guidance, protection',
      summary:
        'Calling the LORD “my shepherd” uses royal language, for in Israel and across the ancient Near East kings were called shepherds. The psalm fills the title with concrete care: provision so that nothing needful is lacking, rest and water, restoration, guidance on right paths, and protection with rod and staff. Calvin reads it as a confession of God’s providence: those whom he has taken under his charge will not lack what is good.',
      detail:
        'The title is also a rebuke to human shepherds who fail (Jer 23:1–2; Ezek 34:2–6): what Israel’s kings did badly, the LORD promises to do himself (Ezek 34:11–16). His guidance is “for His name’s sake” — grounded not in the sheep’s merit but in his own character and reputation, a point both Calvin and the Tyndale notes stress.',
      keyVerses: [ps23(1), ps23(3), ref('EZK', 34, 11, 16)],
      tags: ['providence', 'shepherd', 'king', 'guidance', 'provision'],
      provenance: synthesis(calvin('on Ps 23:1, 3'), tyndale('on Ps 23:3'), tyndale('on Ezek 34:1-24', 'https://bible.helloao.org/api/c/tyndale/EZK/34.json')),
    },
    {
      id: 'psalm-23:th:presence',
      category: 'theology-proper',
      title: 'God’s presence in the dark valley',
      summary:
        'The psalm does not promise a route around the dark valley but company within it: “I will fear no evil, for You are with me.” Calvin observes that David did not claim to be free of all fear, but to overcome it by fixing his eyes on his Shepherd’s staff. The promise of God’s presence in danger recurs across Scripture — “when you pass through the waters, I will be with you” (Isa 43:2) — and takes flesh in Jesus, called Immanuel, “God with us” (Matt 1:23).',
      detail:
        'Augustine read the valley as this mortal life itself, lived under the shadow of death, and God’s presence as Christ dwelling in the heart by faith, so that after the shadow of death the believer may be with him.',
      keyVerses: [ps23(4), ref('ISA', 43, 2), ref('MAT', 1, 23)],
      tags: ['presence', 'fear', 'suffering', 'death', 'comfort'],
      provenance: synthesis(calvin('on Ps 23:4'), augustine('§4'), bsb('Isa 43:2; Matt 1:23')),
    },
    {
      id: 'psalm-23:th:hesed',
      category: 'covenant',
      title: 'Goodness and ḥesed: covenant love that pursues',
      summary:
        'The last verse names what has been at work all along: “goodness and ḥesed,” the LORD’s loyal covenant love. The verb is not a gentle “follow” but “pursue,” the word for hunting down an enemy, now describing God’s kindness chasing his servant all his days. The same ḥesed led Israel out of Egypt to God’s holy dwelling (Exod 15:13) and is celebrated in Israel’s refrain, “His loving devotion endures forever” (Ps 136:1).',
      detail:
        'Because the Shepherd acts “for His name’s sake” (v3), the psalmist’s security rests on God’s character rather than on his own performance: the covenant God has bound himself to his people.',
      keyVerses: [ps23(6), ref('EXO', 15, 13), ref('PSA', 136, 1)],
      tags: ['hesed', 'covenant', 'mercy', 'goodness', 'pursue'],
      provenance: synthesis(tbesh('H2617A; H7291'), kd('on Ps 23:6'), bsb('Exod 15:13; Ps 136:1')),
    },
    {
      id: 'psalm-23:th:house',
      category: 'worship',
      title: 'Welcomed to the LORD’s table and house',
      summary:
        'The psalm ends at a table and in a house. The LORD is host as well as shepherd: he prepares a meal in full view of enemies who cannot interfere, honours his guest with oil and fills his cup. The goal is “the house of the LORD,” the place of worship and of God’s presence, which Psalm 27:4 longs to dwell in “all the days of my life.” The Tyndale notes connect the feast with the messianic banquet promised in Isaiah 25:6 and pictured in Revelation 19:9.',
      detail:
        'Early Christian teachers heard sacramental overtones. The mystagogic lectures ascribed to Cyril of Jerusalem apply the table to the Lord’s Supper and the oil to the anointing of the newly baptized; Augustine reads the “water of refreshing” as baptism, but takes the table as the solid food of mature faith (no longer milk for babes) and the oil as spiritual joy. Calvin keeps the first reference to God’s daily provision for David and to worship in the sanctuary, where David longed to offer sacrifices with his fellow worshippers.',
      keyVerses: [ps23(5), ps23(6), ref('PSA', 27, 4), ref('ISA', 25, 6)],
      tags: ['worship', 'table', 'house', 'banquet', 'sacraments'],
      provenance: synthesis(
        tyndale('on Ps 23 (messianic banquet) and 23:5'),
        bsb('Ps 27:4; Isa 25:6; Rev 19:9'),
        cite('cyril-catechetical-lectures', 'Lecture 22 (Mystagogic 4), §7', CYRIL_URL),
        augustine('§§2, 5'),
        calvin('on Ps 23:5-6'),
      ),
    },
    {
      id: 'psalm-23:th:christ-shepherd',
      category: 'christology',
      title: 'The Shepherd revealed in Jesus',
      summary:
        'Christians read Psalm 23 in the light of Jesus’ claim, “I am the good shepherd” (John 10:11). In the Old Testament the shepherd of Psalm 23 is the LORD himself, and Ezekiel promised both that God would shepherd his flock in person and that he would appoint “one shepherd, My servant David” (Ezek 34:15, 23). Jesus takes up both strands: the shepherd who lays down his life for the sheep, whom God brought back from the dead as the great Shepherd (Heb 13:20), and who will appear as the Chief Shepherd (1 Pet 5:4).',
      detail:
        'Most interpreters today describe this as typology rather than a claim that David consciously wrote about Jesus, while some older Christian readers (Augustine, John Gill) took the LORD of the psalm to be the Son himself; either way the New Testament presents Jesus as the fulfilment of the pattern the psalm and the prophets set out. Calvin puts it that God has now shown himself to be our shepherd in the person of his only begotten Son far more clearly than he did to those who lived under the Law.',
      keyVerses: [ps23(1), ref('JHN', 10, 11, 18), ref('EZK', 34, 23, 24), ref('HEB', 13, 20)],
      tags: ['christology', 'good shepherd', 'fulfilment', 'typology'],
      provenance: synthesis(bsb('John 10:11; Ezek 34:15, 23; Heb 13:20; 1 Pet 5:4'), calvin('on Ps 23:4'), kd('on Ps 23:1'), augustine('§1'), gill('on Ps 23:1')),
    },
    {
      id: 'psalm-23:th:hope',
      category: 'eschatology',
      title: '“Forever” — hope beyond this life?',
      summary:
        'The Hebrew of verse 6 reads literally “for length of days” (as the BSB and KJV footnotes say), an idiom that can mean a long life (compare Ps 91:16) or, as of God’s house in Psalm 93:5, “for all the days to come”; many translations render it “forever.” Within the Old Testament the line most naturally expresses lifelong communion with God in his house. Christian readers, guided by the New Testament picture of the Lamb who shepherds his people to springs of living water (Rev 7:17), have also heard in it the hope of dwelling with God beyond death — as Matthew Henry and Spurgeon both do. The text allows both a present and a future horizon.',
      detail:
        'The Greek Septuagint has eis makrotēta hēmerōn, literally ‘for length of days’ (Brenton’s English: “for a very long time”). Matthew Henry gives both readings: David’s resolve to stay close to God as long as he lives, and a prospect of perfect bliss in the Father’s house.',
      keyVerses: [ps23(6), ref('REV', 7, 17), ref('PSA', 27, 4), ref('PSA', 93, 5)],
      tags: ['eschatology', 'forever', 'heaven', 'hope', 'length of days'],
      provenance: synthesis(
        bsb('Ps 23:6 footnote; Ps 91:16; Ps 93:5'),
        kjv('Ps 23:6 margin'),
        tahot('Ps 23:6; Ps 91:16; Ps 93:5 (H753 + H3117)'),
        lxx('Ps 22:6 LXX (= Ps 23:6)'),
        lxxEng('Ps 22:6 LXX, Brenton’s English (= Ps 23:6)'),
        henry('on Ps 23:6'),
        treasury('Exposition, v6'),
      ),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Perspectives                                                     */
  /* ---------------------------------------------------------------- */
  perspectives: [
    {
      id: 'psalm-23:ps:tsalmavet',
      question: 'In verse 4, is it “the valley of the shadow of death” or “the valley of deep darkness”?',
      consensus: 'uncertain',
      intro:
        'The Hebrew word ṣalmāwet can be understood in two ways, and translations divide. Some interpreters combine the two: Franz Delitzsch, in the Keil–Delitzsch commentary, derives the word from a root meaning “to overshadow, darken” rather than from a compound, yet holds that as pronounced it “signifies the shadow of death as an epithet of the most fearful darkness.” This is a question of philology rather than doctrine, and the verse’s meaning is not greatly changed either way.',
      perspectives: [
        {
          id: 'psalm-23:ps:tsalmavet:shadow',
          tradition: 'Traditional rendering',
          label: '“The shadow of death”',
          summary:
            'The Masoretic vowels divide the word as ṣal + māwet, “shadow of death,” and this is how the Greek Septuagint (skia thanatou) and, after it, the Latin and English traditions read it; Calvin reports the view of Jewish grammarians who took it as a compound — “deadly shade.” The New Testament uses the same Greek phrase for the darkness Christ dispels (Matt 4:16; Luke 1:79). On this reading the valley is explicitly one where death threatens.',
          representatives: ['calvin', 'matthew-henry', 'spurgeon'],
          keyTexts: [ps23(4), ref('MAT', 4, 16), ref('LUK', 1, 79)],
          provenance: synthesis(lxx('Ps 22:4 LXX (= Ps 23:4)'), calvin('on Ps 23:4'), tagnt('Matt 4:16; Luke 1:79'), tbesh('H6757')),
        },
        {
          id: 'psalm-23:ps:tsalmavet:darkness',
          tradition: 'Philological rendering',
          label: '“Deep darkness”',
          summary:
            'Many modern scholars trace the word to a root meaning “to be dark,” so that it means thick or deep darkness. The reading is not only modern: Rashi, following the tenth-century grammarian Dunash ben Labrat, explains every occurrence of ṣalmāwet as darkness. The BSB footnote offers “the valley of deep darkness,” and STEPBible’s interlinear glosses the word the same way. Its use for the trackless darkness of the wilderness (Jer 2:6) and the darkness of a mine (Job 28:3) supports a broad sense of terrifying darkness.',
          representatives: ['rashi'],
          keyTexts: [ps23(4), ref('JER', 2, 6), ref('JOB', 28, 3)],
          provenance: synthesis(
            cite('rashi-on-psalms', 'on Ps 23:4', RASHI_URL),
            bsb('Ps 23:4 footnote; Jer 2:6; Job 28:3'),
            tahot('Ps 23:4; Jer 2:6'),
            kd('on Ps 23:4'),
          ),
        },
      ],
      commonGround:
        'Both readings picture the most threatening darkness a person can walk through — the lexicon itself gives “death-shadow, deep shadow, deep darkness” — and both put the weight of the verse on its next words: “I will fear no evil, for You are with me.”',
      tags: ['shadow of death', 'darkness', 'translation', 'valley'],
      provenance: synthesis(tbesh('H6757'), bsb('Ps 23:4 footnote'), lxx('Ps 22:4 LXX'), kd('on Ps 23:4'), cite('rashi-on-psalms', 'on Ps 23:4', RASHI_URL)),
    },
    {
      id: 'psalm-23:ps:dwell-return',
      question: 'In verse 6, does the psalmist “dwell” in the house of the LORD or “return” to it — and for how long?',
      consensus: 'uncertain',
      intro:
        'The consonants of the Hebrew word (wšbty) can be read in two ways. The Masoretic vowels give wəšabtî, from šûb, “and I will return”; the ancient Greek and Latin translations read “my dwelling” and “that I may dwell,” as if from yāšab, “to dwell.” The final phrase is literally “for length of days.” This is a textual and interpretive question, not a denominational one.',
      perspectives: [
        {
          id: 'psalm-23:ps:dwell-return:dwell',
          tradition: 'Ancient versions and most translations',
          label: '“I will dwell”',
          summary:
            'The Septuagint reads literally ‘and my dwelling in the house of the Lord for length of days’ (Brenton: “and my dwelling shall be in the house of the Lord for a very long time”), and the Latin Vulgate follows (“ut inhabitem,” ‘that I may dwell’); most English versions, including the KJV, BSB and WEB, read “I will dwell.” The closely parallel Psalm 27:4 uses the infinitive of yāšab — “to dwell in the house of the LORD all the days of my life” — with the same phrase “all the days of my life.” On this reading the psalm ends in settled residence with God.',
          representatives: ['calvin', 'spurgeon'],
          keyTexts: [ps23(6), ref('PSA', 27, 4)],
          provenance: synthesis(
            lxx('Ps 22:6 LXX (= Ps 23:6)'),
            lxxEng('Ps 22:6 LXX, Brenton’s English (= Ps 23:6)'),
            cite('clementine-vulgate', 'Ps 22:6 (= Ps 23:6)', 'https://ebible.org/Scriptures/details.php?id=latVUC'),
            tahot('Ps 27:4; Ps 23:6'),
            calvin('on Ps 23:6'),
          ),
        },
        {
          id: 'psalm-23:ps:dwell-return:return',
          tradition: 'Masoretic Hebrew text',
          label: '“I will return”',
          summary:
            'The Hebrew as vocalised reads “and I will return,” the same verb as “He restores” in verse 3, and STEPBible’s tagged text glosses it that way. Franz Delitzsch, in the Keil–Delitzsch commentary, defends the reading as a pregnant construction (constructio praegnans): having returned, the psalmist will dwell again in the house of the LORD — a homecoming rather than a first arrival. On this reading the psalm is framed by two returns: the Shepherd brings me back, and I come home.',
          representatives: ['keil-delitzsch'],
          keyTexts: [ps23(3), ps23(6)],
          provenance: synthesis(tahot('Ps 23:6 (H7725G; alternative H3427)'), kd('on Ps 23:6')),
        },
      ],
      commonGround:
        'Either way, the psalm ends with the psalmist in the LORD’s house for the length of his days, in the presence of the God who has pursued him with goodness and ḥesed. Whether “length of days” means a full lifetime or reaches beyond death is a further question of interpretation.',
      tags: ['dwell', 'return', 'forever', 'textual criticism', 'house'],
      provenance: synthesis(tahot('Ps 23:6'), lxx('Ps 22:6 LXX'), kd('on Ps 23:6'), bsb('Ps 23:6 footnote')),
    },
    {
      id: 'psalm-23:ps:readings',
      question: 'Who is the Shepherd, and how far should the psalm be read in the light of Christ and the sacraments?',
      consensus: 'historical-debate',
      intro:
        'Jewish and Christian readers have loved this psalm for millennia and read it in different, sometimes overlapping, ways. Within Christianity, too, there is a long-standing difference of method between readings that move quickly to Christ and the sacraments and readings that begin with David’s own situation.',
      perspectives: [
        {
          id: 'psalm-23:ps:readings:jewish',
          tradition: 'Jewish interpretive tradition',
          label: 'The LORD who shepherds Israel',
          summary:
            'Jewish tradition reads the Shepherd as the LORD, the God of Israel, and often hears the psalm against Israel’s story. According to John Gill’s report, the Targum paraphrases verse 1 of God feeding Israel in the wilderness, reads the dark valley as captivity and takes the house of verse 6 as the sanctuary, while Rashi and David Kimchi linked the valley with David’s flight from Saul in the wilderness of Ziph. The psalm has a treasured place in Sabbath prayer as a confession that God provides.',
          keyTexts: [ps23(1), ps23(6), ref('DEU', 2, 7)],
          provenance: summaryOf(gill('on Ps 23:1, 4, 6'), cite('chabad-psalm-23', undefined, CHABAD_URL), cite('rashi-on-psalms', 'on Ps 23:4', RASHI_URL)),
        },
        {
          id: 'psalm-23:ps:readings:patristic',
          tradition: 'Early church (Christological and sacramental reading)',
          label: 'Christ the Shepherd, feeding his Church',
          summary:
            'Augustine hears the psalm as the voice of the Church speaking to Christ: he reads “the Lord feeds me” of Christ shepherding his people, the “water of refreshing” as baptism and the valley as this mortal life. The mystagogic lectures ascribed to Cyril of Jerusalem, teaching the newly baptized, apply the table to the mystical Table of the Eucharist and the oil to the anointing that seals them. On this reading the psalm becomes a song of Christian initiation.',
          representatives: ['augustine', 'cyril-of-jerusalem'],
          keyTexts: [ps23(2), ps23(5)],
          provenance: summaryOf(
            augustine('§§1–6'),
            cite('cyril-catechetical-lectures', 'Lecture 22 (Mystagogic 4), §7', CYRIL_URL),
          ),
        },
        {
          id: 'psalm-23:ps:readings:reformation',
          tradition: 'Reformation and later Protestant exegesis',
          label: 'David’s confession of providence, fulfilled in Christ',
          summary:
            'Calvin reads the psalm first as David — a wealthy king — confessing himself a poor sheep under God’s providence, and he resists allegory: he declines, for example, to read the “paths of righteousness” as the Spirit’s direction because the shepherd metaphor is still running. Yet he adds that God has shown himself our shepherd far more clearly in his Son. Later Protestant commentators vary: Matthew Henry and Spurgeon apply the psalm warmly to Christ and his people, while John Gill goes further and takes “the LORD” here to be the Son himself.',
          representatives: ['calvin', 'matthew-henry', 'john-gill', 'spurgeon'],
          keyTexts: [ps23(1), ps23(3), ref('JHN', 10, 11)],
          provenance: summaryOf(calvin('on Ps 23:1-4'), henry('on Ps 23:1'), gill('on Ps 23:1'), treasury('Exposition, v4')),
        },
      ],
      commonGround:
        'All these readings agree that the Shepherd is the LORD, the God of Israel, that the psalm expresses trust in his personal care through danger, and that its goal is life in God’s presence. Christians add that this same God has come near as the Good Shepherd in Jesus (John 10:11).',
      tags: ['interpretation', 'christology', 'sacraments', 'jewish reading', 'allegory'],
      provenance: synthesis(
        gill('on Ps 23:1, 4, 6'),
        augustine(''),
        cite('cyril-catechetical-lectures', 'Lecture 22, §7', CYRIL_URL),
        calvin('on Ps 23'),
      ),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Commentary & Christian thinkers                                  */
  /* ---------------------------------------------------------------- */
  commentary: [
    {
      id: 'psalm-23:cm:augustine',
      authorId: 'augustine',
      sourceId: 'augustine-expositions-psalms',
      kind: 'quotation',
      lead: 'On the valley of the shadow of death (his Psalm 22, following the Latin numbering)',
      text: 'Yea, though I walk in the midst of this life, which is the shadow of death. I will fear no evil, for You are with me. I will fear no evil, for You dwell in my heart by faith: and You are now with me, that after the shadow of death I too may be with You.',
      locator: 'Exposition on Psalm 23 (Latin Ps 22), §4',
      url: AUGUSTINE_URL,
      relatedVerses: [v(4)],
      tags: ['valley', 'presence', 'death', 'early church'],
      provenance: verifiedQuote(augustine('§4')),
    },
    {
      id: 'psalm-23:cm:cyril',
      authorId: 'cyril-of-jerusalem',
      sourceId: 'cyril-catechetical-lectures',
      kind: 'quotation',
      lead: 'Teaching the newly baptized about the table of verse 5 (from the mystagogic lectures traditionally ascribed to Cyril)',
      text: 'When the man says to God, You have prepared before me a table, what other does he indicate but that mystical and spiritual Table, which God has prepared for us over against, that is, contrary and in opposition to the evil spirits?',
      locator: 'Catechetical Lecture 22 (Mystagogic Catechesis 4), §7',
      url: CYRIL_URL,
      relatedVerses: [v(5)],
      tags: ['table', 'eucharist', 'sacraments', 'early church'],
      provenance: verifiedQuote(cite('cyril-catechetical-lectures', 'Lecture 22 (Mystagogic 4), §7', CYRIL_URL)),
    },
    {
      id: 'psalm-23:cm:rashi',
      authorId: 'rashi',
      sourceId: 'rashi-on-psalms',
      kind: 'summary',
      lead: 'A medieval Jewish reading of verse 4 (summarised from the Hebrew)',
      text: 'Rashi takes “the valley of ṣalmāwet” as a land of darkness and says David spoke it of the wilderness of Ziph; following the grammarian Dunash ben Labrat, he explains every ṣalmāwet as darkness. He reads “Your rod and Your staff” as the sufferings that had come upon David and the support of his trust in God’s ḥesed: both comfort him, because the sufferings serve for the pardon of sin, and he is confident that God will set a table before him — which Rashi identifies as the kingship.',
      locator: 'on Ps 23:4',
      url: RASHI_URL,
      relatedVerses: [v(4), v(5)],
      tags: ['jewish reading', 'darkness', 'shadow of death', 'rod', 'staff', 'medieval'],
      provenance: summaryOf(cite('rashi-on-psalms', 'on Ps 23:4', RASHI_URL)),
    },
    {
      id: 'psalm-23:cm:calvin',
      authorId: 'calvin',
      sourceId: 'calvin-commentaries',
      kind: 'quotation',
      lead: 'Why God calls himself a shepherd',
      text: 'God, in the Scripture, frequently takes to himself the name, and puts on the character of a shepherd, and this is no mean token of his tender love towards us. As this is a lowly and homely manner of speaking, He who does not disdain to stoop so low for our sake, must bear a singularly strong affection towards us.',
      locator: 'Commentary on the Psalms, on Ps 23:1',
      url: CALVIN_URL,
      relatedVerses: [v(1)],
      tags: ['shepherd', 'providence', 'love', 'reformation'],
      provenance: verifiedQuote(calvin('Commentary on the Psalms, on Ps 23:1')),
    },
    {
      id: 'psalm-23:cm:henry',
      authorId: 'matthew-henry',
      sourceId: 'matthew-henry-commentary',
      kind: 'quotation',
      lead: 'On “the shadow of death” (v4)',
      text: 'It is but the shadow of death; there is no substantial evil in it; the shadow of a serpent will not sting nor the shadow of a sword kill.',
      locator: 'on Ps 23:4',
      url: HENRY_URL,
      relatedVerses: [v(4)],
      tags: ['valley', 'shadow of death', 'death', 'fear'],
      provenance: verifiedQuote(henry('on Ps 23:4')),
    },
    {
      id: 'psalm-23:cm:gill',
      authorId: 'john-gill',
      sourceId: 'john-gill-exposition',
      kind: 'summary',
      lead: 'A Christological reading, with notes on Jewish interpretation',
      text: 'Gill takes “the LORD” in verse 1 to be Christ, the Son, to whom he says Scripture most often gives the shepherd’s title, and so hears the psalm as the voice of Christ’s sheep. Along the way he records Jewish readings: the Targum takes verse 1 of God feeding Israel in the wilderness and the house of verse 6 as the sanctuary, and the medieval commentators Rashi (whom he calls Jarchi) and Kimchi connected the dark valley with David’s flight from Saul in the wilderness of Ziph.',
      locator: 'on Ps 23:1, 4, 6',
      url: GILL_URL,
      relatedVerses: [v(1), v(4), v(6)],
      tags: ['christology', 'jewish reading', 'targum', 'post-reformation'],
      provenance: summaryOf(gill('on Ps 23:1, 4, 6')),
    },
    {
      id: 'psalm-23:cm:spurgeon',
      authorId: 'spurgeon',
      sourceId: 'spurgeon-treasury-of-david',
      kind: 'quotation',
      lead: 'On the little word “my” (v1)',
      text: 'The sweetest word of the whole is that monosyllable, “My.” He does not say, “The Lord is the shepherd of the world at large, and leadeth forth the multitude as his flock,” but “The Lord is my shepherd;” if he be a Shepherd to no one else, he is a Shepherd to me; he cares for me, watches over me, and preserves me.',
      locator: 'The Treasury of David, Psalm 23, Exposition, v1',
      url: TOD_URL,
      relatedVerses: [v(1)],
      tags: ['shepherd', 'assurance', 'personal faith'],
      provenance: verifiedQuote(treasury('Psalm 23, Exposition, v1')),
    },
    {
      id: 'psalm-23:cm:delitzsch',
      authorId: 'keil-delitzsch',
      sourceId: 'keil-delitzsch-commentary',
      kind: 'quotation',
      lead: 'From shepherd to host (vv4–5) — from Franz Delitzsch’s volume on the Psalms',
      text: 'After the figure of the shepherd fades away in ver. 4, that of the host appears. His enemies must look quietly on … without being able to do anything, and see how Jahve provides bountifully for His guest, anoints him with sweet perfumes as at a joyous and magnificent banquet … and fills his cup to excess.',
      locator: 'on Ps 23:4–5 (Bolton’s translation, vol. 1, p. 331)',
      url: KD_PRINT_URL,
      relatedVerses: [v(4), v(5)],
      tags: ['host', 'table', 'structure', 'hebrew'],
      provenance: verifiedQuote(
        cite('keil-delitzsch-commentary', 'on Ps 23:4–5 — Biblical Commentary on the Psalms, trans. F. Bolton, vol. 1 (T. & T. Clark, 1880), p. 331', KD_PRINT_URL),
      ),
    },
    {
      id: 'psalm-23:cm:maclaren',
      authorId: 'alexander-maclaren',
      sourceId: 'maclaren-expositions-of-holy-scripture',
      kind: 'quotation',
      lead: 'On the paths of righteousness (v3): rest is given for the road',
      text: 'Life is not a fold for the sheep to lie down in, but a road for them to walk on. … Rest is to fit for work, work is to sweeten rest.',
      locator: '“The Shepherd King of Israel” (Ps 23:1–6)',
      url: MACLAREN_URL,
      relatedVerses: [v(2), v(3)],
      tags: ['rest', 'guidance', 'righteousness', 'discipleship'],
      provenance: verifiedQuote(cite('maclaren-expositions-of-holy-scripture', '“The Shepherd King of Israel”', MACLAREN_URL)),
    },
    {
      id: 'psalm-23:cm:meyer',
      authorId: 'fb-meyer',
      sourceId: 'meyer-shepherd-psalm',
      kind: 'quotation',
      lead: 'Psalm 23 between Psalms 22 and 24',
      text: 'This psalm has sometimes been called the Psalm of the Crook. It lies between the Psalm of the Cross and the Psalm of the Crown. If the Twenty-second tells of the Good Shepherd, who died, and if the Twenty-fourth tells of the Chief Shepherd, who is coming again, the Twenty-third tells of the Great Shepherd, who keeps His flock with unerring sagacity and untiring devotion.',
      locator: 'ch. 1, “The Psalm of Psalms”',
      url: MEYER_URL,
      relatedVerses: [v(1)],
      tags: ['good shepherd', 'christ', 'psalm 22', 'psalm 24'],
      provenance: verifiedQuote(cite('meyer-shepherd-psalm', 'ch. 1, “The Psalm of Psalms” (Northfield ed., 1895)', MEYER_URL)),
    },
    {
      id: 'psalm-23:cm:phillip-keller',
      authorId: 'phillip-keller',
      sourceId: 'phillip-keller-shepherd-looks-at-psalm-23',
      kind: 'summary',
      lead: 'A modern sheep rancher’s reading (illustrative, not ancient evidence)',
      text: 'W. Phillip Keller, who worked for years in ranch management and kept sheep himself, reads Psalm 23 phrase by phrase through the practical realities of sheep-keeping — what it takes for sheep to rest, the helplessness of a cast sheep stuck on its back, moving the flock to high summer range, treating sheep against flies and parasites with oil — and applies each to Christ’s care for his people. (He is not to be confused with Timothy Keller.)',
      locator: 'whole book',
      url: 'https://books.google.com/books/about/A_Shepherd_Looks_at_Psalm_23.html?id=QHbTGr3SAIUC',
      relatedVerses: [v(2), v(3), v(5)],
      tags: ['shepherding', 'devotional', 'contemporary'],
      provenance: summaryOf(cite('phillip-keller-shepherd-looks-at-psalm-23')),
    },
    {
      id: 'psalm-23:cm:bailey',
      authorId: 'kenneth-bailey',
      sourceId: 'bailey-good-shepherd',
      kind: 'summary',
      lead: 'The shepherd image from David to the apostles',
      text: 'Bailey follows the good-shepherd theme through nine passages — Psalm 23, Jeremiah 23, Ezekiel 34, Zechariah 10, Mark 6, Luke 15, Matthew 18, John 10 and 1 Peter 5 — treating Psalm 23 as the starting point of a long biblical tradition in which prophets, Jesus and the apostles return to David’s image and adapt it to new circumstances. He analyses how each passage is composed and reads them in the light of Middle Eastern shepherding customs and of early commentators from the region.',
      locator: 'whole book — chs. 1–9 (per the table of contents)',
      url: 'https://bestcommentaries.com/book/13597/',
      relatedVerses: [v(1)],
      tags: ['shepherd', 'cross-references', 'middle eastern culture', 'contemporary'],
      provenance: summaryOf(cite('bailey-good-shepherd', 'table of contents and publisher’s description')),
    },
    {
      id: 'psalm-23:cm:ferguson',
      authorId: 'sinclair-ferguson',
      sourceId: 'ferguson-lord-is-my-shepherd',
      kind: 'summary',
      lead: '“I shall not want” as the confidence of long experience',
      text: 'Ferguson argues that Psalm 23 was not written by the idealised shepherd boy of children’s storybooks but by a believer tried over long experience — one who had known the dark valley, evil and enemies — and that David learned to call God his shepherd from Jacob (Gen 48:15–16). He traces the verb for “lack” to Israel’s wilderness provision (Exod 16:18; Deut 2:7; 8:9) and concludes that Jesus, the good shepherd who lays down his life for the sheep (John 10:11; Zech 13:7), guarantees that his people will not lack what they truly need (Rom 8:32).',
      locator: 'Tabletalk, August 2018',
      url: 'https://tabletalkmagazine.com/article/2018/08/the-lord-is-my-shepherd-i-shall-not-want/',
      relatedVerses: [v(1)],
      tags: ['want', 'provision', 'good shepherd', 'contemporary'],
      provenance: summaryOf(cite('ferguson-lord-is-my-shepherd')),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Sermons                                                          */
  /* ---------------------------------------------------------------- */
  sermons: [
    {
      id: 'psalm-23:sm:spurgeon-1595',
      authorId: 'spurgeon',
      title: 'The Valley of the Shadow of Death',
      date: 'August 12, 1880',
      series: 'Metropolitan Tabernacle Pulpit, vol. 27, no. 1595',
      refs: [ps23(4)],
      topics: ['valley', 'suffering', 'death', 'comfort', 'rod and staff'],
      url: 'https://www.spurgeon.org/resource-library/sermons/the-valley-of-the-shadow-of-death/',
      sourceId: 'spurgeon-metropolitan-tabernacle-pulpit',
      summary: text(
        'Spurgeon admits he had meant to save this verse for his deathbed but needed its comfort in a present trial, and insists it is for the living as well as the dying. Under three heads — the pass and its terrors, the pilgrim and his progress, and the soul and its Shepherd — he pictures the valley as a narrow mountain gorge and argues that passing through sorrow is not in itself a sign of sin, since Christ himself was sorrowful unto death.',
        summaryOf(cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 1595', 'https://www.spurgeon.org/resource-library/sermons/the-valley-of-the-shadow-of-death/')),
      ),
    },
    {
      id: 'psalm-23:sm:spurgeon-3006',
      authorId: 'spurgeon',
      title: 'The Lord Is My Shepherd',
      date: 'October 16, 1866',
      series: 'Metropolitan Tabernacle Pulpit, vol. 52, no. 3006 (preached at the Baptist Chapel, Bromley, Kent)',
      refs: [ps23(1)],
      topics: ['shepherd', 'guidance', 'provision', 'protection'],
      url: 'https://ccel.org/ccel/spurgeon/sermons52.xxxix.html',
      sourceId: 'spurgeon-metropolitan-tabernacle-pulpit',
      summary: text(
        'Spurgeon draws out what the metaphor guarantees, requires and asks. Its privileges are guidance (the Eastern shepherd goes before his flock), provision for bodily and spiritual needs, and protection; its first duty is the sheep’s confidence in its shepherd; and it prompts searching questions about whether the hearer bears the marks of Christ’s sheep. He suggests the psalm was probably written when David was king and still unashamed of his shepherd years.',
        summaryOf(cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 3006', 'https://ccel.org/ccel/spurgeon/sermons52.xxxix.html')),
      ),
    },
    {
      id: 'psalm-23:sm:spurgeon-3060',
      authorId: 'spurgeon',
      title: 'The Good Shepherd',
      date: 'Published October 3, 1907',
      series: 'Metropolitan Tabernacle Pulpit, vol. 53, no. 3060 (preached at New Park Street Chapel, Southwark)',
      refs: [ps23(1)],
      topics: ['shepherd', 'want', 'dependence', 'providence', 'assurance'],
      url: 'https://ccel.org/ccel/spurgeon/sermons53.xl.html',
      sourceId: 'spurgeon-metropolitan-tabernacle-pulpit',
      summary: text(
        'On “The LORD is my shepherd; I shall not want,” Spurgeon moves in three steps: the confession needed before anyone can say it (we are foolish, dependent sheep), the assurance that grows from God’s past dealings (bringing us back from our wanderings and supplying our needs), and the holy confidence of “I shall not want,” which he applies to real needs rather than fancied wants.',
        summaryOf(cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 3060', 'https://ccel.org/ccel/spurgeon/sermons53.xl.html')),
      ),
    },
    {
      id: 'psalm-23:sm:maclaren-shepherd-king',
      authorId: 'alexander-maclaren',
      title: 'The Shepherd King of Israel',
      series: 'Expositions of Holy Scripture: Psalms',
      refs: [ps23(1, 6)],
      topics: ['shepherd', 'host', 'rest', 'work', 'sorrow', 'hope'],
      url: MACLAREN_URL,
      sourceId: 'maclaren-expositions-of-holy-scripture',
      summary: text(
        'Maclaren hears the psalm as the aged king looking back on his shepherd years. He divides it into two halves — God as Shepherd (vv1–4), leading his flock through rest, work and sorrow, and God as Host (vv5–6), whose hospitality ends in the Father’s house — and stresses that the rest of green pastures is given to strengthen us for the paths of righteousness, and that the hand which leads into the dark valley leads through it and out.',
        summaryOf(cite('maclaren-expositions-of-holy-scripture', '“The Shepherd King of Israel”', MACLAREN_URL)),
      ),
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Verse notes (chat-ready)                                         */
  /* ---------------------------------------------------------------- */
  verseNotes: [
    {
      verse: v(1),
      explanation: text(
        'The psalm opens with God’s covenant name, YHWH (printed LORD), and a Hebrew participle, rōʿî — “the one who shepherds me.” In the ancient Near East “shepherd” was a title for kings, so David, a shepherd who became a king, confesses that the LORD is his true king and carer. Jacob used the same word of God at the end of his life: “the God who has been my shepherd all my life” (Gen 48:15).',
        synthesis(tahot('Ps 23:1; Gen 48:15'), tbesh('H3068G; H7462B'), tyndale('on Ps 23:1-3')),
      ),
      tags: ['shepherd', 'lord', 'king'],
    },
    {
      verse: v(1),
      explanation: text(
        '“I shall not want” uses the verb ḥāsēr, “to lack.” It is the word Moses used of the wilderness years — “you have lacked nothing” (Deut 2:7) — so the line can be heard as applying Israel’s wilderness experience to one person’s life, a link the Tyndale notes and Sinclair Ferguson both draw. Commentators from Calvin to Spurgeon note that it promises what the Shepherd knows we need, not everything we might wish for.',
        synthesis(
          tbesh('H2637'),
          tahot('Ps 23:1; Deut 2:7'),
          tyndale('on Ps 23:1'),
          cite('ferguson-lord-is-my-shepherd'),
          calvin('on Ps 23:1'),
          cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 3060', 'https://ccel.org/ccel/spurgeon/sermons53.xl.html'),
        ),
      ),
      tags: ['want', 'lack', 'provision'],
    },
    {
      verse: v(2),
      explanation: text(
        '“Green pastures” are literally “pastures of fresh grass” (KJV margin: “pastures of tender grass”), and “quiet waters” are “waters of rest” — menûḥôt, the word for a resting place (KJV margin: “waters of quietness”). The verb “leads” (nāhal) is a rare word (10 occurrences) for leading with care — to water, rest or refreshment; it is used of a flock (Gen 33:14; Isa 40:11, where God gently leads nursing ewes) and of people (Exod 15:13; Isa 49:10). Franz Delitzsch, in the Keil–Delitzsch commentary, calls it a pastoral word for gentle leading, which suits this verse. The shepherd both makes the flock lie down and leads it to water: rest and refreshment together.',
        synthesis(
          tbesh('H4999; H1877; H4496H; H5095'),
          tahot('Ps 23:2; Gen 33:14; Exod 15:13; Isa 40:11; 49:10; occurrence count of H5095 made for this study'),
          kjv('Ps 23:2 margin'),
          kd('on Ps 23:2'),
        ),
      ),
      tags: ['green pastures', 'still waters', 'rest', 'leads'],
    },
    {
      verse: v(3),
      explanation: text(
        '“He restores my soul” could be rendered “he brings back my life”: the verb is šûb, “turn back,” and nefesh is the whole living self. “Paths of righteousness” are literally “tracks of rightness” — right, straight paths that lead where they should. The Shepherd leads on them “for His name’s sake,” to honour his own character rather than because of the sheep’s merit.',
        synthesis(tbesh('H7725H; H5315G; H4570; H6664G'), tahot('Ps 23:3'), calvin('on Ps 23:3'), tyndale('on Ps 23:3'), kd('on Ps 23:3')),
      ),
      tags: ['restore', 'soul', 'righteousness', 'name'],
    },
    {
      verse: v(4),
      explanation: text(
        'The “valley” (gêʾ) is a steep ravine or narrow gorge, and ṣalmāwet means either “shadow of death” or “deep darkness” (BSB footnote) — a place where danger is close. The psalm does not promise that the sheep will avoid such valleys but that it will walk through them in company: “I will fear no evil, for You are with me.” Here, at the psalm’s centre (by one count of its Hebrew words), David stops speaking about God and starts speaking to him.',
        synthesis(tbesh('H1516R; H6757'), tahot('Ps 23:4'), bsb('Ps 23:4 footnote')),
      ),
      tags: ['valley', 'shadow of death', 'fear', 'presence'],
    },
    {
      verse: v(4),
      explanation: text(
        'The shepherd’s rod (šēbeṭ) was a club for defending the flock and a tool for guiding and counting it; the staff (mišʿenet) was something to lean on. The Tyndale notes observe that shepherds used both to fend off danger. They comfort because they show that the Shepherd is present and armed — and šēbeṭ can also mean a king’s sceptre.',
        synthesis(tbesh('H7626G; H4938B'), tyndale('on Ps 23:4'), bsb('Lev 27:32; Gen 49:10')),
      ),
      tags: ['rod', 'staff', 'comfort'],
    },
    {
      verse: v(5),
      explanation: text(
        'The picture shifts from shepherd to host. The table is spread in full view of enemies who can watch but not interfere; the guest’s head is anointed with oil, a mark of honour (compare Luke 7:46), with a verb that literally means “you make fat” — lavish oil (KJV margin). The cup “overflows”: rəwāyâ means saturation, and it appears elsewhere only in Psalm 66:12, where God brings his people “into abundance.”',
        synthesis(tyndale('on Ps 23:5'), tbesh('H1878; H7310'), tahot('Ps 23:5; Ps 66:12'), kjv('Ps 23:5 margin'), bsb('Luke 7:46; Ps 66:12')),
      ),
      tags: ['table', 'anoint', 'oil', 'cup', 'enemies'],
    },
    {
      verse: v(6),
      explanation: text(
        '“Surely” can also be read “only” — Spurgeon notes the reading “only goodness and mercy.” The verb translated “follow” is rādap̄, “pursue,” normally used of enemies chasing someone. Franz Delitzsch, in the Keil–Delitzsch commentary, draws out the reversal: the psalmist’s foes pursue him, but now only God’s goodness and ḥesed — his loyal, covenant love — will pursue him, all the days of his life.',
        synthesis(tbesh('H7291; H2617A'), tahot('Ps 23:6'), treasury('Exposition, v6'), kd('on Ps 23:6')),
      ),
      tags: ['goodness', 'mercy', 'hesed', 'pursue'],
    },
    {
      verse: v(6),
      explanation: text(
        'The last line holds two textual questions. The Hebrew as vocalised says “and I will return” (šûb), while the Greek Septuagint and most translations read “I will dwell” — compare Psalm 27:4. And “forever” is literally “for length of days” (BSB and KJV footnotes) — an idiom that can mean a long life or, as of God’s house in Psalm 93:5, all the days to come; Christian readers have also heard in it the hope of dwelling with God beyond death.',
        synthesis(
          tahot('Ps 23:6; Ps 93:5'),
          lxx('Ps 22:6 LXX (= Ps 23:6)'),
          bsb('Ps 23:6 footnote; Ps 27:4; Ps 93:5'),
          kjv('Ps 23:6 margin'),
          henry('on Ps 23:6'),
        ),
      ),
      tags: ['dwell', 'return', 'forever', 'house'],
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Concepts (engine retrieval index)                                */
  /* ---------------------------------------------------------------- */
  concepts: [
    {
      id: 'psalm-23:c:shepherd',
      label: 'The LORD as shepherd',
      aliases: [
        'shepherd',
        'shepherds',
        'my shepherd',
        'shepherding',
        'shepherd king',
        'kings as shepherds',
        'hammurabi',
        'flock',
        'sheep',
        'ra\'ah',
        'raah',
        'ra.ah',
        'roi',
        'ro\'i',
        'roeh',
        'רעה',
        'רָעָה',
        'רֹעִי',
      ],
      answer: text(
        'Rōʿî, “my shepherd,” is a participle of the verb rāʿâ, “to pasture, tend” — the LORD is the one who actively shepherds David. Across the ancient Near East kings called themselves shepherds (Hammurabi styles himself “the salvation-bearing shepherd”), so the title joins royal authority with care. Scripture uses it of God from Jacob (Gen 48:15) to the prophets (Ezek 34:15), and Jesus claims it in John 10:11.',
        synthesis(tbesh('H7462B'), tahot('Ps 23:1'), cite('king-code-of-hammurabi', 'Epilogue', HAMMURABI_URL), bsb('Gen 48:15; Ezek 34:15; John 10:11')),
      ),
      primarySection: 'original-languages',
      verses: [v(1)],
      keyWordIds: ['psalm-23:kw:raah'],
      crossReferenceIds: [
        'psalm-23:xr:gen-48-15',
        'psalm-23:xr:ps-80-1',
        'psalm-23:xr:isa-40-11',
        'psalm-23:xr:ezek-34-11',
        'psalm-23:xr:john-10-11',
      ],
      contextIds: ['psalm-23:ctx:shepherd-kings', 'psalm-23:ctx:shepherding'],
      themeIds: ['psalm-23:th:shepherd-king', 'psalm-23:th:christ-shepherd'],
      perspectiveSetIds: ['psalm-23:ps:readings'],
      commentaryIds: ['psalm-23:cm:calvin', 'psalm-23:cm:spurgeon', 'psalm-23:cm:bailey', 'psalm-23:cm:phillip-keller'],
    },
    {
      id: 'psalm-23:c:divine-name',
      label: 'The LORD (YHWH)',
      aliases: [
        'the lord',
        'lord in small caps',
        'small caps',
        'small capitals',
        'capital letters',
        'yahweh',
        'yhwh',
        'jehovah',
        'adonai',
        'divine name',
        'name of god',
        'tetragrammaton',
        'יהוה',
      ],
      answer: text(
        'Where English Bibles print LORD in small capitals, the Hebrew has God’s personal name, YHWH, revealed to Moses (Exod 3:14–15). Out of reverence Jewish readers say ’Adonai (“Lord”) instead, and the name was written with that word’s vowels — the origin of the older form “Jehovah”; “Yahweh” is the usual scholarly reconstruction. In Psalm 23 the name appears only twice, as the first word after the heading and in the last line, framing the whole psalm.',
        synthesis(tbesh('H3068G'), tahot('Ps 23:1, 6'), bsb('Exod 3:14–15')),
      ),
      primarySection: 'original-languages',
      verses: [v(1), v(6)],
      keyWordIds: ['psalm-23:kw:yhwh'],
      crossReferenceIds: ['psalm-23:xr:exod-15-13', 'psalm-23:xr:deut-2-7'],
      contextIds: [],
      themeIds: ['psalm-23:th:shepherd-king'],
      perspectiveSetIds: [],
      commentaryIds: ['psalm-23:cm:calvin'],
    },
    {
      id: 'psalm-23:c:want',
      label: 'I shall not want',
      aliases: [
        'want',
        'not want',
        'shall not want',
        'lack',
        'lack nothing',
        'lacked nothing',
        'chaser',
        'cha.ser',
        'hasar',
        'חסר',
        'חָסֵר',
        'provision',
        'provide',
        'needs',
        'contentment',
      ],
      answer: text(
        'The verb is ḥāsēr, “to lack.” It is the word Moses used of Israel’s forty years in the wilderness — “you have lacked nothing” (Deut 2:7; compare Neh 9:21) — so the line can be heard as applying Israel’s wilderness experience to one person’s life, a link the Tyndale notes and Sinclair Ferguson both draw. The promise is sufficiency, not luxury: Spurgeon applies it to real needs rather than fancied wants, and Psalm 34:10 speaks of lacking “no good thing.”',
        synthesis(
          tbesh('H2637'),
          tahot('Ps 23:1; Deut 2:7; Neh 9:21'),
          tyndale('on Ps 23:1'),
          cite('ferguson-lord-is-my-shepherd'),
          cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 3060', 'https://ccel.org/ccel/spurgeon/sermons53.xl.html'),
          bsb('Ps 34:10'),
        ),
      ),
      primarySection: 'original-languages',
      verses: [v(1)],
      keyWordIds: ['psalm-23:kw:chaser'],
      crossReferenceIds: ['psalm-23:xr:deut-2-7', 'psalm-23:xr:exod-15-13', 'psalm-23:xr:mark-6-34'],
      contextIds: ['psalm-23:ctx:wilderness'],
      themeIds: ['psalm-23:th:shepherd-king'],
      perspectiveSetIds: [],
      commentaryIds: ['psalm-23:cm:calvin', 'psalm-23:cm:ferguson'],
    },
    {
      id: 'psalm-23:c:rest',
      label: 'Green pastures and quiet waters',
      aliases: [
        'green pastures',
        'pastures',
        'pasture',
        'still waters',
        'quiet waters',
        'waters',
        'water',
        'lie down',
        'makes me lie down',
        'rest',
        'leads me',
        'menuchot',
        'menuchah',
        'deshe',
        'grass',
      ],
      answer: text(
        '“Green pastures” are literally “pastures of fresh grass,” and “quiet waters” are “waters of rest” — menûḥâ means a resting place. The verb “leads” (nāhal) is a rare word for leading with care to water, rest or refreshment; Isaiah uses it of God leading nursing ewes (Isa 40:11), and it appears again in the promise that God will lead his people beside springs of water (Isa 49:10), a promise Revelation echoes of the Lamb (Rev 7:17). As Maclaren notes, this rest is given to strengthen the flock for the road ahead.',
        synthesis(tbesh('H4999; H1877; H4496H; H5095'), tahot('Ps 23:2; Isa 40:11; Isa 49:10'), bsb('Rev 7:17'), cite('maclaren-expositions-of-holy-scripture', '“The Shepherd King of Israel”', MACLAREN_URL)),
      ),
      primarySection: 'scripture',
      verses: [v(2)],
      keyWordIds: [],
      crossReferenceIds: ['psalm-23:xr:isa-40-11', 'psalm-23:xr:rev-7-17', 'psalm-23:xr:ezek-34-11', 'psalm-23:xr:mark-6-34'],
      contextIds: ['psalm-23:ctx:wilderness', 'psalm-23:ctx:shepherding'],
      themeIds: ['psalm-23:th:shepherd-king'],
      perspectiveSetIds: [],
      commentaryIds: ['psalm-23:cm:maclaren', 'psalm-23:cm:phillip-keller'],
    },
    {
      id: 'psalm-23:c:restore',
      label: 'He restores my soul; paths of righteousness',
      aliases: [
        'restores',
        'restore',
        'restoreth',
        'restores my soul',
        'soul',
        'nephesh',
        'nefesh',
        'ne.phesh',
        'נפש',
        'נֶפֶשׁ',
        'shuv',
        'shub',
        'שוב',
        'שׁוּב',
        'bring back',
        'repent',
        'repentance',
        'paths of righteousness',
        'right paths',
        'righteousness',
        'his name\'s sake',
        'his name’s sake',
        'for his name',
        'guides me',
      ],
      answer: text(
        '“He restores my soul” is literally “he brings back my nefesh” — my life, my whole self. The verb šûb, “turn back,” can describe reviving a fainting life or bringing back a straying sheep, and elsewhere it means repentance. The “paths of righteousness” are right, straight tracks, and the Shepherd leads on them “for His name’s sake” — because of who he is, not because of the sheep’s merit.',
        synthesis(tbesh('H7725H; H5315G; H4570; H6664G'), tahot('Ps 23:3'), kd('on Ps 23:3'), calvin('on Ps 23:3')),
      ),
      primarySection: 'original-languages',
      verses: [v(3)],
      keyWordIds: ['psalm-23:kw:nephesh', 'psalm-23:kw:shuv'],
      crossReferenceIds: ['psalm-23:xr:luke-15-3', 'psalm-23:xr:1pet-2-25', 'psalm-23:xr:jer-23-1'],
      contextIds: [],
      themeIds: ['psalm-23:th:shepherd-king', 'psalm-23:th:hesed'],
      perspectiveSetIds: ['psalm-23:ps:dwell-return'],
      commentaryIds: ['psalm-23:cm:maclaren'],
    },
    {
      id: 'psalm-23:c:valley',
      label: 'The valley of the shadow of death — “You are with me”',
      aliases: [
        'valley',
        'valley of the shadow of death',
        'shadow of death',
        'shadow',
        'dark valley',
        'darkest valley',
        'deep darkness',
        'darkness',
        'death',
        'dying',
        'fear no evil',
        'fear',
        'tsalmavet',
        'tzalmavet',
        'tsal.ma.vet',
        'צלמות',
        'צַלְמָוֶת',
        'you are with me',
        'thou art with me',
        'with me',
        'presence',
        'centre of the psalm',
        'center of the psalm',
      ],
      answer: text(
        'The Hebrew is gêʾ ṣalmāwet — a steep ravine of “death-shadow” or “deep darkness” (BSB footnote). The traditional rendering follows the Masoretic vowels and the Greek Septuagint (skia thanatou); many modern scholars derive the word from a root meaning “to be dark.” Either way it is the most threatening darkness, and the psalm’s point is that the sheep walks through it with the Shepherd: “I will fear no evil, for You are with me” — words that stand, by one common count of the Hebrew words, at the centre of the psalm.',
        synthesis(tbesh('H1516R; H6757'), tahot('Ps 23:1–6 word count; Ps 23:4'), bsb('Ps 23:4 footnote'), lxx('Ps 22:4 LXX'), kd('on Ps 23:4')),
      ),
      primarySection: 'original-languages',
      verses: [v(4)],
      keyWordIds: ['psalm-23:kw:tsalmavet'],
      crossReferenceIds: ['psalm-23:xr:isa-43-2', 'psalm-23:xr:deut-2-7', 'psalm-23:xr:heb-13-20'],
      contextIds: ['psalm-23:ctx:wilderness'],
      themeIds: ['psalm-23:th:presence'],
      perspectiveSetIds: ['psalm-23:ps:tsalmavet'],
      commentaryIds: ['psalm-23:cm:augustine', 'psalm-23:cm:henry', 'psalm-23:cm:rashi'],
    },
    {
      id: 'psalm-23:c:rod-staff',
      label: 'Your rod and your staff',
      aliases: [
        'rod',
        'staff',
        'rod and staff',
        'crook',
        'shevet',
        'she.vet',
        'שבט',
        'שֵׁבֶט',
        'mishenet',
        'mish\'enet',
        'comfort',
        'comfort me',
        'sceptre',
        'scepter',
      ],
      answer: text(
        'The shepherd’s rod (šēbeṭ) was a club for beating off predators and a tool for guiding and counting the flock; the staff (mišʿenet) was a support to lean on. The Tyndale notes observe that shepherds used both to fend off danger. Because šēbeṭ can also mean a ruler’s sceptre, the image joins royal authority with care, and the sheep is comforted by seeing its Shepherd armed and near.',
        synthesis(tbesh('H7626G; H4938B'), tahot('Ps 23:4'), tyndale('on Ps 23:4')),
      ),
      primarySection: 'original-languages',
      verses: [v(4)],
      keyWordIds: ['psalm-23:kw:shevet'],
      crossReferenceIds: [],
      contextIds: ['psalm-23:ctx:rod-staff', 'psalm-23:ctx:shepherding'],
      themeIds: ['psalm-23:th:presence'],
      perspectiveSetIds: [],
      commentaryIds: ['psalm-23:cm:rashi'],
    },
    {
      id: 'psalm-23:c:table',
      label: 'A table, oil and an overflowing cup',
      aliases: [
        'table',
        'prepare a table',
        'preparest a table',
        'enemies',
        'presence of my enemies',
        'anoint',
        'anointest',
        'anoint my head',
        'anointing',
        'oil',
        'cup',
        'my cup',
        'overflows',
        'runneth over',
        'runs over',
        'host',
        'banquet',
        'feast',
        'hospitality',
        'dashan',
        'da.shen',
        'דשן',
        'lord\'s supper',
        'lord’s supper',
        'eucharist',
      ],
      answer: text(
        'In verse 5 the Shepherd becomes a host. He spreads a table in full view of enemies who can watch but not interfere, honours his guest by anointing his head with oil — the verb means literally “you make fat,” that is, lavish oil (compare Luke 7:46) — and fills the cup to saturation. In the early church, the mystagogic lectures ascribed to Cyril of Jerusalem hear in this the Lord’s Table and the anointing of the newly baptized.',
        synthesis(tyndale('on Ps 23:5'), tbesh('H1878; H7310'), kjv('Ps 23:5 margin'), cite('cyril-catechetical-lectures', 'Lecture 22, §7', CYRIL_URL)),
      ),
      primarySection: 'historical-context',
      verses: [v(5)],
      keyWordIds: ['psalm-23:kw:dashan'],
      crossReferenceIds: ['psalm-23:xr:luke-7-44', 'psalm-23:xr:ps-16-5', 'psalm-23:xr:mark-6-34'],
      contextIds: ['psalm-23:ctx:hospitality', 'psalm-23:ctx:christian-worship'],
      themeIds: ['psalm-23:th:house'],
      perspectiveSetIds: ['psalm-23:ps:readings'],
      commentaryIds: ['psalm-23:cm:cyril', 'psalm-23:cm:delitzsch'],
    },
    {
      id: 'psalm-23:c:goodness-mercy',
      label: 'Goodness and ḥesed will pursue me',
      aliases: [
        'goodness',
        'mercy',
        'goodness and mercy',
        'hesed',
        'chesed',
        'che.sed',
        'חסד',
        'חֶסֶד',
        'loving kindness',
        'lovingkindness',
        'loving devotion',
        'steadfast love',
        'covenant love',
        'follow',
        'follow me',
        'pursue',
        'radaph',
        'ra.daph',
        'רדף',
        'surely',
      ],
      answer: text(
        'Ḥesed is the LORD’s loyal, covenant love — glossed “covenant loyalty” in STEPBible’s interlinear and rendered “mercy” (BSB, KJV) or “loving kindness” (WEB). The verb “follow” is rādap̄, “pursue,” normally used of enemies hunting someone down; here God’s goodness and ḥesed are the pursuers, all the days of the psalmist’s life.',
        synthesis(tbesh('H2617A; H7291'), tahot('Ps 23:6'), kd('on Ps 23:6')),
      ),
      primarySection: 'original-languages',
      verses: [v(6)],
      keyWordIds: ['psalm-23:kw:hesed', 'psalm-23:kw:radaph'],
      crossReferenceIds: ['psalm-23:xr:exod-15-13'],
      contextIds: [],
      themeIds: ['psalm-23:th:hesed'],
      perspectiveSetIds: [],
      commentaryIds: [],
    },
    {
      id: 'psalm-23:c:house-forever',
      label: 'Dwelling in the house of the LORD forever',
      aliases: [
        'house of the lord',
        'house',
        'dwell',
        'dwelling',
        'forever',
        'for ever',
        'length of days',
        'heaven',
        'temple',
        'sanctuary',
        'return',
        'shavti',
        'eternal',
        'eternal life',
        'afterlife',
        'home',
      ],
      answer: text(
        'The last line raises two questions. The Hebrew as vocalised says “and I will return” (from šûb), while the Septuagint and most translations read “I will dwell” — compare Psalm 27:4, “to dwell in the house of the LORD all the days of my life.” And “forever” is literally “for length of days” — an idiom that can mean a long life or, as of God’s house in Psalm 93:5, “for all the days to come”; Christian readers such as Matthew Henry and Spurgeon have also heard in it the hope of heaven.',
        synthesis(tahot('Ps 23:6; Ps 27:4; Ps 93:5'), lxx('Ps 22:6 LXX'), bsb('Ps 23:6 footnote; Ps 27:4; Ps 93:5'), henry('on Ps 23:6'), treasury('Exposition, v6')),
      ),
      primarySection: 'theology',
      verses: [v(6)],
      keyWordIds: ['psalm-23:kw:shuv'],
      crossReferenceIds: ['psalm-23:xr:ps-27-4', 'psalm-23:xr:rev-7-17'],
      contextIds: ['psalm-23:ctx:jewish-tradition'],
      themeIds: ['psalm-23:th:house', 'psalm-23:th:hope'],
      perspectiveSetIds: ['psalm-23:ps:dwell-return'],
      commentaryIds: ['psalm-23:cm:spurgeon'],
    },
    {
      id: 'psalm-23:c:good-shepherd',
      label: 'Jesus the Good Shepherd',
      aliases: [
        'good shepherd',
        'jesus',
        'christ',
        'john 10',
        'great shepherd',
        'chief shepherd',
        'lamb',
        'messiah',
        'fulfilment',
        'fulfillment',
        'typology',
        'new testament',
      ],
      answer: text(
        'In Psalm 23 the shepherd is the LORD himself, and Ezekiel promised that God would shepherd his flock in person and set over them “one shepherd, My servant David” (Ezek 34:15, 23). The New Testament presents Jesus as the fulfilment of both promises: the good shepherd who lays down his life (John 10:11), the great Shepherd brought back from the dead (Heb 13:20), the Chief Shepherd who will appear (1 Pet 5:4), and the Lamb who will shepherd his people to springs of living water (Rev 7:17).',
        synthesis(bsb('Ezek 34:15, 23; John 10:11; Heb 13:20; 1 Pet 5:4; Rev 7:17'), kd('on Ps 23:1')),
      ),
      primarySection: 'cross-references',
      verses: [v(1)],
      keyWordIds: ['psalm-23:kw:raah'],
      crossReferenceIds: [
        'psalm-23:xr:john-10-11',
        'psalm-23:xr:heb-13-20',
        'psalm-23:xr:1pet-2-25',
        'psalm-23:xr:1pet-5-4',
        'psalm-23:xr:rev-7-17',
        'psalm-23:xr:ezek-34-11',
        'psalm-23:xr:mark-6-34',
        'psalm-23:xr:luke-15-3',
      ],
      contextIds: [],
      themeIds: ['psalm-23:th:christ-shepherd'],
      perspectiveSetIds: ['psalm-23:ps:readings'],
      commentaryIds: ['psalm-23:cm:meyer', 'psalm-23:cm:bailey', 'psalm-23:cm:ferguson', 'psalm-23:cm:gill'],
    },
    {
      id: 'psalm-23:c:david',
      label: 'David and the heading “A Psalm of David”',
      aliases: [
        'david',
        'psalm of david',
        'a psalm of david',
        'author',
        'authorship',
        'who wrote',
        'superscription',
        'heading',
        'title',
        'ledavid',
        'le-david',
        'mizmor',
        'absalom',
        'when was it written',
      ],
      answer: text(
        'The heading mizmôr lədāwid is usually read “A Psalm of David,” though the Hebrew preposition can also mean “for” or “concerning” David, so the Tyndale introduction counsels caution about treating every such heading as authorship. Those who read it as David’s own place it differently: Calvin reads it as the words of David at the height of his royal prosperity, Spurgeon and Maclaren picture the king looking back on his shepherd years, and Franz Delitzsch (in the Keil–Delitzsch commentary) connects it with his flight from Absalom (2 Sam 17:27–29). The psalm itself names no occasion.',
        synthesis(
          tyndaleIntro,
          tahot('Ps 23:0 (Heb. 23:1a)'),
          calvin('on Ps 23:1'),
          cite('spurgeon-metropolitan-tabernacle-pulpit', 'no. 3006', 'https://ccel.org/ccel/spurgeon/sermons52.xxxix.html'),
          cite('maclaren-expositions-of-holy-scripture', '“The Shepherd King of Israel”', MACLAREN_URL),
          kd('on Ps 23:5-6'),
        ),
      ),
      primarySection: 'historical-context',
      verses: [v(1)],
      keyWordIds: [],
      crossReferenceIds: [],
      contextIds: ['psalm-23:ctx:superscription', 'psalm-23:ctx:genre', 'psalm-23:ctx:shepherding'],
      themeIds: [],
      perspectiveSetIds: [],
      commentaryIds: [],
    },
  ],

  suggestedQuestions: [
    'What is the Hebrew word behind “shepherd”?',
    'What does “the valley of the shadow of death” mean in Hebrew?',
    'How would the original audience have understood this?',
    'Where else does the Bible call God a shepherd?',
    'Explain verse 5 in more detail.',
    'Are there different interpretations of this passage?',
    'What did Spurgeon say about this psalm?',
    'How does Psalm 23 connect with John 10?',
  ],

  /* ---------------------------------------------------------------- */
  /* Study-specific sources & authors                                 */
  /* ---------------------------------------------------------------- */
  sources: [
    {
      id: 'king-code-of-hammurabi',
      type: 'book',
      title: 'The Code of Hammurabi',
      authorIds: [],
      publisher: 'The Avalon Project, Yale Law School',
      url: HAMMURABI_URL,
      license: { status: 'public-domain', name: 'Public domain (translation by L. W. King)', usage: 'full-text' },
      edition: 'trans. L. W. King',
      description: 'The Babylonian law code of King Hammurabi, with a prologue and epilogue in which the king presents himself as the divinely appointed shepherd of his people.',
    },
    {
      id: 'wikipedia-hammurabi',
      type: 'encyclopedia',
      title: 'Hammurabi',
      authorIds: [],
      publisher: 'Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Hammurabi',
      license: {
        status: 'open-license',
        name: 'CC BY-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/',
        usage: 'excerpt',
        attribution: 'Wikipedia contributors, “Hammurabi.”',
      },
      description: 'Used only for the basic dates of Hammurabi’s reign.',
    },
    {
      id: 'augustine-expositions-psalms',
      type: 'commentary',
      title: 'Expositions on the Psalms',
      authorIds: ['augustine'],
      url: 'https://www.newadvent.org/fathers/1801.htm',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      edition: 'Nicene and Post-Nicene Fathers, First Series, vol. 8, ed. Philip Schaff (1888), translator anonymous; revised for New Advent by Kevin Knight. New Advent headings follow the English numbering (this is “Exposition on Psalm 23”), while Augustine’s Latin and the in-text verse references follow the Septuagint/Vulgate numbering (Ps 22).',
      description: 'Augustine’s sermons and notes on the whole Psalter (Enarrationes in Psalmos), reading the Psalms as the voice of Christ and his Church.',
    },
    {
      id: 'cyril-catechetical-lectures',
      type: 'lecture',
      title: 'Catechetical Lectures',
      authorIds: ['cyril-of-jerusalem'],
      url: CYRIL_URL,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      edition: 'trans. Edwin Hamilton Gifford, Nicene and Post-Nicene Fathers, Second Series, vol. 7 (1894); revised for New Advent by Kevin Knight.',
      description:
        'Fourth-century instruction given in Jerusalem to candidates for baptism and, in the final (mystagogic) lectures, to the newly baptized. Lectures 19–23 (the Mystagogic Catecheses) are traditionally ascribed to Cyril; some scholars attribute them to his successor John, and many date them to Cyril’s later episcopate (370s–380s).',
    },
    {
      id: 'wikipedia-cyril-of-jerusalem',
      type: 'encyclopedia',
      title: 'Cyril of Jerusalem',
      authorIds: [],
      publisher: 'Wikipedia',
      url: WIKI_CYRIL_URL,
      license: {
        status: 'open-license',
        name: 'CC BY-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/',
        usage: 'excerpt',
        attribution: 'Wikipedia contributors, “Cyril of Jerusalem.”',
      },
      description: 'Used only for the basic facts about the disputed date and authorship of the Mystagogic Catecheses (section “Mystagogic Catecheses”, citing Yarnold 1978 and Doval 2001).',
    },
    {
      id: 'rashi-on-psalms',
      type: 'commentary',
      title: 'Rashi’s Commentary on Psalms',
      authorIds: ['rashi'],
      publisher: 'Hebrew Wikisource',
      url: RASHI_URL,
      license: { status: 'public-domain', name: 'Public domain (medieval Hebrew text)', usage: 'full-text' },
      edition: 'Hebrew text on Hebrew Wikisource (page for Ps 23:4); summarised here in English, not quoted.',
      description:
        'The eleventh-century commentary of Rabbi Solomon ben Isaac (Rashi) on the Psalms; on Ps 23:4 he explains every occurrence of ṣalmāwet as darkness, following Dunash ben Labrat, and links the verse with the wilderness of Ziph.',
    },
    {
      id: 'spurgeon-treasury-of-david',
      type: 'commentary',
      title: 'The Treasury of David',
      authorIds: ['spurgeon'],
      publisher: 'Spurgeon Center (archive.spurgeon.org)',
      url: TOD_URL,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Spurgeon’s multi-volume exposition of the Psalms, with his own comments followed by “Explanatory Notes and Quaint Sayings” from earlier writers.',
    },
    {
      id: 'spurgeon-metropolitan-tabernacle-pulpit',
      type: 'sermon',
      title: 'The Metropolitan Tabernacle Pulpit',
      authorIds: ['spurgeon'],
      url: 'https://www.spurgeon.org/resource-library/sermons/',
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'The weekly published sermons of C. H. Spurgeon, continued after his death from unpublished manuscripts.',
    },
    {
      id: 'maclaren-expositions-of-holy-scripture',
      type: 'commentary',
      title: 'Expositions of Holy Scripture',
      authorIds: ['alexander-maclaren'],
      url: MACLAREN_URL,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      description: 'Alexander Maclaren’s expository sermons arranged by biblical book; the Psalms volume includes “The Shepherd King of Israel” on Psalm 23.',
    },
    {
      id: 'meyer-shepherd-psalm',
      type: 'book',
      title: 'The Shepherd Psalm',
      authorIds: ['fb-meyer'],
      year: '1889',
      publisher: 'Fleming H. Revell',
      url: MEYER_URL,
      license: { status: 'public-domain', name: 'Public domain', usage: 'full-text' },
      edition: 'Northfield Edition (New York: Fleming H. Revell, 1895), as digitised by the Internet Archive.',
      description: 'A devotional exposition of Psalm 23, one chapter per phrase, by the English Baptist preacher F. B. Meyer.',
    },
    {
      id: 'phillip-keller-shepherd-looks-at-psalm-23',
      type: 'book',
      title: 'A Shepherd Looks at Psalm 23',
      authorIds: ['phillip-keller'],
      year: '1970',
      publisher: 'Zondervan',
      url: 'https://books.google.com/books/about/A_Shepherd_Looks_at_Psalm_23.html?id=QHbTGr3SAIUC',
      license: { status: 'copyrighted', name: 'In copyright', usage: 'summary-only' },
      edition: 'First published 1970 (Zondervan Publishing House); the linked Google Books record is the 2007 Zondervan edition (a HarperCollins imprint), ISBN 978-0-310-27441-4.',
      description: 'A popular devotional book by W. Phillip Keller (not Timothy Keller) that reads Psalm 23 through the author’s own experience of keeping sheep.',
    },
    {
      id: 'bailey-good-shepherd',
      type: 'book',
      title: 'The Good Shepherd: A Thousand-Year Journey from Psalm 23 to the New Testament',
      authorIds: ['kenneth-bailey'],
      year: '2014',
      publisher: 'IVP Academic',
      url: 'https://bestcommentaries.com/book/13597/',
      license: { status: 'copyrighted', name: 'In copyright', usage: 'summary-only' },
      edition: 'IVP Academic, 1 December 2014, 288 pp., ISBN 978-0-8308-4063-2 (details and table of contents via the linked Best Commentaries record).',
      description: 'A study of nine Old and New Testament shepherd passages, reading them in the light of Middle Eastern culture and of early commentators from the region.',
    },
    {
      id: 'ferguson-lord-is-my-shepherd',
      type: 'article',
      title: 'The Lord Is My Shepherd; I Shall Not Want',
      authorIds: ['sinclair-ferguson'],
      year: '2018',
      publisher: 'Tabletalk (Ligonier Ministries), August 2018',
      url: 'https://tabletalkmagazine.com/article/2018/08/the-lord-is-my-shepherd-i-shall-not-want/',
      license: { status: 'copyrighted', name: 'In copyright', usage: 'summary-only' },
      description: 'A short article on Psalm 23:1 tracing David’s confession back to Jacob and forward to Christ.',
    },
    {
      id: 'chabad-psalm-23',
      type: 'article',
      title: 'Psalm 23: L-rd Is My Shepherd',
      authorIds: [],
      publisher: 'Chabad.org',
      url: CHABAD_URL,
      license: { status: 'copyrighted', name: 'In copyright', usage: 'summary-only' },
      edition:
        'By Shlomo Chaim Kesselman. The live page blocks automated requests; checked against the Internet Archive snapshot of 15 February 2025 (https://web.archive.org/web/20250215175023/https://www.chabad.org/library/article_cdo/aid/3832324/jewish/Psalm-23-L-rd-Is-My-Shepherd.htm).',
      description: 'An article by Shlomo Chaim Kesselman explaining Psalm 23 and its place in Jewish prayer, especially on the Sabbath.',
    },
    {
      id: 'wikipedia-the-lords-my-shepherd',
      type: 'encyclopedia',
      title: '“The Lord’s My Shepherd” (hymn)',
      authorIds: [],
      publisher: 'Wikipedia',
      url: 'https://en.wikipedia.org/wiki/The_Lord%27s_My_Shepherd',
      license: {
        status: 'open-license',
        name: 'CC BY-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/',
        usage: 'excerpt',
        attribution: 'Wikipedia contributors, “The Lord’s My Shepherd.”',
      },
      description: 'Used only for the basic fact that this metrical version first appeared in the Scots Metrical Psalter of 1650.',
    },
  ],

  authors: [
    {
      id: 'rashi',
      name: 'Rashi',
      lifespan: 'c. 1040–1105',
      era: 'medieval',
      tradition: 'Jewish (medieval rabbinic commentator)',
      description:
        'Rabbi Shlomo Yitzchaki of Troyes, France, a leading medieval Jewish commentator on the Talmud and the Hebrew Bible; older Christian writers such as John Gill call him Jarchi.',
      aliases: ['rashi', 'shlomo yitzchaki', 'rabbi shlomo yitzchaki', 'solomon ben isaac', 'jarchi'],
      url: 'https://en.wikipedia.org/wiki/Rashi',
    },
    {
      id: 'cyril-of-jerusalem',
      name: 'Cyril of Jerusalem',
      lifespan: 'c. 313–386',
      era: 'early-church',
      tradition: 'Greek Church Father',
      description:
        'Fourth-century bishop of Jerusalem whose Catechetical Lectures instruct candidates before and after baptism; the five mystagogic lectures are traditionally his, though some scholars assign them, at least in their final form, to his successor John.',
      aliases: ['cyril of jerusalem', 'st cyril of jerusalem', 'saint cyril of jerusalem'],
      url: 'https://www.newadvent.org/fathers/310122.htm',
    },
    {
      id: 'alexander-maclaren',
      name: 'Alexander Maclaren',
      lifespan: '1826–1910',
      era: 'modern',
      tradition: 'Baptist',
      description: 'Scottish Baptist minister famed for expository preaching; his collected sermons form Expositions of Holy Scripture.',
      aliases: ['maclaren', 'alexander maclaren', 'mclaren'],
      url: 'https://en.wikipedia.org/wiki/Alexander_Maclaren',
    },
    {
      id: 'fb-meyer',
      name: 'F. B. Meyer',
      lifespan: '1847–1929',
      era: 'modern',
      tradition: 'Baptist',
      description: 'English Baptist pastor and evangelist, a friend of D. L. Moody, and the author of many devotional books.',
      aliases: ['f. b. meyer', 'fb meyer', 'f.b. meyer', 'meyer', 'frederick brotherton meyer'],
      url: 'https://en.wikipedia.org/wiki/F._B._Meyer',
    },
    {
      id: 'phillip-keller',
      name: 'W. Phillip Keller',
      lifespan: '1920–1997',
      era: 'contemporary',
      tradition: 'Evangelical (lay writer)',
      description: 'Born in East Africa, he worked in agricultural research, land management and ranch development in British Columbia before writing Christian books. Not to be confused with Timothy Keller.',
      aliases: ['phillip keller', 'w. phillip keller', 'w phillip keller', 'w. p. keller'],
      url: 'https://www.moodypublishers.com/authors/k/w-phillip-keller',
    },
    {
      id: 'kenneth-bailey',
      name: 'Kenneth E. Bailey',
      lifespan: '1930–2016',
      era: 'contemporary',
      tradition: 'Presbyterian (later Anglican canon theologian)',
      description:
        'American New Testament scholar who taught for decades in the Middle East, including at the Near East School of Theology in Beirut, and read the Gospels in the light of Middle Eastern culture; ordained in the Presbyterian Church (USA), he later served as a canon theologian in the Anglican Communion.',
      aliases: ['kenneth bailey', 'kenneth e. bailey', 'ken bailey', 'bailey'],
      url: 'https://en.wikipedia.org/wiki/Kenneth_E._Bailey',
    },
    {
      id: 'sinclair-ferguson',
      name: 'Sinclair B. Ferguson',
      lifespan: 'b. 1948',
      era: 'contemporary',
      tradition: 'Reformed (Scottish Presbyterian)',
      description: 'Scottish Reformed theologian, Chancellor’s Professor of Systematic Theology at Reformed Theological Seminary and a Ligonier Ministries teaching fellow.',
      aliases: ['sinclair ferguson', 'sinclair b. ferguson', 'ferguson'],
      url: 'https://en.wikipedia.org/wiki/Sinclair_Ferguson',
    },
  ],
};

export default study;
