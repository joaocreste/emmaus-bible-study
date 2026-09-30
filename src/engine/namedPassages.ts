/**
 * Well-known named passages ("the Sermon on the Mount", "the Beatitudes",
 * "the Lord's Prayer") → the reference they name. Only names that point to one
 * passage by broad convention are listed; where the Gospels share an episode,
 * the account the name usually refers to is used (the Lord's Prayer and the
 * Beatitudes in Matthew). Matched on normalised text, longest name first.
 */
import type { PassageRef } from '../domain/models';
import { escapeRegExp, lowerText } from './text';

function r(book: string, startChapter: number, startVerse?: number, endVerse?: number, endChapter?: number): PassageRef {
  if (startVerse == null) return endChapter != null ? { book, startChapter, endChapter } : { book, startChapter };
  return { book, startChapter, startVerse, endChapter: endChapter ?? startChapter, endVerse: endVerse ?? startVerse };
}

const NAMED: [string[], PassageRef][] = [
  [['sermon on the mount'], r('MAT', 5, undefined, undefined, 7)],
  [['sermon on the plain'], r('LUK', 6, 17, 49)],
  [['beatitudes', 'the beatitudes'], r('MAT', 5, 3, 12)],
  [["lord's prayer", 'lords prayer', 'the our father', 'our father prayer'], r('MAT', 6, 9, 13)],
  [['golden rule'], r('MAT', 7, 12)],
  [['great commandment', 'greatest commandment'], r('MAT', 22, 34, 40)],
  [['great commission'], r('MAT', 28, 16, 20)],
  [['olivet discourse'], r('MAT', 24, undefined, undefined, 25)],
  [['parable of the sower'], r('MAT', 13, 1, 23)],
  [['parable of the wheat and the weeds', 'parable of the wheat and tares', 'parable of the weeds'], r('MAT', 13, 24, 30)],
  [['parable of the unforgiving servant', 'unforgiving servant', 'parable of the unmerciful servant'], r('MAT', 18, 21, 35)],
  [['parable of the workers in the vineyard', 'labourers in the vineyard', 'laborers in the vineyard'], r('MAT', 20, 1, 16)],
  [['parable of the ten virgins', 'parable of the wise and foolish virgins'], r('MAT', 25, 1, 13)],
  [['parable of the talents'], r('MAT', 25, 14, 30)],
  [['sheep and the goats', 'sheep and goats'], r('MAT', 25, 31, 46)],
  [['wise and foolish builders', 'parable of the two builders'], r('MAT', 7, 24, 27)],
  [['good samaritan', 'parable of the good samaritan'], r('LUK', 10, 25, 37)],
  [['parable of the rich fool', 'rich fool'], r('LUK', 12, 13, 21)],
  [['parable of the great banquet'], r('LUK', 14, 15, 24)],
  [['parable of the lost sheep'], r('LUK', 15, 3, 7)],
  [['parable of the lost coin', 'lost coin'], r('LUK', 15, 8, 10)],
  [['prodigal son', 'parable of the prodigal son', 'parable of the lost son'], r('LUK', 15, 11, 32)],
  [['rich man and lazarus'], r('LUK', 16, 19, 31)],
  [['parable of the persistent widow', 'persistent widow'], r('LUK', 18, 1, 8)],
  [['pharisee and the tax collector'], r('LUK', 18, 9, 14)],
  [['magnificat'], r('LUK', 1, 46, 55)],
  [['benedictus'], r('LUK', 1, 68, 79)],
  [['nunc dimittis'], r('LUK', 2, 29, 32)],
  [['road to emmaus', 'emmaus road'], r('LUK', 24, 13, 35)],
  [['prologue of john', "john's prologue", 'johns prologue', 'prologue to john', 'johannine prologue'], r('JHN', 1, 1, 18)],
  [['wedding at cana'], r('JHN', 2, 1, 11)],
  [['woman at the well', 'samaritan woman'], r('JHN', 4, 1, 42)],
  [['good shepherd', 'good shepherd discourse'], r('JHN', 10, 1, 18)],
  [['raising of lazarus'], r('JHN', 11)],
  [['upper room discourse', 'farewell discourse'], r('JHN', 13, undefined, undefined, 17)],
  [['high priestly prayer'], r('JHN', 17)],
  [['road to damascus', 'damascus road'], r('ACT', 9, 1, 19)],
  [['love chapter'], r('1CO', 13)],
  [['resurrection chapter'], r('1CO', 15)],
  [['armour of god', 'armor of god', 'whole armour of god', 'whole armor of god'], r('EPH', 6, 10, 20)],
  [['christ hymn', 'kenosis passage', 'carmen christi'], r('PHP', 2, 5, 11)],
  [['hall of faith', 'faith chapter'], r('HEB', 11)],
  [['creation account', 'creation story', 'creation narrative', 'days of creation', 'six days of creation'], r('GEN', 1, undefined, undefined, 2)],
  [['fall of man', 'the fall narrative'], r('GEN', 3)],
  [['tower of babel'], r('GEN', 11, 1, 9)],
  [["noah's ark", 'noahs ark', 'the flood narrative'], r('GEN', 6, undefined, undefined, 9)],
  [['binding of isaac', 'sacrifice of isaac', 'akedah'], r('GEN', 22, 1, 19)],
  [["jacob's ladder", 'jacobs ladder'], r('GEN', 28, 10, 22)],
  [['burning bush'], r('EXO', 3)],
  [['crossing of the red sea', 'parting of the red sea'], r('EXO', 14)],
  [['ten commandments', 'decalogue'], r('EXO', 20, 1, 17)],
  [['priestly blessing', 'aaronic blessing'], r('NUM', 6, 22, 27)],
  [['shema'], r('DEU', 6, 4, 9)],
  [['david and goliath'], r('1SA', 17)],
  [['shepherd psalm'], r('PSA', 23)],
  [['call of isaiah', "isaiah's call", 'isaiahs call', "isaiah's vision"], r('ISA', 6)],
  [['suffering servant', 'fourth servant song'], r('ISA', 52, 13, 12, 53)],
  [['valley of dry bones', 'dry bones'], r('EZK', 37, 1, 14)],

  /* ---- Português ---- */
  [['sermão do monte'], r('MAT', 5, undefined, undefined, 7)],
  [['bem-aventuranças', 'bem aventuranças', 'as bem-aventuranças'], r('MAT', 5, 3, 12)],
  [['pai nosso', 'oração do senhor', 'o pai nosso'], r('MAT', 6, 9, 13)],
  [['regra de ouro'], r('MAT', 7, 12)],
  [['grande mandamento', 'maior mandamento'], r('MAT', 22, 34, 40)],
  [['grande comissão'], r('MAT', 28, 16, 20)],
  [['parábola do semeador'], r('MAT', 13, 1, 23)],
  [['parábola dos talentos'], r('MAT', 25, 14, 30)],
  [['bom samaritano', 'parábola do bom samaritano'], r('LUK', 10, 25, 37)],
  [['ovelha perdida', 'parábola da ovelha perdida'], r('LUK', 15, 3, 7)],
  [['filho pródigo', 'parábola do filho pródigo'], r('LUK', 15, 11, 32)],
  [['caminho de emaús', 'estrada de emaús'], r('LUK', 24, 13, 35)],
  [['prólogo de joão', 'prólogo do evangelho de joão'], r('JHN', 1, 1, 18)],
  [['bom pastor'], r('JHN', 10, 1, 18)],
  [['capítulo do amor'], r('1CO', 13)],
  [['armadura de deus'], r('EPH', 6, 10, 20)],
  [['dez mandamentos', 'decálogo'], r('EXO', 20, 1, 17)],
  [['salmo do pastor'], r('PSA', 23)],
  [['servo sofredor'], r('ISA', 52, 13, 12, 53)],

  /* ---- Español ---- */
  [['sermón del monte'], r('MAT', 5, undefined, undefined, 7)],
  [['bienaventuranzas', 'las bienaventuranzas'], r('MAT', 5, 3, 12)],
  [['padre nuestro', 'padrenuestro', 'oración del señor'], r('MAT', 6, 9, 13)],
  [['regla de oro'], r('MAT', 7, 12)],
  [['gran mandamiento', 'mayor mandamiento'], r('MAT', 22, 34, 40)],
  [['gran comisión'], r('MAT', 28, 16, 20)],
  [['parábola del sembrador'], r('MAT', 13, 1, 23)],
  [['parábola de los talentos'], r('MAT', 25, 14, 30)],
  [['buen samaritano', 'parábola del buen samaritano'], r('LUK', 10, 25, 37)],
  [['oveja perdida', 'parábola de la oveja perdida'], r('LUK', 15, 3, 7)],
  [['hijo pródigo', 'parábola del hijo pródigo'], r('LUK', 15, 11, 32)],
  [['camino de emaús'], r('LUK', 24, 13, 35)],
  [['prólogo de juan', 'prólogo del evangelio de juan'], r('JHN', 1, 1, 18)],
  [['buen pastor'], r('JHN', 10, 1, 18)],
  [['capítulo del amor'], r('1CO', 13)],
  [['armadura de dios'], r('EPH', 6, 10, 20)],
  [['diez mandamientos'], r('EXO', 20, 1, 17)],
  [['salmo del pastor'], r('PSA', 23)],
  [['siervo sufriente'], r('ISA', 52, 13, 12, 53)],

  /* ---- Français ---- */
  [['sermon sur la montagne'], r('MAT', 5, undefined, undefined, 7)],
  [['béatitudes', 'les béatitudes'], r('MAT', 5, 3, 12)],
  [['notre père', 'oraison dominicale', 'prière du seigneur'], r('MAT', 6, 9, 13)],
  [["règle d'or", 'règle d’or'], r('MAT', 7, 12)],
  [['grand commandement', 'plus grand commandement'], r('MAT', 22, 34, 40)],
  [['grand mandat', 'grande commission', 'mandat missionnaire'], r('MAT', 28, 16, 20)],
  [['parabole du semeur'], r('MAT', 13, 1, 23)],
  [['parabole des talents'], r('MAT', 25, 14, 30)],
  [['bon samaritain', 'parabole du bon samaritain'], r('LUK', 10, 25, 37)],
  [['brebis perdue', 'parabole de la brebis perdue'], r('LUK', 15, 3, 7)],
  [['fils prodigue', 'parabole du fils prodigue', 'enfant prodigue'], r('LUK', 15, 11, 32)],
  [["pèlerins d'emmaüs", 'pèlerins d’emmaüs', "chemin d'emmaüs", 'chemin d’emmaüs'], r('LUK', 24, 13, 35)],
  [['prologue de jean', "prologue de l'évangile de jean", 'prologue de l’évangile de jean'], r('JHN', 1, 1, 18)],
  [['bon berger'], r('JHN', 10, 1, 18)],
  [["hymne à l'amour", 'hymne à l’amour', 'chapitre de l’amour', "chapitre de l'amour"], r('1CO', 13)],
  [['armure de dieu', 'armes de dieu'], r('EPH', 6, 10, 20)],
  [['dix commandements', 'décalogue'], r('EXO', 20, 1, 17)],
  [['psaume du berger'], r('PSA', 23)],
  [['serviteur souffrant'], r('ISA', 52, 13, 12, 53)],
];

const INDEX: { phrase: string; display: string; re: RegExp; ref: PassageRef }[] = NAMED.flatMap(([names, ref]) =>
  names.map((n) => {
    const phrase = lowerText(n);
    return { phrase, display: names[0], ref, re: new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegExp(phrase)}(?=$|[^\\p{L}\\p{N}])`, 'u') };
  }),
).sort((a, b) => b.phrase.length - a.phrase.length);

export interface NamedPassage {
  /** the matched name as it appears in the (folded, lowercase) message */
  match: string;
  /** the name for prose, lowercase ("sermon on the mount") */
  name: string;
  ref: PassageRef;
  /** position of the match in the folded message */
  index: number;
}

/** The first (longest) named passage mentioned in a message, if any. */
export function findNamedPassage(text: string): NamedPassage | undefined {
  const lower = lowerText(text);
  for (const e of INDEX) {
    const m = e.re.exec(lower);
    if (m) return { match: e.phrase, name: e.display, ref: e.ref, index: m.index };
  }
  return undefined;
}
