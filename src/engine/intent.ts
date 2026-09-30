/**
 * Intent classification + slot extraction — deterministic rules over the
 * message, the current study and the conversation state.
 *
 * Order matters: greeting/help/sources → explicit topic phrasing → a message
 * dominated by a reference → connect → a named Christian author → perspectives
 * → cross-references → word study → context/literary/theology → commentary →
 * verse mentions → bare topics/terms → fallbacks.
 *
 * Multilingual (en/pt/es/fr): the message language is `env.locale` or detected
 * from its function words. A Portuguese, Spanish or French message is *framed*
 * first — its question framing and function words rewritten to the English cue
 * phrases the rules below understand ("o que significa X" → "what is the meaning
 * of X", "neste versículo" → "in this verse"), leaving the reader's own words
 * (terms, topics, book names) untouched — and a second, *cue* form glosses the
 * category keywords ("estrutura" → "structure", "leitores originais" → "original
 * readers"). References are parsed in the reader's language; terms and topics
 * come back in the reader's spelling ("condenação").
 */
import type { Author, BookId, ConversationState, PassageRef, RelationshipType, Study, Testament, VerseRef } from '../domain/models';
import { BOOKS, findBook, tryGetBook } from '../domain/books';
import { BOOK_NAMES, type NonEnglishLocale } from '../domain/bookNames';
import { findBookMention, findReferences, parseReference, refContains, refIncludesVerse, wholeBook, type FoundReference } from '../domain/reference';
import type { Locale } from '../i18n/locales';
import { findNamedPassage } from './namedPassages';
import {
  bestPhraseScore,
  contentTokens,
  detectLocale,
  escapeRegExp,
  fold,
  lowerText,
  normalizePhrase,
  normalizeTopicQuery,
  phraseScore,
  restoreSpelling,
  STOPWORDS,
  TERM_FUNCTION_WORDS,
  tokenize,
  TOPIC_FRAMES,
} from './text';
import type { Intent, IntentKind } from './types';

export interface ClassifierEnv {
  study: Study | null;
  conversation: ConversationState;
  /** registry lookup for a Christian author named in the message (SourceRegistry.findAuthor) */
  findAuthor(text: string): Author | undefined;
  /** is this (normalised) phrase a known topic — a curated topic study or a topic-index entry? */
  isKnownTopic?(phrase: string): boolean;
  /**
   * The reader's language (EngineContext.locale). Messages are still understood
   * in any of the four languages; this decides ties ("Romanos 8", "graça") and the
   * reference conventions. When absent the message language is detected.
   */
  locale?: Locale;
}

/** Classifier output: the public Intent plus extra parse details the responders use. */
export interface ParsedMessage {
  intent: Intent;
  /** original message, trimmed */
  text: string;
  /**
   * folded, lowercase, whitespace-collapsed message (greeting prefix removed). For a
   * Portuguese, Spanish or French message this is the English *cue* form (question
   * framing and category keywords glossed to English, the reader's own words kept), so
   * English cue checks in the responders keep working.
   */
  lower: string;
  /** language to answer in: `env.locale`, else the detected message language */
  locale?: Locale;
  /** language the message was written in (detected; `env.locale` when undecidable) */
  messageLocale?: Locale;
  /** explicit references found in the message */
  references: PassageRef[];
  /** relationship words ("quotation", "prophecy", "parallel"…) → cross-reference filter */
  relationships: RelationshipType[];
  /** the message points back at the conversation ("this", "here", "this idea") */
  refersToContext: boolean;
  /** "the last verse" — resolved by the engine against the verse count */
  lastVerse?: boolean;
  /** connect target (book, passage or testament) */
  connect?: { book?: BookId; ref?: PassageRef; testament?: Testament };
  /** "what does the Bible say about…", "why does God allow…" */
  explicitTopic?: boolean;
  /** "what are the key words in this passage?" */
  wantsKeyWords?: boolean;
  /** the word-study term was resolved from the conversation ("this word") */
  termFromContext?: boolean;
  /** a named passage ("the Sermon on the Mount") resolved to `references[0]` */
  namedPassage?: string;
}

/* ------------------------------------------------------------------ */
/* Cue patterns                                                        */
/* ------------------------------------------------------------------ */

const GREETING_RE =
  /^\s*(hi|hello|hey|hiya|howdy|greetings|good (morning|afternoon|evening|day)|peace( be with you)?|shalom|grace and peace|thanks|thank you( so much| very much)?|thx|cheers|amen|blessings)\b[\s,.!?:;-]*/i;

const HELP_RE =
  /^(help|\?+|what can you do|what can i (ask|do)|what should i ask|how (does|do) (this|you|it) work|how do i (use this|use you|start|begin)|what is this|who are you|what are you|instructions|menu)[\s?.!]*$/;
const HELP_ANY_RE = /\b(what can you do|how does this (app|tool|work)|how do i use (this|emmaus))\b/;

const SOURCES_RE =
  /^(show |list |open |see )?(me )?(the |your |all |all the )?(sources|bibliography|citations|works cited)\b|\bwhere (does|did) (this|that|it|all this|the information|this information|this material) come from\b|\bwhere did you get (this|that|it)\b|\bhow do (you|we|i) know (this|that)\b|\bwhat (sources|works|books) (do|did) you (use|cite|draw on|rely on)\b|\bis (this|that|it) (reliable|verified|accurate|trustworthy|sourced)\b|\b(licen[cs]e|licensing|copyright)\b/;

const STRONG_TOPIC_RE =
  /^(?:so |and |but )?(?:what (?:does|do) (?:the bible|the scriptures?|scripture|god'?s word|god|the new testament|the old testament|jesus) (?:say|teach|tell us|reveal) (?:about|on|regarding) |what (?:did|does) jesus (?:say|teach) about |why (?:does|did|would|do) (?:a good |a loving )?god (?:allow|permit) |how (?:can|could) (?:a good |a loving )?god (?:allow|permit) |what is the biblical (?:view|teaching|perspective) (?:of|on|about) |(?:the )?biblical (?:view|teaching|perspective) (?:of|on|about) |bible verses (?:about|on) )(.+)$/;

const WEAK_TOPIC_RE =
  /^(?:please )?(?:tell me (?:more )?about|teach me about|help me understand|i want to (?:study|learn about|explore)|i(?:'d| would) like to (?:study|explore)|can we (?:study|explore|talk about)|let'?s (?:study|explore|talk about)|study|explore|what is|what are|what's|who is|learn about)\s+(.+)$/;

const CONNECT_RE =
  /\b(connect(s|ed|ion|ions)?|relate[sd]?|relating|relationship between|compare[sd]?|comparing|comparison|link(s|ed)? (to|with)|tie[sd]? (in|into|to|together)|fits? (with|into)|in light of|parallel to)\b/;

const DIFFER_RE = /\b(differs?|different|contrasts?) (from|with)\b/;

const PERSPECTIVES_RE =
  /\b(interpretations?|interpret(ed|ers|ing)?|different (views?|readings?|understandings?|positions?|opinions?|traditions?)|views? (on|of) (this|it|the)|perspectives?|debated?|debates|disagree(ment|ments|s)?|differ|differences|controvers(y|ies|ial)|denominations?|denominational|calvinis(t|ts|m)|arminian(s|ism)?|reformed (view|position|reading|tradition|theology|understanding)|catholics?|catholicism|eastern orthodox|orthodox (view|church|christians|tradition)|lutherans?|wesleyans?|methodists?|pentecostals?|do (all )?christians (agree|disagree|differ))\b/;

const XREF_RE =
  /\b(cross[- ]?ref(erence)?s?|xrefs?|other (passages?|verses?|places|texts|scriptures|parts of (the )?(bible|scripture))|where else|elsewhere|similar (passages?|verses?|texts?|ideas?)|related (passages?|verses?|texts?)|parallel (passages?|texts?|accounts?)|parallels|same (idea|theme|concept|thought|teaching)|this idea|idea appears?|appears? (elsewhere|again)|(show|list|find) (me )?(the |some )?references|rest of (the )?(bible|scripture|new testament|old testament)|echo(es|ed)?|allu(sion|sions|de|des|ded)|quot(ed|es|ation|ations) (from|of|in)|quoted|fulfil+(s|ed|ment|ments)?|prophec(y|ies) (of|about|fulfilled)|old testament (background|roots|quotations?|allusions?))\b/;

const KEYWORDS_RE =
  /\b(key|important|main|significant) (words?|terms?)\b|\b(greek|hebrew|aramaic|original[- ]language) (words?|terms?) (in|of|behind) (this|the) (passage|chapter|text|psalm)\b|^word study$|^(what are the )?(greek|hebrew) words\??$/;

const HISTORICAL_RE =
  /\b(histor(y|ical|ically)|background|cultur(e|al|ally)|customs?|original (audience|readers|hearers|context|setting|listeners)|first (readers|hearers|audience|listeners|century)|audience|readers|hearers|listeners|recipients|setting|occasion|circumstances?|who wrote|written by|authorship|author of (this|the|it)|when was (this|it) written|date[ds]?|dating|geograph(y|ical)|where was (this|it)|ancient near east(ern)?|near eastern|greco-roman|graeco-roman|hellenistic|roman (empire|world|culture|law|society)|jewish (context|background|tradition|readers|audience|customs?|practice|law|world)|first-century|at the time|in that time|in those days|politic(s|al)|econom(y|ic|ics)|slavery)\b/;

const LITERARY_RE =
  /\b(literary|structure[ds]?|structural|outline|chiasm(us)?|chiastic|parallelism|inclusio|repetition|repeated|repeats|metaphors?|imagery|poem|poetry|poetic|genre|flow of (thought|the argument)|argument|rhetoric(al)?|transition|narrative (structure|arc|flow)|fits? (in|into) (the|this) (book|chapter|letter|gospel)|where does (this|it) fit|place in the (book|letter|chapter|canon)|(rest|context) of the (book|letter|chapter|gospel)|broader (context|story|narrative)|bigger (story|picture)|storyline|big picture|how is (this|it) (built|organi[sz]ed|structured))\b/;

const THEOLOGY_RE =
  /\b(theolog(y|ical|ically)|doctrines?|doctrinal|teach(es)? (us )?about|what does (this|it|the passage|this passage|this chapter|the text|this text|the chapter|this psalm) (teach|reveal|show|say|tell us) (us )?about|christolog(y|ical)|pneumatolog(y|ical)|soteriolog(y|ical)|eschatolog(y|ical)|ecclesiolog(y|ical)|atonement|justification|sanctification|glorification|trinitarian|providence|sovereignty|incarnation|what does this say about god|nature of god|character of god)\b/;

const COMMENTARY_RE =
  /\b(commentar(y|ies)|commentators?|church fathers|the fathers|theologians?|scholars?|christian (thinkers|voices|writers|authors)|thinkers|preachers?|pastors?|sermons?|preached|preaching|reformers|puritans|what have christians said|classic (commentators|commentaries|voices)|study notes?|tyndale notes?|voices)\b/;

const CONTEXT_REF_RE = /\b(this|that|it|here|these|those)\b/;

// Words that carry no request of their own when a message is "just a reference".
const FILLER = new Set(
  (
    'study studying open read reading look looking at let lets us go to show me can could we i want would like please the passage ' +
    'chapter book of explore take a an into turn jump switch now next how about what whats instead then and today begin start with ' +
    'on bring up pull see id try do does is it tell more hmm ok okay maybe also yes sure great so just again for onto shall should ' +
    'move over going back through in our my bible text hi hello hey well wanna gonna lets let\'s understand learn know about ' +
    'list letter verse verses ' +
    // pt / es / fr (folded) — in case a request word was not framed
    'estudar estude estudo abrir abra abre ler leia ver vamos quero gostaria podemos poderiamos mostre mostra mostrar me o a os as um uma ' +
    'livro de do da dos das capitulo agora hoje entao por favor sobre fale conte carta aos epistola ao no na em e ' +
    'estudiar estudia estudiemos abrir leer lee muestra muestrame quiero podemos el la los las libro del al ahora hoy por favor ' +
    'hablame cuentame epistola y en entender compreender comprender comprendre ' +
    'etudier etudie etudions ouvre ouvrir ouvrons lis lire lisons montre moi voir allons je veux voudrais aimerais j le la les l livre du d ' +
    'chapitre maintenant aujourd hui s il vous plait sur parle parlez lettre epitre aux et en'
  ).split(/\s+/),
);

// "what does X mean" where X is not a word but a speaker or the text itself → explain the context instead.
const VAGUE_TERMS = new Set([
  'this', 'that', 'it', 'he', 'she', 'they', 'him', 'this word', 'that word', 'the word', 'this term', 'this phrase', 'here',
  'this verse', 'that verse', 'this passage', 'the passage', 'the text', 'this text', 'this chapter', 'the author', 'the writer',
  'paul', 'john', 'peter', 'jesus', 'god', 'david', 'moses', 'the psalmist', 'luke', 'james',
  // pt / es / fr (folded)
  'isso', 'isto', 'aquilo', 'ele', 'ela', 'eles', 'elas', 'eso', 'esto', 'aquello', 'el', 'ella', 'ellos', 'cela', 'ca', 'ceci', 'il', 'elle', 'ils',
  'this palavra', 'this palabra', 'this mot', 'a palavra', 'la palabra', 'le mot', 'o texto', 'el texto', 'le texte', 'o autor', 'el autor', 'l auteur',
  'o escritor', 'el escritor', 'o salmista', 'el salmista', 'le psalmiste', 'this text', 'this chapter', 'this context',
  'paulo', 'pablo', 'joao', 'juan', 'jean', 'pedro', 'pierre', 'deus', 'dios', 'dieu', 'davi', 'moises', 'moise', 'lucas', 'luc', 'tiago',
  'santiago', 'jacques', 'senhor', 'senor', 'seigneur',
]);

/* ------------------------------------------------------------------ */
/* Multilingual framing (pt / es / fr → English cue phrases)           */
/* ------------------------------------------------------------------ */

type Foreign = NonEnglishLocale;
type Rule = readonly [RegExp, string];

function applyRules(s: string, rules: readonly Rule[]): string {
  let out = s;
  for (const [re, rep] of rules) {
    const next = out.replace(re, rep);
    if (next !== out) out = next.replace(/\s+/g, ' ').trim();
  }
  return out;
}

/** Folded, punctuation-normalised form of a pt/es/fr message: ¿¡ dropped, « » as quotes, French spacing and elisions resolved. */
function foreignBase(text: string, lang: Foreign): string {
  const s = fold(text)
    .replace(/[«»‹›]/g, '"')
    .replace(/[¿¡]/g, ' ')
    .replace(/\s+([?!;](?!\d))/g, '$1')
    .replace(/(\p{L})'(?=\p{L})/gu, '$1 ')
    .replace(/(\p{L})-(?=\p{L})/gu, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();
  return s.replace(LEADING_FILLERS[lang], '').trim();
}

const LEADING_FILLERS: Record<Foreign, RegExp> = {
  pt: /^(?:(?:e|mas|entao|bom|bem|ok|okay|certo|agora|beleza|legal|otimo)[,.!]?\s+)+/,
  es: /^(?:(?:y|pero|entonces|bueno|vale|ok|okay|ahora|pues|perfecto|genial)[,.!]?\s+)+/,
  fr: /^(?:(?:et|mais|alors|donc|bon|bien|ok|okay|d accord|maintenant|parfait|super)[,.!]?\s+)+/,
};

/** Original-language names, folded ("grego", "griega", "grec" → "greek"); plural book names ("Hebreus") are left alone. */
const LANGUAGE_NAMES: Record<Foreign, Rule[]> = {
  pt: [
    [/\bgreg[oa]s?\b/g, 'greek'],
    [/\b(?:hebraic[oa]s?|hebreu)\b/g, 'hebrew'],
    [/\baramaic[oa]s?\b/g, 'aramaic'],
  ],
  es: [
    [/\bgrieg[oa]s?\b/g, 'greek'],
    [/\bhebre[oa]\b/g, 'hebrew'],
    [/\barame[oa]s?\b/g, 'aramaic'],
  ],
  fr: [
    [/\bgrec(?:que)?s?\b/g, 'greek'],
    [/\b(?:hebreu|hebraique)\b/g, 'hebrew'],
    [/\barameen(?:ne)?s?\b/g, 'aramaic'],
  ],
};

// A few words of an author or subject, lazily ("paulo", "o apóstolo paulo").
const FEW = String.raw`((?:\S+ ){0,3}?\S+)`;

/** Question framings with slots (word study, theology) — run before the topic framings. */
const WORD_RULES: Record<Foreign, Rule[]> = {
  pt: [
    [/^qual (?:e |seria )?(?:a |o )?(?:palavra|termo|vocabulo|raiz) (greek|hebrew|aramaic|original) (?:(?:que )?(?:esta|fica) )?(?:por tras de|por detras de|por tras da|por tras do|para|de|do|da|usad[oa] (?:para|em)|traduzid[oa] (?:como|por)|que traduz|que corresponde a|em) /, 'what is the $1 word behind '],
    [/^(?:a |o )?(?:palavra|termo) (greek|hebrew|aramaic|original) (?:por tras de|para|de|do|da|traduzid[oa] como) /, 'the $1 word behind '],
    [/^(?:qual|que) (?:palavra|termo) (greek|hebrew|aramaic|original) (?:(?:esta|fica|se esconde|ha) )?(?:por tras de|por detras de|por tras da|por tras do|para|traduzid[oa] (?:como|por)) /, 'what is the $1 word behind '],
    [/^(?:quais (?:sao )?)?(?:as |os )?(?:palavras|termos) (greek|hebrew|aramaic) e (greek|hebrew|aramaic) (?:por tras de|para|de|do|da) /, 'what are the $1 and $2 words for '],
    [/^qual (?:e |sao )?(?:a |as )?(?:palavras?|termos?) (greek|hebrew|aramaic) e (greek|hebrew|aramaic) (?:por tras de|para|de|do|da) /, 'what are the $1 and $2 words for '],
    [/^como (?:se diz|e|fica) (.+?) (?:em|no) (greek|hebrew|aramaic)(?: original)?([?.!]*)$/, 'what is $1 in the $2$3'],
    [/^(?:o )?que (?:e que )?(?:significa|quer dizer) (?:a |o )?(?:palavra|termo) (greek|hebrew|aramaic) (?:para|por tras de|traduzid[oa] (?:como|por)) (.+?)([?.!]*)$/, 'what does the $1 word for $2 mean$3'],
    [/^(?:o )?que (?:e que )?(?:significa|quer dizer) (?:a |o )?(?:palavra|termo) (greek|hebrew|aramaic) (.+?)([?.!]*)$/, 'what does the $1 word $2 mean$3'],
    [/^(?:(?:e|seria) )?(?:errado|pecado) (?=ter |fazer |sentir |se |duvidar |ficar |estar )/, 'is it wrong to '],
    [/^(?:a |o |as |os )?(\S+) (?:e|sao) (?:um |uma )?pecado([?.!]*)$/, 'is $1 a sin$2'],
    [/^quais (?:sao )?as principais (?:visoes|posicoes|interpretacoes|opinioes|leituras) (?:sobre|a respeito de|acerca de|de|do|da) (?:o |a |os |as )?/, 'what are the main views of the '],
    [/^(?:o )?que (?:e que )?(?:significa|significam|quer dizer|querem dizer) (?:ser|estar) /, 'what does it mean to be '],
    [/^(?:o )?que (?:e que )?(?:significa|significam|quer dizer|querem dizer) /, 'what is the meaning of '],
    [new RegExp(String.raw`^(?:o )?que (?:e que )?${FEW} (?:quer|queria|quis) dizer com `), 'what does $1 mean by '],
    [new RegExp(String.raw`^(?:o )?que (?:e que )?${FEW} (?:significa|significam|quer dizer|querem dizer)(?=[\s?.!]|$)`), 'what does $1 mean'],
    [/^qual (?:e )?(?:o )?(?:significado|sentido) (?:de|do|da|dos|das) /, 'what is the meaning of '],
    [/^(?:o )?(?:significado|sentido) (?:de|do|da|dos|das) /, 'meaning of '],
    [new RegExp(String.raw`^por ?que ${FEW} (?:e|foi|era|sera) (?:chamad[oa]s?|descrit[oa]s? como|conhecid[oa]s? como|apresentad[oa]s? como) (?:de )?`), 'why is $1 called '],
    [/^(?:defina|definir|traduza|traduzir)(?: me)? /, 'define '],
    [/^estudo (?:de|da) palavra (?:sobre |de |para )?/, 'word study of '],
    [/^(?:o )?que (?:esta|essa|a|este|esse|o) (?:passagem|texto|capitulo|trecho|salmo|versiculo|carta) (?:nos )?(?:ensina|revela|mostra|diz|fala) (?:sobre|a respeito de|a respeito do|a respeito da|acerca de|de|do|da) /, 'what does this passage teach about '],
    [/^(?:o )?que (?:isso|isto) (?:nos )?(?:ensina|revela|mostra|diz) (?:sobre|a respeito de|a respeito do|a respeito da|acerca de|do|da) /, 'what does this teach about '],
  ],
  es: [
    [/^cual (?:es |seria )?(?:la |el )?(?:palabra|termino|vocablo|raiz) (greek|hebrew|aramaic|original) (?:(?:que )?(?:hay|esta) )?(?:detras de|detras del|tras|para|de|del|que se traduce como|que se traduce|traducid[oa] como|usad[oa] para|en) /, 'what is the $1 word behind '],
    [/^(?:la |el )?(?:palabra|termino) (greek|hebrew|aramaic|original) (?:detras de|detras del|para|de|del|traducid[oa] como) /, 'the $1 word behind '],
    [/^que (?:palabra|termino|vocablo) (greek|hebrew|aramaic|original) (?:(?:hay|esta|se esconde|se encuentra) )?(?:detras de|detras del|tras|para|que se traduce como|traducid[oa] como|usad[oa] para) /, 'what is the $1 word behind '],
    [/^(?:cuales son |cual es )?(?:las |la |los |el )?(?:palabras?|terminos?) (greek|hebrew|aramaic) y (greek|hebrew|aramaic) (?:detras de|detras del|para|de|del) /, 'what are the $1 and $2 words for '],
    [/^como se dice (.+?) en (greek|hebrew|aramaic)(?: original)?([?.!]*)$/, 'what is $1 in the $2$3'],
    [/^que significa (?:la |el )?(?:palabra|termino|vocablo) (greek|hebrew|aramaic) (?:para|detras de|que se traduce (?:como|por)|traducid[oa] como) (.+?)([?.!]*)$/, 'what does the $1 word for $2 mean$3'],
    [/^que significa (?:la |el )?(?:palabra|termino|vocablo) (greek|hebrew|aramaic) (.+?)([?.!]*)$/, 'what does the $1 word $2 mean$3'],
    [/^(?:esta|es) mal /, 'is it wrong to '],
    [/^(?:es|son) pecado /, 'is it a sin to '],
    [/^(?:es|son) (?:la |el |las |los )?(\S+) (?:un )?pecado([?.!]*)$/, 'is $1 a sin$2'],
    [/^cuales son las principales (?:posturas|posiciones|visiones|interpretaciones|opiniones|lecturas) (?:sobre|acerca de|acerca del|del|de) (?:el |la |los |las )?/, 'what are the main views of the '],
    [/^(?:que|lo que) (?:significa|significan|quiere decir|quieren decir) (?:ser|estar) /, 'what does it mean to be '],
    [new RegExp(String.raw`^que (?:quiere|quiso|queria) decir ${FEW} (?:con|cuando habla de|cuando dice) `), 'what does $1 mean by '],
    [/^(?:que|lo que) (?:significa|significan|quiere decir|quieren decir) /, 'what is the meaning of '],
    [new RegExp(String.raw`^que ${FEW} (?:significa|significan|quiere decir)(?=[\s?.!]|$)`), 'what does $1 mean'],
    [/^cual es (?:el )?(?:significado|sentido) (?:de|del) /, 'what is the meaning of '],
    [/^(?:el )?(?:significado|sentido) (?:de|del) /, 'meaning of '],
    [new RegExp(String.raw`^por ?que (?:a )?${FEW} (?:se le llama|se llama|es llamad[oa]|fue llamad[oa]|se describe como|es descrit[oa] como) `), 'why is $1 called '],
    [/^(?:define|definir|defina|traduce|traducir) /, 'define '],
    [/^que (?:nos )?(?:ensena|revela|muestra|dice) (?:este|esta|ese|esa|el|la) (?:pasaje|texto|capitulo|versiculo|salmo|carta) (?:sobre|acerca de|acerca del|de|del) /, 'what does this passage teach about '],
    [/^que (?:nos )?(?:ensena|revela|muestra|dice) (?:esto|eso) (?:sobre|acerca de|acerca del|de|del) /, 'what does this teach about '],
  ],
  fr: [
    // "Quelle différence entre grâce et miséricorde ?" — a comparison of two concepts, as in English (not cross-references)
    [/^(?:quelle est la |quelle |y a t il une )?difference (?:y a t il )?entre (?:la |le |les |l )?(.+?) et (?:la |le |les |l )?(.+?)([?.!]*)$/, 'what is the difference between $1 and $2$3'],
    [/^en quoi (?:la |le |les |l )?(.+?) (?:differe|se distingue) t (?:il|elle|ils|elles) (?:de la |du |des |de l |d |de )(.+?)([?.!]*)$/, 'what is the difference between $1 and $2$3'],
    [/^(?:la |le |les |l )?(.+?) et (?:la |le |les |l )?(.+?) quelle (?:est la )?difference([?.!]*)$/, 'what is the difference between $1 and $2$3'],
    [/^(?:quel est|c est quoi|qu est ce que|quel serait) le (?:mot|terme|vocable) (greek|hebrew|aramaic|original) (?:qui se cache )?(?:derriere|pour|de|du|traduit par|rendu par|sous|utilise pour|employe pour|dans|a l origine de) /, 'what is the $1 word behind '],
    [/^(?:le )?(?:mot|terme) (greek|hebrew|aramaic|original) (?:derriere|pour|de|du|traduit par|rendu par) /, 'the $1 word behind '],
    [/^quel (?:mot|terme) (greek|hebrew|aramaic) (?:est|se cache|se trouve) (?:traduit par|derriere|employe pour|utilise pour|rendu par) /, 'what is the $1 word behind '],
    [/^(?:quels sont )?(?:les )?(?:mots|termes) (greek|hebrew|aramaic) et (greek|hebrew|aramaic) (?:derriere|pour|de|du) /, 'what are the $1 and $2 words for '],
    [/^comment dit on (.+?) en (greek|hebrew|aramaic)([?.!]*)$/, 'what is $1 in the $2$3'],
    [/^(?:que|qu est ce que) (?:signifie|veut dire) le (?:mot|terme) (greek|hebrew|aramaic) (?:traduit par|rendu par|pour|derriere) (.+?)([?.!]*)$/, 'what does the $1 word for $2 mean$3'],
    [/^(?:que|qu est ce que) (?:signifie|veut dire) le (?:mot|terme) (greek|hebrew|aramaic) (.+?)([?.!]*)$/, 'what does the $1 word $2 mean$3'],
    [/^est ce (?:mal|un peche|grave|mauvais) (?:d |de )/, 'is it wrong to '],
    [/^(?:l |la |le |les )?(\S+) est (?:elle |il )?un peche([?.!]*)$/, 'is $1 a sin$2'],
    [/^quelles sont les principales (?:positions|visions|interpretations|lectures|opinions) (?:sur|au sujet de|concernant) (?:le |la |les |l )?/, 'what are the main views of the '],
    [new RegExp(String.raw`^qu entend ${FEW} (?:ici |here )?par `), 'what does $1 mean by '],
    [new RegExp(String.raw`^ou ${FEW} parle t (?:il|elle|ils) (?:encore|aussi|ailleurs|d autre part) (?:de ce sujet|de cela|de ceci|de ce theme)?`), 'where else does $1 talk about this'],
    [new RegExp(String.raw`^comment ${FEW} s articule t (?:il|elle) (?:avec|dans) (?:le reste de|l ensemble de) `), 'how does $1 connect with the rest of '],
    [/^(?:que|qu est ce que|qu est ce qui) (?:signifie|signifient|veut dire|veulent dire) (?:etre|d etre) /, 'what does it mean to be '],
    [new RegExp(String.raw`^(?:que|qu est ce que) veut dire ${FEW} (?:par|avec|quand il parle de) `), 'what does $1 mean by '],
    [new RegExp(String.raw`^qu est ce que ${FEW} veut dire (?:par|avec) `), 'what does $1 mean by '],
    [/^(?:que|qu est ce que|qu est ce qui) (?:signifie|signifient|veut dire|veulent dire) /, 'what is the meaning of '],
    [new RegExp(String.raw`^qu est ce que ${FEW} (?:signifie|veut dire)(?=[\s?.!]|$)`), 'what does $1 mean'],
    [/^(?:quel est|quel serait) le sens (?:exact |precis )?(?:de la|de l|de|du|des|d) /, 'what is the meaning of '],
    [/^quelle est la signification (?:de la|de l|de|du|des|d) /, 'what is the meaning of '],
    [/^(?:le sens|la signification) (?:de la|de l|de|du|des|d) /, 'meaning of '],
    [new RegExp(String.raw`^pourquoi ${FEW} est (?:il|elle) (?:appele|appelee|nomme|nommee|qualifie de|decrit comme|dit) `), 'why is $1 called '],
    [/^(?:definis|definissez|definir|traduis|traduisez|traduire) /, 'define '],
    [/^(?:que|qu) (?:nous )?(?:enseigne|revele|montre|dit) (?:ce|cette|le|la) (?:passage|texte|chapitre|verset|psaume|lettre) (?:sur|au sujet de|a propos de|de|du) /, 'what does this passage teach about '],
    [/^qu est ce que (?:ce|cette|le) (?:passage|texte|chapitre|verset|psaume) (?:nous )?(?:enseigne|revele|dit) (?:sur|au sujet de|a propos de|de|du) /, 'what does this passage teach about '],
    [/^qu est ce que (?:cela|ca) (?:nous )?(?:enseigne|revele|dit) (?:sur|au sujet de|de|du) /, 'what does this teach about '],
  ],
};

/** Request verbs at the start of a message ("explique", "muéstrame", "montre-moi") and plural questions ("quais são"). */
const REQUEST_RULES: Record<Foreign, Rule[]> = {
  pt: [
    [/^(?:(?:voce )?(?:pode|poderia) )?(?:me )?(?:explique|explica|explicar|explicaria)(?: me)?(?=[\s?.!]|$)/, 'explain'],
    [/^(?:(?:voce )?(?:pode|poderia) )?(?:me )?(?:mostre|mostra|mostrar)(?: me)?(?=[\s?.!]|$)/, 'show me'],
    [/^(?:me )?(?:liste|lista|listar)(?=\s|$)/, 'list'],
    [/^(?:abra|abre|abrir|leia|ler|vamos (?:ler|abrir|ver)|quero (?:ler|abrir|ver))(?=\s|$)/, 'open'],
    [/^quais (?:sao|seriam) /, 'what are '],
  ],
  es: [
    [/^(?:(?:puedes|podrias|podria) )?(?:explica|explicame|explique|expliqueme|explicar|explicarme)(?=[\s?.!]|$)/, 'explain'],
    [/^(?:(?:puedes|podrias|podria) )?(?:muestrame|muestra|mostrar|mostrarme|muestreme)(?=[\s?.!]|$)/, 'show me'],
    [/^(?:enumera|lista|listar)(?=\s|$)/, 'list'],
    [/^(?:abre|abrir|lee|leer|vamos a (?:leer|abrir|ver)|quiero (?:leer|abrir|ver))(?=\s|$)/, 'open'],
    [/^cuales (?:son|serian) /, 'what are '],
  ],
  fr: [
    [/^(?:(?:peux tu|pouvez vous|pourrais tu|pourriez vous) )?(?:explique|expliquez|expliquer)(?: moi| nous)?(?=[\s?.!]|$)/, 'explain'],
    [/^(?:(?:peux tu|pouvez vous|pourrais tu|pourriez vous) )?(?:montre|montrez|montrer|affiche|affichez|afficher)(?: moi| nous)?(?=[\s?.!]|$)/, 'show me'],
    [/^(?:liste|listez|lister|enumere)(?=\s|$)/, 'list'],
    [/^(?:ouvre|ouvrez|ouvrir|lis|lisez|lire|lisons|allons (?:lire|voir)|je veux (?:lire|voir|ouvrir))(?=\s|$)/, 'open'],
    [/^(?:quels|quelles) sont /, 'what are '],
  ],
};

/** Function words and study nouns (demonstratives, "versículo", "aqui", "por favor") → English. */
const GLOSS_RULES: Record<Foreign, Rule[]> = {
  pt: [
    [/\b(?:esta|essa|aquela) palavra\b/g, 'this word'],
    [/\b(?:este|esse|aquele) termo\b/g, 'this term'],
    [/\b(?:esta|essa) (?:expressao|frase)\b/g, 'this phrase'],
    [/\b(?:neste|nesse|nesta|nessa|nisto|nisso)\b/g, 'in this'],
    [/\b(?:deste|desse|desta|dessa|disto|disso)\b/g, 'of this'],
    [/\b(?:este|esse|esta|essa|isto|isso|aquilo|aquele|aquela)\b/g, 'this'],
    [/\bversiculos\b/g, 'verses'],
    [/\b(?:versiculo|verso)\b/g, 'verse'],
    [/\bpassagens\b/g, 'passages'],
    [/\b(?:passagem|trecho)\b/g, 'passage'],
    [/\bcapitulos\b/g, 'chapters'],
    [/\bcapitulo\b/g, 'chapter'],
    [/\btexto\b/g, 'text'],
    [/\bcontexto\b/g, 'context'],
    [/\blivro\b/g, 'book'],
    [/\bcarta\b/g, 'letter'],
    [/\baqui\b/g, 'here'],
    [/\bpor favor\b/g, 'please'],
    [/\b(?:para|pra) nos\b/g, 'for us'],
    [/\b(?:para|pra) mim\b/g, 'for me'],
    [/\b(?:o )?ultimo verse\b|\b(?:o )?verse final\b/g, 'the last verse'],
    [/\b(?:o )?primeiro verse\b/g, 'the first verse'],
    [/\b(?:o )?proximo verse\b|\b(?:o )?verse seguinte\b/g, 'the next verse'],
    [/\b(?:o )?verse anterior\b/g, 'the previous verse'],
    [/\boutr[oa]s\b/g, 'other'],
    [/\bverses (\d{1,3}) (?:a|ao|ate|e) (\d{1,3})\b/g, 'verses $1 to $2'],
    [/\b(?:em|no) (greek|hebrew|aramaic)(?: original)?\b/g, 'in the $1'],
    [/\bno original\b/g, 'in the original'],
    [/\b(?:no|do|ao|em) verse (\d)/g, 'in verse $1'],
    [/^explain (?:melhor|mais|de novo|novamente|outra vez|mais uma vez|com mais detalhes)(?=[\s?.!]|$)/, 'explain more'],
  ],
  es: [
    [/\b(?:esta|esa|aquella) palabra\b/g, 'this word'],
    [/\b(?:este|ese|aquel) termino\b/g, 'this term'],
    [/\b(?:esta|esa) (?:expresion|frase)\b/g, 'this phrase'],
    [/\ben (?:este|esta|ese|esa|esto|eso)\b/g, 'in this'],
    [/\bde (?:este|esta|ese|esa|esto|eso)\b/g, 'of this'],
    [/\b(?:este|ese|esta|esa|esto|eso|aquel|aquella|aquello)\b/g, 'this'],
    [/\b(?:versiculos|versos)\b/g, 'verses'],
    [/\b(?:versiculo|verso)\b/g, 'verse'],
    [/\bpasajes\b/g, 'passages'],
    [/\bpasaje\b/g, 'passage'],
    [/\bcapitulos\b/g, 'chapters'],
    [/\bcapitulo\b/g, 'chapter'],
    [/\btexto\b/g, 'text'],
    [/\bcontexto\b/g, 'context'],
    [/\blibro\b/g, 'book'],
    [/\bcarta\b/g, 'letter'],
    [/\b(?:aqui|aca)\b/g, 'here'],
    [/\bpor favor\b/g, 'please'],
    [/\bpara nosotros\b/g, 'for us'],
    [/\bpara mi\b/g, 'for me'],
    [/\b(?:el )?ultimo verse\b|\b(?:el )?verse final\b/g, 'the last verse'],
    [/\b(?:el )?primer verse\b/g, 'the first verse'],
    [/\b(?:el )?(?:siguiente|proximo) verse\b|\b(?:el )?verse siguiente\b/g, 'the next verse'],
    [/\b(?:el )?verse anterior\b/g, 'the previous verse'],
    [/\botr[oa]s\b/g, 'other'],
    [/\bverses (\d{1,3}) (?:a|al|hasta|y) (\d{1,3})\b/g, 'verses $1 to $2'],
    [/\ben (?:el )?(greek|hebrew|aramaic)(?: original)?\b/g, 'in the $1'],
    [/\ben el original\b/g, 'in the original'],
    [/\b(?:en el|del|al) verse (\d)/g, 'in verse $1'],
    [/^explain (?:mejor|mas|de nuevo|otra vez|nuevamente|con mas detalle)(?=[\s?.!]|$)/, 'explain more'],
  ],
  fr: [
    [/\bce mot\b/g, 'this word'],
    [/\bce terme\b/g, 'this term'],
    [/\bcette (?:expression|phrase)\b/g, 'this phrase'],
    [/\b(?:dans|en) (?:ce|cet|cette)\b/g, 'in this'],
    [/\b(?:de|d) (?:ce|cet|cette|cela|ceci)\b/g, 'of this'],
    [/(?<!\best )\b(?:ce|cet|cette|ceci|cela|ca)\b(?! que\b| qui\b)/g, 'this'],
    [/\bversets\b/g, 'verses'],
    [/\bverset\b/g, 'verse'],
    [/\bchapitres\b/g, 'chapters'],
    [/\bchapitre\b/g, 'chapter'],
    [/\btexte\b/g, 'text'],
    [/\bcontexte\b/g, 'context'],
    [/\blivre\b/g, 'book'],
    [/\blettre\b/g, 'letter'],
    [/\bici\b/g, 'here'],
    [/\bs il (?:vous|te) plait\b|\bsvp\b|\bstp\b/g, 'please'],
    [/\bpour nous\b/g, 'for us'],
    [/\bpour moi\b/g, 'for me'],
    [/\b(?:le )?dernier verse\b|\b(?:le )?verse final\b/g, 'the last verse'],
    [/\b(?:le )?premier verse\b/g, 'the first verse'],
    [/\b(?:le )?verse suivant\b/g, 'the next verse'],
    [/\b(?:le )?verse precedent\b/g, 'the previous verse'],
    [/\bautres\b/g, 'other'],
    [/\bverses (\d{1,3}) (?:a|au|jusqu a|et) (\d{1,3})\b/g, 'verses $1 to $2'],
    [/\ben (greek|hebrew|aramaic)\b/g, 'in the $1'],
    [/\bdans l original\b|\ben version originale\b/g, 'in the original'],
    [/\b(?:au|dans le|du) verse (\d)/g, 'in verse $1'],
    [/^explain (?:mieux|plus|davantage|encore|a nouveau|de nouveau|plus en detail)(?=[\s?.!]|$)/, 'explain more'],
  ],
};

/** Biblical authors in pt/es/fr → the English key of books.ts `traditionalAuthor`. */
const BIBLICAL_NAMES: Rule[] = [
  [/\b(?:paulo|pablo)\b/g, 'paul'],
  [/\b(?:joao|juan|jean)\b/g, 'john'],
  [/\b(?:pedro|pierre)\b/g, 'peter'],
  [/\b(?:tiago|santiago|jacques)\b/g, 'james'],
  [/\b(?:lucas|luc)\b/g, 'luke'],
  [/\b(?:mateus|mateo|matthieu)\b/g, 'matthew'],
  [/\b(?:marcos|marc)\b/g, 'mark'],
  [/\bdavi\b/g, 'david'],
  [/\b(?:moises|moise)\b/g, 'moses'],
  [/\b(?:salomao|salomon)\b/g, 'solomon'],
  [/\b(?:isaias|esaie)\b/g, 'isaiah'],
  [/\b(?:jeremias|jeremie)\b/g, 'jeremiah'],
  [/\b(?:ezequiel|ezechiel)\b/g, 'ezekiel'],
  [/\b(?:oseias|oseas|osee)\b/g, 'hosea'],
  [/\b(?:josue)\b/g, 'joshua'],
  [/\b(?:esdras)\b/g, 'ezra'],
  [/\b(?:neemias|nehemias|nehemie)\b/g, 'nehemiah'],
  [/\b(?:jonas)\b/g, 'jonah'],
  [/\b(?:miqueias|miqueas|michee)\b/g, 'micah'],
  [/\b(?:malaquias|malachie)\b/g, 'malachi'],
  [/\b(?:zacarias|zacharie)\b/g, 'zechariah'],
  [/\b(?:paulin[oa]s?|paulinien(?:ne)?s?)\b/g, 'pauline'],
  [/\b(?:joanin[oa]s?|johannique)s?\b/g, 'johannine'],
  [/\b(?:petrin[oa]s?|petrinien(?:ne)?s?)\b/g, 'petrine'],
  [/\b(?:lucan[oa]s?|lucanien(?:ne)?s?)\b/g, 'lukan'],
  [/\b(?:davidic[oa]s?|davidique)s?\b/g, 'davidic'],
];

/**
 * Category keywords → the English cue words of the rules below (connect, cross-references,
 * perspectives, history, literature, theology, commentary, key words, speech verbs).
 * Applied to the framed message to build the *cue* form (`ParsedMessage.lower`).
 */
const CUE_RULES: Record<Foreign, Rule[]> = {
  pt: [
    // connect
    [/\bonde (?:this )?se encaixa\b/g, 'where does this fit'],
    [/\bse encaixa (?:com|em|no|na)\b/g, 'fits with'],
    [/\b(?:se )?relaciona(?:m)?\b|\brelacionar\b|\btem a ver com\b/g, 'relates to'],
    [/\brelac(?:ao|oes) (?:(?:disso|disto|desse|deste|dessa|desta|de isso|de isto|de this|of this)(?: (?!com\b|entre\b)\S+)? )?(?:com|entre)\b/g, 'connection between'],
    [/\b(?:se )?(?:conecta(?:m)?|liga(?:m)?)\b|\bconectar\b/g, 'connects'],
    [/\b(?:conexao|conexoes|ligacao|ligacoes|vinculo)\b/g, 'connection'],
    [/\b(?:compara|comparar|comparacao|comparando)\b/g, 'compare'],
    [/\ba luz de\b/g, 'in light of'],
    [/\b(?:difere|diferem|se diferencia|se diferenciam|diferente|diferentes) (?:de|do|da)\b/g, 'differs from'],
    // cross-references
    [/\bonde mais\b|\bonde (?:else )?tambem\b/g, 'where else'],
    [/\bem (?:que )?(?:outros|outras|other) (?:lugares|partes|livros|textos)\b|\bem outro lugar\b/g, 'elsewhere'],
    [/\bdiferenc(?:a|as) entre\b/g, 'comparison between'],
    [/\bprofecias? (?:sobre|a respeito de|acerca de|de|do|da|dos|das)\b/g, 'prophecy about'],
    [/\breferencias cruzadas\b/g, 'cross references'],
    [/\breferencias\b/g, 'references'],
    [/\bpassages (?:semelhantes|parecidas|similares)\b/g, 'similar passages'],
    [/\bpassages relacionadas\b/g, 'related passages'],
    [/\bpassages paralelas\b/g, 'parallel passages'],
    [/\bparalelos\b/g, 'parallels'],
    [/\bparalelo\b/g, 'parallel'],
    [/\b(?:a )?mesma ideia\b/g, 'same idea'],
    [/\b(?:o )?mesmo (?:tema|conceito|ensino)\b/g, 'same theme'],
    [/\bthis ideia\b/g, 'this idea'],
    [/\baparece(?:m)?\b/g, 'appears'],
    [/\bno resto da (?:biblia|escritura)\b/g, 'rest of the bible'],
    [/\bcitad[oa]s?\b/g, 'quoted'],
    [/\bcita(?:m)?\b/g, 'quotes'],
    [/\bcitac(?:ao|oes) (?:de|do|da|dos|das|no|na|em)\b/g, 'quotations from'],
    [/\bcitac(?:ao|oes)\b/g, 'quotations'],
    [/\bsituac(?:ao|oes)\b/g, 'circumstances'],
    [/\balus(?:ao|oes)\b/g, 'allusions'],
    [/\b(?:ecoa(?:m)?|ecos?)\b/g, 'echoes'],
    [/\bcumprimento\b/g, 'fulfillment'],
    [/\b(?:cumpre|cumprid[oa]s?|cumpriu)\b/g, 'fulfilled'],
    [/\bprofecias\b/g, 'prophecies'],
    [/\bprofecia\b/g, 'prophecy'],
    // perspectives
    [/\binterpretac(?:ao|oes)\b/g, 'interpretations'],
    [/\binterpreta(?:m|r|do|da|dos|das)?\b/g, 'interpret'],
    [/\b(?:visoes|opinioes|leituras|posicoes|posicionamentos|tradicoes) diferentes\b|\bdiferentes (?:visoes|opinioes|leituras|posicoes|tradicoes|interpretations)\b/g, 'different views'],
    [/\bpontos? de vista\b|\bperspectivas?\b/g, 'perspectives'],
    [/\b(?:debatid[oa]s?|debates?)\b/g, 'debated'],
    [/\b(?:discorda(?:m)?|divergem|divergencias?)\b/g, 'disagree'],
    [/\b(?:controversi[ao]s?|polemic[ao]s?)\b/g, 'controversy'],
    [/\bdenominac(?:ao|oes)\b/g, 'denominations'],
    [/\bcalvinistas?\b/g, 'calvinists'],
    [/\barminian[oa]s?\b/g, 'arminians'],
    [/\bcatolic[oa]s?\b/g, 'catholics'],
    [/\bortodox[oa]s?\b/g, 'eastern orthodox'],
    [/\bluteran[oa]s?\b/g, 'lutherans'],
    [/\bmetodistas?\b/g, 'methodists'],
    [/\bpentecostais\b|\bpentecostal\b/g, 'pentecostals'],
    [/\breformad[oa]s?\b/g, 'reformed tradition'],
    [/\bos cristaos (?:concordam|discordam)\b/g, 'do christians disagree'],
    // history
    [/\bquem (?:o |a )?escreveu\b/g, 'who wrote'],
    [/\bescrit[oa] por\b/g, 'written by'],
    [/\bautoria\b/g, 'authorship'],
    [/\bautor(?:es)?\b/g, 'author'],
    [/\bquando (?:\S+ ){0,4}?(?:foi|teria sido|e que foi) escrit[oa]\b/g, 'when was this written'],
    [/\bonde (?:\S+ ){0,4}?(?:foi|teria sido|e que foi) escrit[oa]\b/g, 'where was this written'],
    [/\bdata(?:s|do|da|cao)?\b/g, 'date'],
    [/\b(?:leitores|destinatarios|ouvintes) originais\b/g, 'original readers'],
    [/\b(?:publico|audiencia|plateia) original\b/g, 'original audience'],
    [/\bprimeiros (?:leitores|ouvintes|destinatarios|cristaos)\b/g, 'first readers'],
    [/\bleitores\b/g, 'readers'],
    [/\bouvintes\b/g, 'hearers'],
    [/\bdestinatarios\b/g, 'recipients'],
    [/\b(?:publico|audiencia)\b/g, 'audience'],
    [/\bcontexto historico\b/g, 'historical context'],
    [/\bhistoric[oa]s?\b|\bhistoricamente\b/g, 'historical'],
    [/\bhistoria\b/g, 'history'],
    [/\bpano de fundo\b|\bcontexto cultural\b/g, 'background'],
    [/\bcultura(?:l|is)?\b/g, 'culture'],
    [/\bcostumes?\b/g, 'customs'],
    [/\b(?:ambientacao|cenario)\b/g, 'setting'],
    [/\bocasiao\b/g, 'occasion'],
    [/\bcircunstancias?\b/g, 'circumstances'],
    [/\bgeografi(?:a|co|ca)\b/g, 'geography'],
    [/\bimperio romano\b/g, 'roman empire'],
    [/\bmundo romano\b/g, 'roman world'],
    [/\bgreco romano\b/g, 'greco-roman'],
    [/\b(?:judaic[oa]s?|judeus?|judias?|judaismo)\b/g, 'jewish'],
    [/\b(?:na|naquela) epoca\b|\bnaquele tempo\b|\bnaqueles dias\b/g, 'at the time'],
    [/\bprimeiro seculo\b/g, 'first century'],
    [/\bpolitic[oa]s?\b/g, 'politics'],
    [/\beconomi(?:a|co|ca)\b/g, 'economy'],
    [/\bescrav(?:idao|os?|as?)\b/g, 'slavery'],
    [/\b(?:entenderiam|entendiam|entenderam|teriam entendido|compreenderiam|compreendiam)\b/g, 'understood'],
    // literary
    [/\bestrutura(?:d[oa]|l)?\b/g, 'structure'],
    [/\besboco\b/g, 'outline'],
    [/\b(?:quiasmo|quiastic[oa])\b/g, 'chiasm'],
    [/\bparalelismo\b/g, 'parallelism'],
    [/\brepetic(?:ao|oes)\b/g, 'repetition'],
    [/\brepetid[oa]s?\b/g, 'repeated'],
    [/\bmetaforas?\b/g, 'metaphors'],
    [/\b(?:imagens|imageria|figuras de linguagem)\b/g, 'imagery'],
    [/\bpoema\b/g, 'poem'],
    [/\bpoesia\b/g, 'poetry'],
    [/\bpoetic[oa]s?\b/g, 'poetic'],
    [/\bgenero(?: literario)?\b/g, 'genre'],
    [/\bliterari[oa]s?\b/g, 'literary'],
    [/\bargumento\b/g, 'argument'],
    [/\bretoric[ao]s?\b/g, 'rhetoric'],
    [/\bfluxo do (?:argumento|pensamento)\b/g, 'flow of the argument'],
    [/\btransic(?:ao|oes)\b/g, 'transition'],
    [/\bno (?:resto|contexto) do book\b/g, 'context of the book'],
    [/\b(?:panorama|visao geral|quadro geral|quadro maior)\b/g, 'big picture'],
    [/\bcomo (?:this )?(?:esta|e) (?:estruturad[oa]|organizad[oa])\b/g, 'how is this structured'],
    // theology
    [/\bteologi(?:a|co|ca|cos|cas|camente)\b/g, 'theology'],
    [/\bdoutrin(?:a|as|ario|aria)\b/g, 'doctrine'],
    [/\bensina(?:m)? (?:sobre|a respeito de)\b/g, 'teaches about'],
    [/\bcristologi(?:a|co|ca)\b/g, 'christology'],
    [/\bescatologi(?:a|co|ca)\b/g, 'eschatology'],
    [/\bsoteriologi(?:a|co|ca)\b/g, 'soteriology'],
    [/\bexpiacao\b/g, 'atonement'],
    [/\bjustificacao\b/g, 'justification'],
    [/\bsantificacao\b/g, 'sanctification'],
    [/\bglorificacao\b/g, 'glorification'],
    [/\bprovidencia\b/g, 'providence'],
    [/\bsoberania\b/g, 'sovereignty'],
    [/\bencarnacao\b/g, 'incarnation'],
    [/\bnatureza de deus\b/g, 'nature of god'],
    [/\bcarater de deus\b/g, 'character of god'],
    // commentary
    [/\bcomentari(?:o|os)\b/g, 'commentary'],
    [/\bcomentaristas?\b/g, 'commentators'],
    [/\bpais da igreja\b/g, 'church fathers'],
    [/\bteologos\b/g, 'theologians'],
    [/\b(?:estudiosos|eruditos)\b/g, 'scholars'],
    [/\bpregadores?\b/g, 'preachers'],
    [/\bpastores?\b/g, 'pastors'],
    [/\bserm(?:ao|oes)\b/g, 'sermons'],
    [/\b(?:pregou|pregacao|pregar|pregado)\b/g, 'preached'],
    [/\breformadores\b/g, 'reformers'],
    [/\bpuritanos\b/g, 'puritans'],
    [/\bnotas de estudo\b/g, 'study notes'],
    // key words
    [/\b(?:palavras|termos) chave\b|\b(?:palavras|termos) (?:importantes|principais)\b/g, 'key words'],
    [/\b(?:palavras|termos) (greek|hebrew|aramaic)\b/g, '$1 words'],
    [/\bpalavras\b/g, 'words'],
    [/\b(?:palavra|termo)\b/g, 'word'],
    [/\bsignificado\b/g, 'meaning'],
    [/\braiz\b/g, 'root'],
    [/\blexico\b/g, 'lexicon'],
    // testaments
    [/\bantigo testamento\b|\bat\b(?! the time)|\bescrituras hebraicas\b/g, 'old testament'],
    [/\bnovo testamento\b/g, 'new testament'],
    // speech verbs, prepositions
    [/\bfala(?:m)?\b/g, 'talks'],
    [/\bfalou\b/g, 'talked'],
    [/\bdiz(?:em)?\b/g, 'says'],
    [/\bdisse(?:ram)?\b/g, 'said'],
    [/\bescreve(?:m)?\b/g, 'writes'],
    [/\bescreveu\b/g, 'wrote'],
    [/\bmenciona(?:m)?\b/g, 'mentions'],
    [/\bmencionou\b/g, 'mentioned'],
    [/\busa(?:m)?\b/g, 'uses'],
    [/\busou\b/g, 'used'],
    [/\bensina\b/g, 'teaches'],
    [/\bensinou\b/g, 'taught'],
    [/\b(?:trata|aborda)\b/g, 'addresses'],
    [/\bdescreve\b/g, 'describes'],
    [/\bexplica\b/g, 'explains'],
    [/\bdesenvolve\b/g, 'develops'],
    [/\bse refere\b/g, 'refers'],
    [/\bpensa(?:va)?\b/g, 'thinks'],
    [/\bsegundo\b|\bconforme\b|\bde acordo com\b/g, 'according to'],
    [/\b(?:obrigad[oa]|valeu)\b/g, 'thanks'],
    [/\bmais\b/g, 'more'],
    [/\baprofund(?:e|ar|a)\b/g, 'deeper'],
    [/\bcontinu(?:e|ar|a)\b/g, 'continue'],
    [/\bquem\b/g, 'who'],
    [/\bquando\b/g, 'when'],
    [/\bonde\b/g, 'where'],
    [/\bpor ?que\b/g, 'why'],
    [/\bcomo\b/g, 'how'],
    [/\bo que\b/g, 'what'],
    [/\bsobre\b/g, 'about'],
    [/\bcom\b/g, 'with'],
  ],
  es: [
    // connect
    [/\bdonde (?:this )?encaja\b/g, 'where does this fit'],
    [/\bencaja (?:con|en)\b/g, 'fits with'],
    [/\b(?:se )?relaciona(?:n)?\b|\brelacionar\b|\btiene que ver con\b/g, 'relates to'],
    [/\brelaci(?:on|ones) (?:(?:tiene|tienen|guarda|guardan|hay) (?:(?:this|that|esto|eso|este|esta|ese|esa)(?: (?!con\b|entre\b)\S+)? )?)?(?:con|entre)\b/g, 'connection between'],
    [/\b(?:se )?conecta(?:n)?\b|\bconectar\b|\bse vincula\b/g, 'connects'],
    [/\b(?:conexion|conexiones|vinculo|vinculos|enlace)\b/g, 'connection'],
    [/\b(?:compara|comparar|comparacion|comparando)\b/g, 'compare'],
    [/\ba la luz de\b/g, 'in light of'],
    [/\b(?:difiere|difieren|se diferencia|se diferencian|diferente|diferentes) (?:de|del)\b/g, 'differs from'],
    // cross-references
    [/\bdonde mas\b|\bdonde (?:else )?tambien\b/g, 'where else'],
    [/\ben (?:que )?(?:otros|otras|other) (?:lugares|partes|libros|textos)\b|\ben otro lugar\b/g, 'elsewhere'],
    [/\bdiferencias? entre\b/g, 'comparison between'],
    [/\bprofecias? (?:sobre|acerca de|de|del)\b/g, 'prophecy about'],
    [/\breferencias cruzadas\b/g, 'cross references'],
    [/\breferencias\b/g, 'references'],
    [/\bpassages (?:semejantes|parecidos|similares)\b/g, 'similar passages'],
    [/\bpassages relacionados\b/g, 'related passages'],
    [/\bpassages paralelos\b/g, 'parallel passages'],
    [/\bparalelos\b/g, 'parallels'],
    [/\bparalelo\b/g, 'parallel'],
    [/\b(?:la )?misma idea\b/g, 'same idea'],
    [/\b(?:el )?mismo (?:tema|concepto)\b/g, 'same theme'],
    [/\bthis idea\b/g, 'this idea'],
    [/\baparece(?:n)?\b/g, 'appears'],
    [/\ben el resto de la (?:biblia|escritura)\b/g, 'rest of the bible'],
    [/\bcitad[oa]s?\b/g, 'quoted'],
    [/\bcita(?:n)?\b/g, 'quotes'],
    [/\bcitas (?:de|del|en)\b/g, 'quotations from'],
    [/\bcitas\b/g, 'quotations'],
    [/\bsituaci(?:on|ones)\b/g, 'circumstances'],
    [/\balusi(?:on|ones)\b/g, 'allusions'],
    [/\b(?:eco|ecos|resuena)\b/g, 'echoes'],
    [/\bcumplimiento\b/g, 'fulfillment'],
    [/\b(?:cumple|cumplid[oa]s?|cumplio)\b/g, 'fulfilled'],
    [/\bprofecias\b/g, 'prophecies'],
    [/\bprofecia\b/g, 'prophecy'],
    // perspectives
    [/\binterpretaci(?:on|ones)\b/g, 'interpretations'],
    [/\binterpreta(?:n|r|do|da|dos|das)?\b/g, 'interpret'],
    [/\b(?:visiones|opiniones|lecturas|posturas|posiciones|tradiciones) diferentes\b|\bdiferentes (?:visiones|opiniones|lecturas|posturas|posiciones|tradiciones|interpretations)\b/g, 'different views'],
    [/\bpuntos? de vista\b|\bperspectivas?\b/g, 'perspectives'],
    [/\b(?:debatid[oa]s?|debates?)\b/g, 'debated'],
    [/\b(?:discrepa(?:n)?|no estan de acuerdo|desacuerdos?|divergencias?)\b/g, 'disagree'],
    [/\b(?:controversi[ao]s?|polemic[ao]s?)\b/g, 'controversy'],
    [/\bdenominaci(?:on|ones)\b/g, 'denominations'],
    [/\bcalvinistas?\b/g, 'calvinists'],
    [/\barminian[oa]s?\b/g, 'arminians'],
    [/\bcatolic[oa]s?\b/g, 'catholics'],
    [/\bortodox[oa]s?\b/g, 'eastern orthodox'],
    [/\bluteran[oa]s?\b/g, 'lutherans'],
    [/\bmetodistas?\b/g, 'methodists'],
    [/\bpentecostales\b|\bpentecostal\b/g, 'pentecostals'],
    [/\breformad[oa]s?\b/g, 'reformed tradition'],
    // history
    [/\bquien (?:lo |la )?escribio\b/g, 'who wrote'],
    [/\bescrit[oa] por\b/g, 'written by'],
    [/\bautoria\b/g, 'authorship'],
    [/\bautor(?:es)?\b/g, 'author'],
    [/\bcuando (?:\S+ ){0,4}?(?:se escribio|fue escrit[oa])\b/g, 'when was this written'],
    [/\bdonde (?:\S+ ){0,4}?(?:se escribio|fue escrit[oa])\b/g, 'where was this written'],
    [/\bfecha(?:s|do|da|cion)?\b/g, 'date'],
    [/\b(?:lectores|destinatarios|oyentes) originales\b/g, 'original readers'],
    [/\b(?:audiencia|publico) original\b/g, 'original audience'],
    [/\bprimeros (?:lectores|oyentes|destinatarios|cristianos)\b/g, 'first readers'],
    [/\blectores\b/g, 'readers'],
    [/\boyentes\b/g, 'hearers'],
    [/\bdestinatarios\b/g, 'recipients'],
    [/\b(?:audiencia|publico)\b/g, 'audience'],
    [/\bcontexto historico\b/g, 'historical context'],
    [/\bhistoric[oa]s?\b|\bhistoricamente\b/g, 'historical'],
    [/\bhistoria\b/g, 'history'],
    [/\btrasfondo\b|\bcontexto cultural\b/g, 'background'],
    [/\bcultura(?:l|les)?\b/g, 'culture'],
    [/\bcostumbres?\b/g, 'customs'],
    [/\b(?:ambientacion|escenario)\b/g, 'setting'],
    [/\bocasion\b/g, 'occasion'],
    [/\bcircunstancias?\b/g, 'circumstances'],
    [/\bgeografi(?:a|co|ca)\b/g, 'geography'],
    [/\bimperio romano\b/g, 'roman empire'],
    [/\bmundo romano\b/g, 'roman world'],
    [/\bgrecorromano\b|\bgreco romano\b/g, 'greco-roman'],
    [/\b(?:judi[oa]s?|judaic[oa]s?|judaismo)\b/g, 'jewish'],
    [/\ben (?:esa|aquella) epoca\b|\ben aquel (?:entonces|tiempo)\b|\ben aquellos dias\b/g, 'at the time'],
    [/\bprimer siglo\b/g, 'first century'],
    [/\bpolitic[oa]s?\b/g, 'politics'],
    [/\beconomi(?:a|co|ca)\b/g, 'economy'],
    [/\besclav(?:itud|os?|as?)\b/g, 'slavery'],
    [/\b(?:habria entendido|habrian entendido|entenderian|entendian|entendieron|comprendian|habria comprendido)\b/g, 'understood'],
    // literary
    [/\bestructura(?:d[oa]|l)?\b/g, 'structure'],
    [/\bbosquejo\b|\besquema\b/g, 'outline'],
    [/\b(?:quiasmo|quiastic[oa])\b/g, 'chiasm'],
    [/\bparalelismo\b/g, 'parallelism'],
    [/\brepetici(?:on|ones)\b/g, 'repetition'],
    [/\brepetid[oa]s?\b/g, 'repeated'],
    [/\bmetaforas?\b/g, 'metaphors'],
    [/\b(?:imagenes|imagineria|figuras retoricas)\b/g, 'imagery'],
    [/\bpoema\b/g, 'poem'],
    [/\bpoesia\b/g, 'poetry'],
    [/\bpoetic[oa]s?\b/g, 'poetic'],
    [/\bgenero(?: literario)?\b/g, 'genre'],
    [/\bliterari[oa]s?\b/g, 'literary'],
    [/\bargumento\b/g, 'argument'],
    [/\bretoric[ao]s?\b/g, 'rhetoric'],
    [/\bhilo (?:del argumento|argumental)\b/g, 'flow of the argument'],
    [/\btransici(?:on|ones)\b/g, 'transition'],
    [/\ben el (?:resto|contexto) del book\b/g, 'context of the book'],
    [/\b(?:panorama|vision general|cuadro general)\b/g, 'big picture'],
    [/\bcomo (?:this )?esta (?:estructurad[oa]|organizad[oa])\b/g, 'how is this structured'],
    // theology
    [/\bteologi(?:a|co|ca|cos|cas|camente)\b/g, 'theology'],
    [/\bdoctrin(?:a|as|al|ales)\b/g, 'doctrine'],
    [/\bensena(?:n)? (?:sobre|acerca de)\b/g, 'teaches about'],
    [/\bcristologi(?:a|co|ca)\b/g, 'christology'],
    [/\bescatologi(?:a|co|ca)\b/g, 'eschatology'],
    [/\bsoteriologi(?:a|co|ca)\b/g, 'soteriology'],
    [/\bexpiacion\b/g, 'atonement'],
    [/\bjustificacion\b/g, 'justification'],
    [/\bsantificacion\b/g, 'sanctification'],
    [/\bglorificacion\b/g, 'glorification'],
    [/\bprovidencia\b/g, 'providence'],
    [/\bsoberania\b/g, 'sovereignty'],
    [/\bencarnacion\b/g, 'incarnation'],
    [/\bnaturaleza de dios\b/g, 'nature of god'],
    [/\bcaracter de dios\b/g, 'character of god'],
    // commentary
    [/\bcomentari(?:o|os)\b/g, 'commentary'],
    [/\bcomentaristas?\b/g, 'commentators'],
    [/\bpadres de la iglesia\b/g, 'church fathers'],
    [/\bteologos\b/g, 'theologians'],
    [/\b(?:estudiosos|eruditos|especialistas)\b/g, 'scholars'],
    [/\bpredicadores?\b/g, 'preachers'],
    [/\bpastores?\b/g, 'pastors'],
    [/\bsermon(?:es)?\b/g, 'sermons'],
    [/\b(?:predico|predicacion|predicar|predicado)\b/g, 'preached'],
    [/\breformadores\b/g, 'reformers'],
    [/\bpuritanos\b/g, 'puritans'],
    [/\bnotas de estudio\b/g, 'study notes'],
    // key words
    [/\b(?:palabras|terminos) clave\b|\b(?:palabras|terminos) (?:importantes|principales)\b/g, 'key words'],
    [/\b(?:palabras|terminos) (greek|hebrew|aramaic)\b/g, '$1 words'],
    [/\bpalabras\b/g, 'words'],
    [/\b(?:palabra|termino)\b/g, 'word'],
    [/\bsignificado\b/g, 'meaning'],
    [/\braiz\b/g, 'root'],
    [/\blexico\b/g, 'lexicon'],
    // testaments
    [/\bantiguo testamento\b|\bat\b(?! the time)|\bescrituras hebreas\b/g, 'old testament'],
    [/\bnuevo testamento\b/g, 'new testament'],
    // speech verbs, prepositions
    [/\bhabla(?:n)?\b/g, 'talks'],
    [/\bhablo\b/g, 'talked'],
    [/\bdice(?:n)?\b/g, 'says'],
    [/\bdijo\b|\bdijeron\b/g, 'said'],
    [/\bescribe(?:n)?\b/g, 'writes'],
    [/\bescribio\b/g, 'wrote'],
    [/\bmenciona(?:n)?\b/g, 'mentions'],
    [/\bmenciono\b/g, 'mentioned'],
    [/\busa(?:n)?\b|\butiliza(?:n)?\b/g, 'uses'],
    [/\bensena\b/g, 'teaches'],
    [/\benseno\b/g, 'taught'],
    [/\b(?:trata|aborda)\b/g, 'addresses'],
    [/\bdescribe\b/g, 'describes'],
    [/\bexplica\b/g, 'explains'],
    [/\bdesarrolla\b/g, 'develops'],
    [/\bse refiere\b/g, 'refers'],
    [/\bpiensa\b|\bpensaba\b/g, 'thinks'],
    [/\bsegun\b|\bde acuerdo con\b/g, 'according to'],
    [/\bgracias\b/g, 'thanks'],
    [/\bmas\b/g, 'more'],
    [/\bprofundiza(?:r)?\b/g, 'deeper'],
    [/\bcontinu(?:a|ar|e)\b|\bsigue\b/g, 'continue'],
    [/\bquien(?:es)?\b/g, 'who'],
    [/\bcuando\b/g, 'when'],
    [/\bdonde\b/g, 'where'],
    [/\bpor ?que\b/g, 'why'],
    [/\bcomo\b/g, 'how'],
    [/\b(?:lo )?que\b/g, 'what'],
    [/\b(?:sobre|acerca de)\b/g, 'about'],
    [/\bcon\b/g, 'with'],
  ],
  fr: [
    // connect
    [/\bou (?:this )?s insere\b|\bou (?:this )?se situe\b/g, 'where does this fit'],
    [/\bs insere (?:dans|avec)\b/g, 'fits with'],
    [/\b(?:se )?rattache(?:nt)?\b|\bse rapporte(?:nt)? a\b|\ba voir avec\b/g, 'relates to'],
    [/\b(?:lien|liens|rapport|rapports|relation|relations) (?:avec|entre)\b/g, 'connection between'],
    [/\b(?:quel|quels) (?:lien|liens|rapport)\b/g, 'what connection'],
    [/\b(?:relie|relient|se relie|se relient|relier)\b/g, 'connects'],
    [/\b(?:lien|liens|connexion|connexions)\b/g, 'connection'],
    [/\b(?:compare|comparer|comparaison|comparant)\b/g, 'compare'],
    [/\ba la lumiere de\b/g, 'in light of'],
    [/\b(?:differe|different|differente|differents|differentes|se distingue) (?:de|du|des|d)\b/g, 'differs from'],
    // cross-references
    [/\bou (?:d )?autre\b|\bou ailleurs\b|\bou encore\b/g, 'where else'],
    [/(?<!\bd )\bailleurs\b|\bdans d other (?:endroits|passages|textes)\b/g, 'elsewhere'],
    [/\breferences croisees\b|\brenvois\b/g, 'cross references'],
    [/\bdifferences? entre\b/g, 'comparison between'],
    [/\bpropheties? (?:sur|au sujet de|de|du|des|d)\b/g, 'prophecy about'],
    [/\breferences\b/g, 'references'],
    [/\bpassages (?:semblables|similaires|analogues)\b/g, 'similar passages'],
    [/\bpassages (?:lies|apparentes)\b/g, 'related passages'],
    [/\bpassages paralleles\b/g, 'parallel passages'],
    [/\bparalleles\b/g, 'parallels'],
    [/\bparallele\b/g, 'parallel'],
    [/\b(?:la )?meme idee\b/g, 'same idea'],
    [/\b(?:le )?meme (?:theme|concept)\b/g, 'same theme'],
    [/\bthis idee\b/g, 'this idea'],
    [/\bappara(?:it|issent|issait)\b/g, 'appears'],
    [/\bdans le reste de la bible\b/g, 'rest of the bible'],
    [/\bcite(?:e|s|es)?\b/g, 'quoted'],
    [/\bcitations? (?:de|du|des|d|dans)\b/g, 'quotations from'],
    [/\bcitations?\b/g, 'quotations'],
    [/\bsituation\b/g, 'circumstances'],
    [/\ballusions?\b/g, 'allusions'],
    [/\b(?:echo|echos|fait echo)\b/g, 'echoes'],
    [/\baccomplissement\b/g, 'fulfillment'],
    [/\b(?:accompli(?:e|s|es|t)?)\b/g, 'fulfilled'],
    [/\bpropheties\b/g, 'prophecies'],
    [/\bprophetie\b/g, 'prophecy'],
    // perspectives
    // "la position arminienne", "la lecture réformée", "le point de vue catholique"
    [/\b(?:(?:la|le|l) )?(?:position|point de vue|vision|lecture|conception|doctrine|these|perspective|approche|interpretation|theologie) (?:arminienne|reformee|calviniste|catholique|lutherienne|orthodoxe|wesleyenne|methodiste|pentecotiste|charismatique|cessationniste|continuationniste|amillenariste|premillenariste|postmillenariste|dispensationaliste)s?\b/g, '$& perspectives'],
    [/\binterpretations?\b/g, 'interpretations'],
    [/\binterprete(?:nt|r)?\b/g, 'interpret'],
    [/\b(?:visions|opinions|lectures|positions|traditions) differentes\b|\bdifferentes (?:visions|opinions|lectures|positions|traditions|interpretations)\b/g, 'different views'],
    [/\bpoints? de vue\b|\bperspectives?\b/g, 'perspectives'],
    [/\b(?:debattu(?:e|s|es)?|debats?)\b/g, 'debated'],
    [/\b(?:desaccords?|divergences?|divergent|ne sont pas d accord)\b/g, 'disagree'],
    [/\b(?:controverses?|controverse|polemiques?)\b/g, 'controversy'],
    [/\bdenominations?\b|\bconfessions chretiennes\b/g, 'denominations'],
    [/\bcalvinistes?\b/g, 'calvinists'],
    [/\barminiens?\b/g, 'arminians'],
    [/\bcatholiques?\b/g, 'catholics'],
    [/\borthodoxes?\b/g, 'eastern orthodox'],
    [/\blutheriens?\b/g, 'lutherans'],
    [/\bmethodistes?\b/g, 'methodists'],
    [/\bpentecotistes?\b/g, 'pentecostals'],
    [/\breformes\b|\breformees?\b|\b(?:vue|lecture|position|tradition|theologie|perspective) reforme\b/g, 'reformed tradition'],
    // history
    [/\bqui (?:l )?a ecrit\b/g, 'who wrote'],
    [/\becrit(?:e)? par\b/g, 'written by'],
    [/\bpaternite\b/g, 'authorship'],
    [/\bauteurs?\b/g, 'author'],
    [/\bquand (?:\S+ ){0,4}?(?:a t il ete|a t elle ete|a ete|fut) ecrit(?:e)?\b/g, 'when was this written'],
    [/\bou (?:\S+ ){0,4}?(?:a t il ete|a t elle ete|a ete|fut) ecrit(?:e)?\b/g, 'where was this written'],
    [/\bdate(?:s|e)?\b|\bdatation\b/g, 'date'],
    [/\blecteurs (?:originaux|d origine)\b|\bdestinataires (?:originaux|d origine)\b/g, 'original readers'],
    [/\b(?:public|auditoire) (?:original|d origine)\b/g, 'original audience'],
    [/\bpremiers (?:lecteurs|auditeurs|destinataires|chretiens)\b/g, 'first readers'],
    [/\blecteurs\b/g, 'readers'],
    [/\bauditeurs\b/g, 'hearers'],
    [/\bdestinataires\b/g, 'recipients'],
    [/\b(?:auditoire|public)\b/g, 'audience'],
    [/\bcontexte historique\b/g, 'historical context'],
    [/\bhistoriques?\b|\bhistoriquement\b/g, 'historical'],
    [/\bhistoire\b/g, 'history'],
    [/\barriere plan\b|\bcontexte culturel\b/g, 'background'],
    [/\bculture(?:l|lle|ls|lles)?\b/g, 'culture'],
    [/\b(?:coutumes?|usages)\b/g, 'customs'],
    [/\bcadre historique\b/g, 'historical setting'],
    [/\boccasion\b/g, 'occasion'],
    [/\bcirconstances?\b/g, 'circumstances'],
    [/\bgeographi(?:e|que)\b/g, 'geography'],
    [/\bempire romain\b/g, 'roman empire'],
    [/\bmonde romain\b/g, 'roman world'],
    [/\bgreco romain\b/g, 'greco-roman'],
    [/\b(?:juifs?|juives?|judaique|judaisme)\b/g, 'jewish'],
    [/\ba l epoque\b|\ba cette epoque\b|\ben ce temps la\b/g, 'at the time'],
    [/\bpremier siecle\b/g, 'first century'],
    [/\bpolitiques?\b/g, 'politics'],
    [/\beconomi(?:e|que)\b/g, 'economy'],
    [/\besclav(?:age|es?)\b/g, 'slavery'],
    [/\b(?:auraient ils compris|auraient compris|comprenaient|ont compris|aurait compris|l auraient ils compris|compris)\b/g, 'understood'],
    // literary
    [/\bstructure(?:e|s)?\b/g, 'structure'],
    [/\b(?:le )?plan (?:of|du|de la|de l|de) (?:this |the |ce |cette |l )?(?:passage|chapter|chapitre|book|livre|letter|lettre|epitre|psalm|psaume|text|texte|discours|sermon)\b|\bdecoupage\b/g, 'outline'],
    [/\bcomment (?:ce|cette|this|le|la) (?:passage|texte|text|chapitre|chapter|psaume|psalm|lettre|letter) est (?:il|elle) (?:construit|organise|structure)e?\b/g, 'how is this built'],
    [/\ble plan (?:du book|de la letter|du chapter|du passage|de l epitre|de this)\b|\bplan (?:du|de la) (?:book|letter|chapter|passage)\b/g, 'outline'],
    [/\b(?:chiasme|chiastique)\b/g, 'chiasm'],
    [/\bparallelisme\b/g, 'parallelism'],
    [/\brepetitions?\b/g, 'repetition'],
    [/\brepete(?:e|s|es)?\b/g, 'repeated'],
    [/\bmetaphores?\b/g, 'metaphors'],
    [/\b(?:images|imagerie|figures de style)\b/g, 'imagery'],
    [/\bpoeme\b/g, 'poem'],
    [/\bpoesie\b/g, 'poetry'],
    [/\bpoetiques?\b/g, 'poetic'],
    [/\bgenre(?: litteraire)?\b/g, 'genre'],
    [/\blitteraires?\b/g, 'literary'],
    [/\bargumentation\b/g, 'argument'],
    [/\brhetoriques?\b/g, 'rhetoric'],
    [/\bfil (?:de l argument|de la pensee|conducteur)\b/g, 'flow of the argument'],
    [/\bdans le (?:reste|contexte) du book\b/g, 'context of the book'],
    [/\b(?:vue d ensemble|vision d ensemble|grande histoire)\b/g, 'big picture'],
    [/\bcomment (?:this )?est (?:structure|organise)\b/g, 'how is this structured'],
    // theology
    [/\btheologi(?:e|que|ques|quement)\b/g, 'theology'],
    [/\bdoctrin(?:e|es|al|ale)\b/g, 'doctrine'],
    [/\benseigne(?:nt)? (?:sur|au sujet de)\b/g, 'teaches about'],
    [/\bchristologi(?:e|que)\b/g, 'christology'],
    [/\beschatologi(?:e|que)\b/g, 'eschatology'],
    [/\bsoteriologi(?:e|que)\b/g, 'soteriology'],
    [/\bexpiation\b/g, 'atonement'],
    [/\bprovidence\b/g, 'providence'],
    [/\bsouverainete\b/g, 'sovereignty'],
    [/\bnature de dieu\b/g, 'nature of god'],
    [/\bcaractere de dieu\b/g, 'character of god'],
    // commentary
    [/\bcommentaires?\b/g, 'commentary'],
    [/\bcommentateurs?\b/g, 'commentators'],
    [/\bperes de l eglise\b/g, 'church fathers'],
    [/\btheologiens\b/g, 'theologians'],
    [/\b(?:specialistes|erudits|exegetes)\b/g, 'scholars'],
    [/\bpredicateurs?\b/g, 'preachers'],
    [/\bpasteurs?\b/g, 'pastors'],
    [/\bsermons?\b/g, 'sermons'],
    [/\b(?:a preche|predication|precher|preche)\b/g, 'preached'],
    [/\breformateurs\b/g, 'reformers'],
    [/\bpuritains\b/g, 'puritans'],
    [/\bnotes d etude\b/g, 'study notes'],
    // key words
    [/\bmots cles\b|\b(?:mots|termes) (?:importants|principaux|cles)\b/g, 'key words'],
    [/\b(?:mots|termes) (greek|hebrew|aramaic)\b/g, '$1 words'],
    [/\bmots\b/g, 'words'],
    [/\b(?:mot|terme)\b/g, 'word'],
    [/\bsens\b|\bsignification\b/g, 'meaning'],
    [/\bracine\b/g, 'root'],
    [/\blexique\b/g, 'lexicon'],
    // testaments
    [/\bancien testament\b|\bat\b(?! the time)|\becritures hebraiques\b/g, 'old testament'],
    [/\bnouveau testament\b/g, 'new testament'],
    // speech verbs, prepositions
    [/\ben parle(?:nt)?\b|\bparle(?:nt)?\b/g, 'talks'],
    [/\ba parle\b/g, 'talked'],
    [/\bdit\b|\bdisent\b/g, 'says'],
    [/\ba dit\b/g, 'said'],
    [/\becrit\b/g, 'writes'],
    [/\ba ecrit\b/g, 'wrote'],
    [/\bmentionne(?:nt)?\b/g, 'mentions'],
    [/\b(?:utilise|emploie)(?:nt)?\b/g, 'uses'],
    [/\benseigne\b/g, 'teaches'],
    [/\ba enseigne\b/g, 'taught'],
    [/\b(?:traite|aborde)\b/g, 'addresses'],
    [/\bdecrit\b/g, 'describes'],
    [/\bexplique\b/g, 'explains'],
    [/\bdeveloppe\b/g, 'develops'],
    [/\bse refere\b|\bfait reference\b/g, 'refers'],
    [/\bpense\b|\bpensait\b/g, 'thinks'],
    [/\bselon\b|\bd apres\b/g, 'according to'],
    [/\bmerci\b/g, 'thanks'],
    [/\bplus\b|\bdavantage\b/g, 'more'],
    [/\bapprofondi(?:r|s|ssez)\b/g, 'deeper'],
    [/\bcontinue(?:r|z)?\b/g, 'continue'],
    [/\bqui\b/g, 'who'],
    [/\bquand\b/g, 'when'],
    [/\bou\b/g, 'where'],
    [/\bpourquoi\b/g, 'why'],
    [/\bcomment\b/g, 'how'],
    [/\b(?:que|qu|quoi)\b/g, 'what'],
    [/\b(?:sur|au sujet de|a propos de)\b/g, 'about'],
    [/\bavec\b/g, 'with'],
  ],
};

function applyTopicFrames(s: string, lang: Foreign, strong: boolean): string {
  for (const f of TOPIC_FRAMES) {
    if (f.locale !== lang || Boolean(f.strong) !== strong) continue;
    const m = f.re.exec(`${s} `);
    if (m) return `${f.en}${`${s} `.slice(m[0].length)}`.trim();
  }
  return s;
}

/**
 * The English framing of a Portuguese, Spanish or French message: question framing,
 * request verbs and function words rewritten to the English cue phrases of the rules
 * below; the reader's own words (terms, topics, book names) are left as typed (folded).
 * "O que significa condenação neste versículo?" → "what is the meaning of condenacao in this verse?"
 */
export function frameMessage(text: string, lang: Foreign): string {
  let s = foreignBase(text, lang);
  s = applyRules(s, LANGUAGE_NAMES[lang]);
  // "8.28" (French and Spanish usage) → "8:28"
  s = s.replace(/(^|[^\d.:])(\d{1,3})\.(\d{1,3})(?![\d.:])/g, '$1$2:$3');
  s = applyTopicFrames(s, lang, true);
  s = applyRules(s, WORD_RULES[lang]);
  s = applyTopicFrames(s, lang, false);
  s = applyRules(s, REQUEST_RULES[lang]);
  return applyRules(s, GLOSS_RULES[lang]);
}

/** The cue form of a framed pt/es/fr message: category keywords, biblical names and speech verbs glossed to English. */
export function cueForm(framed: string, lang: Foreign): string {
  return applyRules(applyRules(framed, BIBLICAL_NAMES), CUE_RULES[lang]);
}

const FOREIGN_GREETING_RE =
  /^\s*[¡¿]?\s*(ol[aá]|oi+e?|opa|e a[ií]|bom dia|boa tarde|boa noite|gra[cç]a e paz|(?:a )?paz do senhor|muito obrigad[oa]|obrigad[oa](?: mesmo)?|valeu|am[eé][mn]|hola|qu[eé] tal|buen(?:os|as) (?:d[ií]as|tardes|noches)|saludos|(?:muchas|mil) gracias|gracias|te lo agradezco|se (?:lo )?agradece|bendiciones|bonjour|bonsoir|salut(?=\s*[,!.]|\s*$)|coucou|merci(?: beaucoup| bien)?|je vous remercie|gr[aâ]ce et paix|shalom)(?![\p{L}\d])[\s,.!?:;¡¿-]*/iu;

const FOREIGN_HELP_RE = new RegExp(
  `^(?:${[
    // pt
    'ajuda', 'me ajuda', 'socorro', 'o que (?:voce|vc|tu) (?:pode|consegue|sabe|faz)(?: fazer)?', 'o que (?:eu )?(?:posso|devo) (?:perguntar|fazer|pedir)',
    'como (?:isso|isto|voce|o app|o aplicativo|este app|esse app) funciona', 'como funciona', 'como (?:eu )?(?:uso|usar|utilizo|comeco)(?: isso| isto| voce| o emmaus| o app)?',
    'quem e voce', 'o que e voce', 'instrucoes', 'menu',
    // es
    'ayuda', 'ayudame', 'que (?:puedes|sabes|podes) hacer', 'que haces', 'que (?:puedo|debo) (?:preguntar|hacer|pedir)', 'como funciona(?: esto| la app| esta app)?',
    'como (?:te |lo )?(?:uso|usar|utilizo|empiezo)(?: esto| emmaus| la app)?', 'quien eres', 'que eres', 'instrucciones',
    // fr
    'aide', 'aide moi', 'aidez moi', 'que (?:peux|sais) tu faire', 'que pouvez vous faire', 'qu est ce que (?:tu peux|vous pouvez) faire', 'que (?:puis je|dois je) (?:demander|faire)',
    'comment (?:ca|cela|ceci) (?:marche|fonctionne)', 'comment (?:t |vous |l )?utiliser(?: emmaus| cette app| l application)?', 'comment (?:je )?commence', 'qui es tu', 'qui etes vous', 'mode d emploi',
  ].join('|')})[\\s?.!]*$`,
);

const FOREIGN_SOURCES_RE = new RegExp(
  [
    // pt
    '^(?:mostre |mostrar |ver |listar |abrir |abra )?(?:me )?(?:as |suas |todas as )?(?:fontes|bibliografia|obras citadas)\\b',
    '\\bde onde (?:vem|veio|vieram|saiu|sairam|voce tirou|tirou) (?:isso|isto|essa informacao|essas informacoes|esse conteudo|tudo isso)\\b',
    '\\bcomo (?:voce sabe|sabemos|eu sei|se sabe) (?:disso|isso)\\b',
    '\\bquais (?:fontes|obras|livros) (?:voce )?(?:usa|usou|cita|citou|consultou)\\b',
    '\\b(?:isso|isto) e (?:confiavel|verificado|correto|preciso|seguro)\\b',
    '\\b(?:licenca|licenciamento|direitos autorais)\\b',
    // es
    '^(?:muestrame |mostrar |ver |abre )?(?:las |tus |todas las )?(?:fuentes|bibliografia|obras citadas)\\b',
    '\\bde donde (?:viene|vienen|sale|salen|sacaste|salio|proviene) (?:esto|eso|esta informacion|todo esto)\\b',
    '\\bcomo (?:sabes|sabemos|se sabe) (?:esto|eso)\\b',
    '\\bque (?:fuentes|obras|libros) (?:usas|usaste|citas|citaste|consultaste)\\b',
    '\\b(?:esto|eso) es (?:confiable|fiable|verificado|exacto|correcto)\\b',
    '\\b(?:licencia|derechos de autor)\\b',
    // fr
    '^(?:montre moi |montrez moi |voir |afficher |affiche )?(?:les |tes |vos |toutes les )?(?:sources|bibliographie|ouvrages cites)\\b',
    '\\bd ou (?:vient|viennent|provient|proviennent|sort|sortent|tu tiens|tenez vous)\\b',
    '\\bcomment (?:le sais tu|le savez vous|sait on)\\b',
    '\\bquelles (?:sources|oeuvres|livres)\\b',
    '\\b(?:est ce|c est) (?:fiable|verifie|exact)\\b',
    '\\b(?:licence|droits d auteur)\\b',
  ].join('|'),
);

/**
 * Spoken reference forms of pt/es/fr, rewritten in the original text before
 * reference parsing: "Romanos capítulo 8" → "Romanos 8", "Romanos 8, versículo 28"
 * → "Romanos 8:28", "capítulo 8 de Romanos" → "Romanos 8".
 */
function prepareReferences(text: string, locale: Locale): string {
  // articles and prepositions are never book names here ("le chapitre 8", "o capítulo 3")
  const isBook = (w: string) => !/^(?:the|le|la|les|l|o|a|os|as|el|los|las|lo|de|du|do|da|del|des|um|un|una|une|em|en|no|na|au)$/i.test(w.trim()) && Boolean(findBook(w.trim(), locale));
  return text
    .replace(/((?:[1-3]\s*)?\p{L}[\p{L}.]*)\s+(?:cap[ií]tulo|chapitre|chap\.|cap\.)\s+(\d{1,3})/giu, (m, w: string, n: string) => (isBook(w) ? `${w} ${n}` : m))
    .replace(/((?:[1-3]\s*)?\p{L}[\p{L}.]*)\s+(\d{1,3})\s*,?\s+(?:vers[ií]culos?|vers[oí]s?|versets?|v\.|vv\.)\s*(\d{1,3})/giu, (m, w: string, c: string, v: string) =>
      isBook(w) ? `${w} ${c}:${v}` : m,
    )
    .replace(
      /(?:cap[ií]tulo|chapitre)\s+(\d{1,3})\s+(?:de la|de l['’]|de|do|da|dos|das|del|du|des)\s*(?:(?:[ée]p[iî]tre|carta|ep[ií]stola|livre|livro|libro|[ée]vangile|evangelho|evangelio)\s+(?:aux|à|a|aos|às|as|a los|de la|de|du|des|do|da|dos|del|selon|segundo|seg[uú]n)\s+(?:s[aã]o\s+|san\s+|saint\s+)?)?((?:[1-3]\s*)?\p{L}+)/giu,
      (m, n: string, w: string) => (isBook(w) ? `${w} ${n}` : m),
    );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function stripGreeting(text: string): { greeting: boolean; rest: string } {
  const m = GREETING_RE.exec(text) ?? FOREIGN_GREETING_RE.exec(text);
  if (!m) return { greeting: false, rest: text };
  return { greeting: true, rest: text.slice(m[0].length).trim() };
}

/** Forms of a reference span as it may appear in the classifier's text ("Jean 3.16" also as "jean 3:16"). */
function spanForms(span: string): string[] {
  const l = lowerText(span);
  const colon = l.replace(/(\d)\.(\d)/g, '$1:$2');
  return colon === l ? [l] : [l, colon];
}

/** Is the message nothing but the given spans plus filler words? */
function isDominatedBy(lower: string, spans: string[]): boolean {
  let rest = ` ${lower} `;
  for (const s of spans) {
    for (const span of spanForms(s)) if (span) rest = rest.replace(span, ' ');
  }
  return tokenize(rest).filter((t) => !FILLER.has(t) && !/^\d+$/.test(t)).length === 0;
}

function bookNames(book: BookId, locale?: Locale): string[] {
  const info = tryGetBook(book);
  if (!info) return [];
  const names = [info.name.toLowerCase()];
  if (book === 'PSA') names.push('psalm');
  if (book === 'SNG') names.push('song of solomon');
  const locales: NonEnglishLocale[] = locale && locale !== 'en' ? [locale] : ['pt', 'es', 'fr'];
  for (const l of locales) {
    const n = BOOK_NAMES[l][book];
    if (n) names.push(fold(n.name), ...(n.singular ? [fold(n.singular)] : []));
  }
  return Array.from(new Set(names));
}

/** Every book named in a message, in order of discovery ("How does John 1 connect with Genesis?" → JHN, GEN). */
function bookMentions(text: string, locale?: Locale): { book: BookId; index: number }[] {
  const out: { book: BookId; index: number }[] = [];
  let rest = fold(text);
  for (let i = 0; i < 4; i++) {
    const m = findBookMention(rest, locale);
    if (!m || out.some((o) => o.book === m.book)) break;
    out.push(m);
    const names = bookNames(m.book, locale).map((n) => escapeRegExp(fold(n)).replace(/ /g, '\\s+'));
    rest = rest.replace(new RegExp(`(?<![\\p{L}\\d])(?:${names.join('|')})(?![\\p{L}])`, 'giu'), ' ');
  }
  return out;
}

/** Traditional-author keys ("paul", "john", "david") → the value stored in books.ts `traditionalAuthor`. */
const TRADITIONAL_AUTHORS: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const b of BOOKS) {
    const first = b.traditionalAuthor.split(/[\s(]/)[0].toLowerCase();
    if (!first || first === 'anonymous' || first === 'qoheleth') continue;
    if (!map.has(first)) map.set(first, b.traditionalAuthor);
  }
  return map;
})();

const AUTHOR_ADJECTIVES: Record<string, string> = { pauline: 'paul', johannine: 'john', petrine: 'peter', lukan: 'luke', lucan: 'luke', davidic: 'david' };

const AUTHOR_VERBS =
  'talk|talks|talked|say|says|said|write|writes|wrote|speak|speaks|spoke|mention|mentions|mentioned|use|uses|used|teach|teaches|taught|discuss|discusses|address|addresses|develop|develops|deal|deals|describe|describes|explain|explains|refer|refers';

/** A biblical author named as the subject of a cross-reference question ("where else does Paul…"). */
export function detectTraditionalAuthor(lower: string): string | undefined {
  for (const [adj, key] of Object.entries(AUTHOR_ADJECTIVES)) {
    if (new RegExp(`\\b${adj}\\b`).test(lower)) return TRADITIONAL_AUTHORS.get(key);
  }
  for (const [key, value] of TRADITIONAL_AUTHORS) {
    const k = escapeRegExp(key);
    const patterns = [
      new RegExp(`\\b(does|did|do|else|has|would|where|can|could)\\s+(the\\s+apostle\\s+|the\\s+prophet\\s+|king\\s+)?${k}\\b(?!\\s*\\d)`),
      new RegExp(`\\b${k}\\s+(${AUTHOR_VERBS})\\b`),
      new RegExp(`\\b${k}'?s?\\s+(letters|epistles|writings|psalms)\\b`),
      new RegExp(`\\b(the\\s+)?(apostle|prophet)\\s+${k}\\b`),
      new RegExp(`\\b(by|from)\\s+${k}\\b(?!\\s*\\d)`),
      new RegExp(`\\b(${AUTHOR_VERBS})\\s+(the\\s+apostle\\s+|the\\s+prophet\\s+|king\\s+)?${k}\\b(?!\\s*\\d)`),
    ];
    if (patterns.some((re) => re.test(lower))) return value;
  }
  return undefined;
}

const RELATIONSHIP_CUES: [RegExp, RelationshipType][] = [
  [/\b(quot(e|es|ed|ing|ation|ations)|cite[sd]?|citing)\b/, 'quotation'],
  [/\b(prophec(y|ies)|prophes(y|ied)|fulfil+(s|ed|ment|ments)?|predict(s|ed|ion)?)\b/, 'prophecy-fulfillment'],
  [/\bparallel(s|ed)?\b/, 'parallel'],
  [/\b(allu(sion|sions|de|des|ded)|echo(es|ed)?)\b/, 'allusion'],
  [/\b(contrast(s|ed|ing)?|opposite)\b/, 'contrast'],
  [/\bthemat(ic|ically)\b/, 'thematic'],
  [/\bsame concept\b/, 'same-concept'],
  [/\bhistorical (connections?|links?|references?|parallels?)\b/, 'historical'],
];

export function detectRelationships(lower: string): RelationshipType[] {
  const out: RelationshipType[] = [];
  for (const [re, rel] of RELATIONSHIP_CUES) if (re.test(lower) && !out.includes(rel)) out.push(rel);
  return out;
}

function detectLanguage(lower: string): Intent['slots']['language'] {
  if (/\bgreek\b/.test(lower)) return 'greek';
  if (/\bhebrew\b/.test(lower)) return 'hebrew';
  if (/\baramaic\b/.test(lower)) return 'aramaic';
  return undefined;
}

function detectTestament(lower: string): Testament | undefined {
  if (/\b(old testament|hebrew (bible|scriptures)|ot)\b/.test(lower)) return 'OT';
  if (/\b(new testament|nt)\b/.test(lower)) return 'NT';
  return undefined;
}

/** Case-preserving text with accents stripped ("Agustín" → "Agustin"), for capitalisation checks. */
function unaccented(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC');
}

/** A Christian author named with enough confidence to mean "what did X say" (not "be strong", "doubting Thomas"). */
export function detectAuthorMention(text: string, lower: string, env: Pick<ClassifierEnv, 'findAuthor'>): Author | undefined {
  const author = env.findAuthor(text);
  if (!author) return undefined;
  const hay = ` ${normalizePhrase(text)} `;
  const alias = [...(author.aliases ?? []), author.name]
    .map(normalizePhrase)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .find((a) => hay.includes(` ${a} `));
  if (!alias) return author; // matched by a derived surname or a localized alias — the registry was confident
  if (alias.includes(' ')) return author;
  const a = escapeRegExp(alias);
  const capitalised = new RegExp(`\\b${escapeRegExp(alias[0].toUpperCase())}${escapeRegExp(alias.slice(1))}\\b`).test(unaccented(text));
  const speech = 'say|says|said|think|thinks|thought|write|writes|wrote|teach|teaches|taught|preach|preached|preaches|argue|argues|argued';
  const nearSpeech =
    new RegExp(`\\b(did|does|do|would|has|according to|from|by|about|what|how|${speech})\\s+${a}\\b`).test(lower) ||
    new RegExp(`\\b${a}('s|s)?\\s+(${speech}|view|views|take|comment|comments|commentary|sermon|sermons|on)\\b`).test(lower);
  return capitalised || nearSpeech ? author : undefined;
}

/**
 * "Romans 17", "Genesis 51": a real book named with a chapter it does not have.
 * (parseReference rejects these, and they must not silently become the whole book.)
 */
export function findOutOfRangeChapter(text: string, locale?: Locale): { book: string; chapter: number } | undefined {
  const re = /((?:[1-3]\s*)?\p{L}[\p{L}.]*(?:\s+(?:of\s+|de\s+)?\p{L}+){0,2})\s+(\d{1,3})(?![\d:.]\d)/giu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const words = m[1].trim().split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const book = findBook(words.slice(i).join(' '), locale);
      if (!book) continue;
      const chapter = Number(m[2]);
      // single-chapter books read "Jude 3" as a verse; short aliases must be capitalised to count
      if (book.chapters > 1 && chapter > book.chapters && (words[i].length > 3 || /^[\p{Lu}1-3]/u.test(words[i]))) return { book: book.id, chapter };
      break;
    }
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Verse mentions                                                      */
/* ------------------------------------------------------------------ */

interface VerseMention {
  verse?: VerseRef;
  range?: PassageRef;
  last?: boolean;
  /** text that expressed it (for domination checks) */
  span: string;
  /** from a full reference with a book name */
  explicit: boolean;
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30, forty: 40, fifty: 50,
};

/** Chapter that relative verse numbers refer to: the active verse's chapter when it is inside the passage. */
function activeChapter(passage: PassageRef, conversation: ConversationState): number {
  const v = conversation.activeVerse;
  if (v && v.book === passage.book && refIncludesVerse({ ...passage, startVerse: undefined, endVerse: undefined }, v)) return v.chapter;
  return passage.startChapter;
}

function rangeRef(book: BookId, chapter: number, a: number, b: number): PassageRef {
  return { book, startChapter: chapter, startVerse: Math.min(a, b), endChapter: chapter, endVerse: Math.max(a, b) };
}

function findVerseMention(lower: string, study: Study | null, conversation: ConversationState, explicit: FoundReference[]): VerseMention | undefined {
  for (const f of explicit) {
    if (f.ref.startVerse != null) {
      return {
        verse: { book: f.ref.book, chapter: f.ref.startChapter, verse: f.ref.startVerse },
        range: f.ref,
        span: f.match,
        explicit: true,
      };
    }
  }
  let rest = lower;
  for (const f of explicit) for (const span of spanForms(f.match)) rest = rest.replace(span, ' ');

  const active = conversation.activeVerse;
  if (/\b(this|that|the same) verse\b/.test(rest) && active) {
    return { verse: active, span: 'this verse', explicit: false };
  }
  const passage = study?.passage;
  if (!passage) return undefined;
  const book = passage.book;
  const chapter = activeChapter(passage, conversation);

  let m = /\b(?:verses|vv\.?|vss?\.?)\s*(\d{1,3})\s*(?:-|to|through|thru|and|&)\s*(\d{1,3})\b/.exec(rest);
  if (m) {
    const range = rangeRef(book, chapter, Number(m[1]), Number(m[2]));
    return { verse: { book, chapter, verse: range.startVerse! }, range, span: m[0], explicit: false };
  }
  m = /(?:^|[^\w:.])(\d{1,3}):(\d{1,3})(?:\s*-\s*(\d{1,3}))?(?![\w:])/.exec(rest);
  if (m) {
    const c = Number(m[1]);
    const v = Number(m[2]);
    const range = m[3] ? rangeRef(book, c, v, Number(m[3])) : undefined;
    return { verse: { book, chapter: c, verse: v }, ...(range ? { range } : {}), span: m[0], explicit: false };
  }
  m = /\b(?:verse|ver\.?|vs\.?|v\.?)\s*(\d{1,3})\b/.exec(rest);
  if (m) return { verse: { book, chapter, verse: Number(m[1]) }, span: m[0], explicit: false };
  m = new RegExp(`\\bverse\\s+(${Object.keys(NUMBER_WORDS).join('|')})\\b`).exec(rest);
  if (m) return { verse: { book, chapter, verse: NUMBER_WORDS[m[1]] }, span: m[0], explicit: false };

  if (/\b(the )?(last|final) verse\b/.test(rest)) {
    const endChapter = passage.endChapter ?? passage.startChapter;
    if (passage.endVerse != null) return { verse: { book, chapter: endChapter, verse: passage.endVerse }, span: 'last verse', explicit: false };
    return { last: true, span: 'last verse', explicit: false };
  }
  if (/\b(the )?(first|opening) verse\b/.test(rest)) {
    return { verse: { book, chapter: passage.startChapter, verse: passage.startVerse ?? 1 }, span: 'first verse', explicit: false };
  }
  if (active && active.book === book) {
    if (/\b(the )?next verse\b/.test(rest)) return { verse: { ...active, verse: active.verse + 1 }, span: 'next verse', explicit: false };
    if (/\b(the )?(previous|prior|preceding) verse\b|\bverse before\b/.test(rest) && active.verse > 1) {
      return { verse: { ...active, verse: active.verse - 1 }, span: 'previous verse', explicit: false };
    }
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Word-study term extraction                                          */
/* ------------------------------------------------------------------ */

const WORD_PATTERNS: RegExp[] = [
  /\bwhy\s+(?:is|was|are|were)\s+(?:\S+\s+){1,3}?(?:called|named|described\s+as|referred\s+to\s+as)\s+(.+)$/,
  /\b(?:greek|hebrew|aramaic|original(?: language)?)\s+(?:word|term|root|lemma|noun|verb)s?\s+(?:behind|for|translated(?: as)?|underlying|used for|beneath|rendered(?: as)?|in)\s+(.+)$/,
  /\bwhat\s+(?:greek|hebrew|aramaic)\s+(?:word|term)\s+(?:is|was|lies)\s+(?:used\s+(?:for|in|here\s+for)\s+|behind\s+|translated\s+(?:as\s+)?)?(.+)$/,
  /\bwhat\s+(?:does|did|do|is)\s+(?:\S+\s+){0,3}?mean(?:s|t)?\s+by\s+(.+)$/,
  /\bwhat\s+(?:does|did)\s+it\s+mean\s+(?:to\s+(?:be\s+)?|that\s+)(.+)$/,
  /\b(?:what\s+is|what's|whats)\s+(?:the\s+)?(?:meaning|definition|sense|significance)\s+of\s+(.+)$/,
  /\bwhat\s+(?:does|do|did)\s+(?:the\s+word\s+|the\s+term\s+|the\s+phrase\s+)?(.+?)\s+(?:mean|means|signify|signifies|refer to|imply|denote)\b(.*)$/,
  /\b(?:meaning|definition|etymology|significance)\s+of\s+(?:the\s+(?:word|term|phrase)\s+)?(.+)$/,
  /^(?:please\s+)?(?:define|translate|parse)\s+(.+)$/,
  /\bword\s+study\s+(?:on|of|for)\s+(.+)$/,
  /\b(?:what|how)\s+is\s+(.+?)\s+(?:translated|rendered)\b/,
  /^(?:what\s+is\s+|what's\s+)?(.+?)\s+in\s+(?:the\s+)?(?:greek|hebrew|aramaic|original(?:\s+language)?)$/,
  /\bthe\s+(?:greek|hebrew|aramaic)\s+(?:for|of|behind)\s+(.+)$/,
  /\btell\s+me\s+(?:more\s+)?about\s+the\s+(?:word|term|phrase)\s+(.+)$/,
  /\bthe\s+(?:word|term)\s+(["'][^"']+["'])/,
];

interface TermExtraction {
  term: string;
  /** "in this verse" / "here" */
  inThisVerse: boolean;
}

// Trailing phrases of pt/es/fr questions that are not part of the term (after framing).
const FOREIGN_TRAILING: RegExp[] = [
  /\s+(?:para|pra|segundo|en|pour|selon|chez|segun|according to)\s+(?:paulo|pablo|paul|joao|juan|jean|john|os leitores|los lectores|les lecteurs|o autor|el autor|l auteur|nos|nosotros|nous|mim|mi|moi|us|me)$/,
  /\s+(?:quando|cuando|lorsque|quand)\s+(?:ele|ela|el|ella|il|elle|paulo|pablo|paul|joao|juan|jean|jesus|davi|david)\s+.+$/,
  /\s+(?:de verdade|exatamente|realmente|precisamente|exactamente|vraiment|exactement|precisement|au juste)$/,
  /\s+(?:em|no|na|en|dans|de)\s+(?:o |a |el |la |le |l )?(?:context|text|passage|chapter|book|letter|original)$/,
  /\s+(?:na|en la|dans la)\s+(?:biblia|bible)$/,
];

/** Leading article, "the word"/"a palavra"/"le mot" or "the concept of" of a pt/es/fr term. */
const FOREIGN_TERM_PREFIX =
  /^(?:(?:o|a|os|as|el|la|los|las|le|les|l|un|una|une|um|uma)\s+)?(?:(?:palavra|termo|expressao|palabra|termino|expresion|mot|terme|expression|conceito|concepto|concept|ideia|idea|idee|nocao|nocion|notion)\s+(?:de\s+|da\s+|do\s+|del\s+|du\s+|d\s+)?)?(?:(?:o|a|os|as|el|la|los|las|lo|le|les|l|un|una|une|um|uma)\s+)?/;

function cleanTerm(raw: string, foreign = false): TermExtraction {
  let t = raw.trim().replace(/[?!.,;:]+$/g, '').trim();
  let inThisVerse = false;
  if (/\b(this|that) verse\b/.test(t)) inThisVerse = true;
  // A quoted word is the term: 'the Greek word for "forgive" mean' → forgive
  const quoted = /"([^"]{1,40})"|(?:^|\s)'([^']{1,40})'(?=\s|$)/.exec(t);
  if (quoted) {
    let q = (quoted[1] ?? quoted[2]).trim().replace(/^(?:the|a|an)\s+/, '');
    if (foreign) q = q.replace(FOREIGN_TERM_PREFIX, '').trim() || q;
    return { term: q, inThisVerse };
  }
  const trailing: RegExp[] = [
    /\s+in\s+(?:this|that|the)\s+(?:verse|passage|chapter|text|context|book|letter|psalm|sentence)$/,
    /\s+(?:in|of|from)\s+(?:verse|v\.?)\s*\d+.*$/,
    /\s+in\s+(?:the\s+)?(?:greek|hebrew|aramaic|original).*$/,
    /\s+(?:in|of|from)\s+(?:[1-3]\s?)?[a-z]+\s+\d+(?::\d+)?.*$/,
    /\s+(?:here|there|exactly|really|precisely|actually|again|in context|in this context)$/,
    /\s+(?:to|for)\s+(?:us|me|paul|john|david|christians|believers|the (?:readers|audience|author|psalmist))$/,
    /\s+(?:when|as)\s+(?:he|she|it|they|paul|john|david|jesus)\s+.+$/,
    /\s+(?:mean|means|meant|signify|signifies|refer to|imply|denote)$/,
  ];
  if (foreign) trailing.push(...FOREIGN_TRAILING);
  let changed = true;
  while (changed) {
    changed = false;
    for (const re of trailing) {
      const m = re.exec(t);
      if (m) {
        if (/\b(this|that) verse\b/.test(m[0])) inThisVerse = true;
        t = t.slice(0, m.index).trim();
        changed = true;
      }
    }
  }
  t = t
    .replace(/^(?:the\s+)?(?:greek\s+|hebrew\s+|aramaic\s+)?(?:word|term|phrase|expression|concept of|idea of)\s+/, '')
    .replace(/^["'](.+)["']$/, '$1')
    .replace(/["']/g, '')
    .replace(/^(?:the|a|an)\s+/, '')
    .trim();
  if (foreign && !VAGUE_TERMS.has(t)) {
    const stripped = t.replace(FOREIGN_TERM_PREFIX, '').trim();
    if (stripped) t = stripped;
  }
  return { term: t, inThisVerse };
}

function extractTerm(lower: string, foreign = false): TermExtraction | undefined {
  for (const re of WORD_PATTERNS) {
    const m = re.exec(lower);
    if (!m) continue;
    const extraction = cleanTerm(m[1], foreign);
    if (m[2] && /\b(this|that) verse\b/.test(m[2])) extraction.inThisVerse = true;
    if (extraction.term) return extraction;
  }
  return undefined;
}

/** Resolve "this word", "it"… to the active key word or concept. */
function termFromConversation(study: Study | null, conversation: ConversationState): string | undefined {
  if (!study) return undefined;
  if (conversation.activeWordId) {
    const kw = study.keyWords.find((k) => k.id === conversation.activeWordId);
    if (kw) return kw.english;
  }
  if (conversation.activeConceptId) {
    const c = study.concepts.find((k) => k.id === conversation.activeConceptId);
    if (c) return c.label;
  }
  return undefined;
}

/** Does a term match a concept alias or a key word of the study (English, transliteration, lemma, Strong's)? */
export function studyKnowsTerm(study: Study | null, term: string, min = 0.9): boolean {
  if (!study || !term) return false;
  for (const c of study.concepts) if (bestPhraseScore(term, [c.label, ...c.aliases]) >= min) return true;
  for (const k of study.keyWords) {
    if (bestPhraseScore(term, [k.english, k.transliteration, k.lemma]) >= min) return true;
    if (k.strong.toLowerCase() === term.trim().toLowerCase()) return true;
  }
  return false;
}

// Words of a cross-reference question that name the request, the Bible or God in general, never its subject.
const XREF_NOISE = new Set(
  (
    'where else elsewhere bible scripture scriptures other passages passage verses verse places place texts text call calls called calling ' +
    'describe describes described talk talks talked speak speaks spoke mention mentions mentioned appear appears appeared idea ideas theme ' +
    'concept show find list similar related parallel parallels cross reference references ref refs xref xrefs same teach teaches taught use uses ' +
    'used word words god lord jesus christ testament new old book books letters letter writings picture image imagery pick picked ' +
    // pt / es / fr (folded)
    'onde donde ou ailleurs outros outras otros otras autres biblia bible escritura escrituras ecriture ecritures passagem passagens pasaje pasajes ' +
    'versiculo versiculos verset versets texto textos texte textes fala falam falou habla hablan hablo parle parlent aparece aparecem aparecen apparait ' +
    'ideia idea idee tema theme conceito concepto concept mostre muestra montre mesma mesmo misma mismo meme deus dios dieu senhor senor seigneur ' +
    'cristo christ novo nuevo nouveau antigo antiguo ancien testamento livro libro livre cartas carta lettres lettre semelhantes similares semejantes ' +
    'parecidas parecidos similaires relacionadas relacionados paralelas paralelos paralleles referencias references cruzadas croisees diz dice dit ' +
    'usa usam utiliza utilise chama llama appelle descreve describe decrit menciona mentionne escreve escribe ecrit'
  ).split(/\s+/),
);

/**
 * The subject of a cross-reference question, when the study knows it ("Where
 * else does the Bible call God a *shepherd*?"): the longest run of its content
 * words that is a concept alias, a key word or a cross-reference tag.
 */
function xrefTerm(lower: string, study: Study | null): string | undefined {
  if (!study) return undefined;
  const toks = contentTokens(lower).filter((t) => !XREF_NOISE.has(t) && !/^\d+$/.test(t) && !TRADITIONAL_AUTHORS.has(t));
  const known = (phrase: string) =>
    studyKnowsTerm(study, phrase) || study.crossReferences.some((x) => x.tags.some((tag) => phraseScore(phrase, tag) >= 0.9));
  for (let n = Math.min(3, toks.length); n >= 1; n--) {
    for (let i = 0; i + n <= toks.length; i++) {
      const phrase = toks.slice(i, i + n).join(' ');
      if (known(phrase)) return phrase;
    }
  }
  return undefined;
}

/** A bare term: a few content words, no request verbs ("Grace", "The Kingdom of God", "life in the Spirit"). */
function isBareTerm(lower: string): boolean {
  if (/\d/.test(lower)) return false;
  const toks = tokenize(lower);
  if (toks.length === 0 || toks.length > 5) return false;
  return toks.every((t) => TERM_FUNCTION_WORDS.has(t) || !STOPWORDS.has(t));
}

/* ------------------------------------------------------------------ */
/* Classifier                                                          */
/* ------------------------------------------------------------------ */

/**
 * Classify a chat message into an Intent with slots, plus parse details.
 * Pure and synchronous; "the last verse" of an open-ended chapter is flagged
 * (`lastVerse`) for the engine to resolve against the verse count.
 *
 * Messages are understood in English, Portuguese, Spanish and French whatever
 * `env.locale` is; `term` and `topic` slots keep the reader's spelling
 * ("condenação", "riqueza"), matched accent-insensitively downstream.
 */
export function classifyMessage(message: string, env: ClassifierEnv): ParsedMessage {
  const { study, conversation } = env;
  const original = message.trim();
  const g = stripGreeting(original);
  const lang = detectLocale(original, env.locale ?? 'en');
  const foreign: Foreign | undefined = lang === 'en' ? undefined : lang;
  // Book names are read in the message's language first, then the reader's, then any language.
  const refLocale: Locale | undefined = foreign ?? env.locale;
  const text = foreign ? prepareReferences(g.rest, foreign) : g.rest;
  // `lower`: the English-framed form (question framing and function words); `cues`: category keywords glossed too.
  const lower = foreign ? frameMessage(text, foreign) : lowerText(text);
  const cues = foreign ? cueForm(lower, foreign) : lower;
  const explicit = findReferences(text, { locale: refLocale });
  // A named passage ("I want to understand the Sermon on the Mount") counts as a reference — unless the open
  // study already knows the phrase as one of its own ideas, or it names a topic in the index.
  let namedPassage: string | undefined;
  if (!explicit.length) {
    const named = findNamedPassage(text);
    if (named && !studyKnowsTerm(study, named.match) && !env.isKnownTopic?.(normalizeTopicQuery(named.match) || named.match)) {
      explicit.push({ ref: named.ref, match: named.match, index: named.index });
      namedPassage = named.name;
    }
  }
  const parsed: ParsedMessage = {
    intent: { kind: 'unknown', confidence: 0.2, slots: {} },
    text: original,
    lower: cues,
    references: explicit.map((f) => f.ref),
    relationships: [],
    refersToContext: CONTEXT_REF_RE.test(cues),
    locale: env.locale ?? lang,
    messageLocale: lang,
    ...(namedPassage ? { namedPassage } : {}),
  };
  const done = (kind: IntentKind, confidence: number, slots: Intent['slots'] = {}): ParsedMessage => {
    // terms and topics in the reader's own spelling ("condenacao" → "condenação")
    const s = { ...slots };
    if (s.term && !parsed.termFromContext) s.term = restoreSpelling(s.term, text);
    if (s.topic) s.topic = restoreSpelling(s.topic, text);
    parsed.intent = { kind, confidence, slots: s };
    return parsed;
  };
  const language = detectLanguage(cues);
  const langSlot = language ? { language } : {};
  const parseRef = (s: string) => parseReference(s, { locale: refLocale });

  // 0–1. Greetings, help, sources
  if (!lower || /^[\s?.!]*$/.test(lower)) return g.greeting ? done('greeting', 0.95) : done('help', 0.6);
  if (HELP_RE.test(lower) || HELP_ANY_RE.test(lower)) return done('help', 0.9);
  if (foreign && FOREIGN_HELP_RE.test(foreignBase(text, foreign))) return done('help', 0.9);
  if (SOURCES_RE.test(cues) || (foreign && FOREIGN_SOURCES_RE.test(foreignBase(text, foreign)))) return done('sources', 0.85);

  // 2. Explicit topic phrasing ("what does the Bible say about wealth?", "why does God allow suffering?")
  const strongTopic = STRONG_TOPIC_RE.exec(lower);
  if (strongTopic) {
    const topic = normalizeTopicQuery(lower);
    const object = strongTopic[1].replace(/[?!.]+$/, '').trim();
    if (/^(this|that|it|these|those|this (idea|theme|passage|verse|teaching))$/.test(object) && study) {
      parsed.refersToContext = true;
      return done('cross-references', 0.7);
    }
    const asRef = parseRef(object);
    if (asRef) return done('open-passage', 0.85, { passage: asRef });
    if (topic) {
      parsed.explicitTopic = true;
      return done('open-topic', 0.9, { topic });
    }
  }

  // 3. A message dominated by a reference → open it (or explain it, when it lies inside the current study)
  const whole = parseRef(text);
  const dominant = whole ?? (explicit.length && isDominatedBy(lower, explicit.map((f) => f.match)) ? explicit[0].ref : null);
  if (dominant) {
    if (study?.passage && dominant.startVerse != null && refContains(study.passage, dominant)) {
      const verse = { book: dominant.book, chapter: dominant.startChapter, verse: dominant.startVerse };
      return done('explain-verse', 0.9, { verse, passage: dominant });
    }
    return done('open-passage', 0.95, { passage: dominant });
  }
  const missing = findOutOfRangeChapter(text, refLocale);
  if (missing) return done('open-passage', 0.9, { invalidChapter: missing });
  const mention = findBookMention(text, refLocale);
  if (mention && isDominatedBy(lower, bookNames(mention.book, refLocale))) {
    return done('open-passage', 0.85, { passage: wholeBook(mention.book) });
  }

  // 4. Connect ("how does this connect with Romans?") — never switches study
  if (study && (CONNECT_RE.test(cues) || (DIFFER_RE.test(cues) && (explicit.length > 0 || mention)))) {
    parsed.relationships = detectRelationships(cues);
    const target = explicit.find((f) => !(study.passage && refContains(study.passage, f.ref)))?.ref;
    if (target) {
      parsed.connect = { book: target.book, ref: target };
      return done('connect', 0.9, { passage: target, bookFilter: target.book });
    }
    // "How does John 1 connect with Genesis?": the study's own book names the study; the other book is the target.
    const mentions = bookMentions(text, refLocale);
    const other = mentions.find((m) => m.book !== study.passage?.book) ?? mentions[0];
    if (other) {
      parsed.connect = { book: other.book };
      return done('connect', 0.85, { bookFilter: other.book });
    }
    const testament = detectTestament(cues);
    if (testament) {
      parsed.connect = { testament };
      return done('connect', 0.75);
    }
    const traditionalAuthor = detectTraditionalAuthor(cues);
    return done('cross-references', 0.6, traditionalAuthor ? { traditionalAuthor } : {});
  }

  const verseMention = findVerseMention(lower, study, conversation, explicit);
  if (verseMention?.last) parsed.lastVerse = true;
  // With no study open, a book named in a question ("Who wrote Romans?") is the passage it is about.
  const bookContext = !study && !explicit.length && mention ? wholeBook(mention.book) : undefined;
  if (bookContext) parsed.references = [bookContext];
  const verseSlots: Intent['slots'] = verseMention
    ? { ...(verseMention.verse ? { verse: verseMention.verse } : {}), ...(verseMention.range ? { passage: verseMention.range } : {}) }
    : explicit[0]
      ? { passage: explicit[0].ref }
      : bookContext
        ? { passage: bookContext }
        : {};

  // 5. A named Christian author → commentary
  const author = detectAuthorMention(text, cues, env);
  if (author) return done('commentary', 0.9, { authorId: author.id, authorName: author.name, ...verseSlots });

  const hasContext = Boolean(study) || explicit.length > 0 || Boolean(bookContext);
  const bare = isBareTerm(lower);

  // 6. Perspectives
  if (hasContext && !bare && PERSPECTIVES_RE.test(cues)) return done('perspectives', 0.85, { ...verseSlots });

  // 7. Cross-references
  if (hasContext && !bare && XREF_RE.test(cues)) {
    parsed.relationships = detectRelationships(cues);
    const traditionalAuthor = detectTraditionalAuthor(cues);
    let bookFilter: string | undefined;
    const inBook = foreign
      ? /\b(?:in|from|within|across|em|no|na|nos|nas|de|do|da|en|el|del|dans|du|des|chez)\s+(?:the\s+|o\s+|a\s+|os\s+|as\s+|el\s+|los\s+|las\s+|le\s+|la\s+|les\s+|l\s+)?(?:book\s+of\s+)?((?:[1-3]\s?)?[a-z]+(?:\s+(?:of|de|des|dos|los)\s+[a-z]+)?)\b/g
      : /\b(?:in|from|within|across)\s+(?:the\s+)?(?:book\s+of\s+)?([1-3]?\s?[a-z]+(?:\s+of\s+[a-z]+)?)\b/g;
    for (const m of lower.matchAll(inBook)) {
      const b = findBookMention(` ${m[1]} `, refLocale);
      if (b && !(traditionalAuthor && bookNames(b.book, refLocale).some((n) => traditionalAuthor.toLowerCase().startsWith(n)))) {
        bookFilter = b.book;
        break;
      }
    }
    const term = xrefTerm(lower, study);
    return done('cross-references', 0.85, {
      ...verseSlots,
      ...(traditionalAuthor ? { traditionalAuthor } : {}),
      ...(bookFilter ? { bookFilter } : {}),
      ...(term ? { term } : {}),
    });
  }

  // 8. Word study
  if (KEYWORDS_RE.test(cues)) {
    parsed.wantsKeyWords = true;
    return done('word-study', 0.8, { ...verseSlots, ...langSlot });
  }
  const extraction = extractTerm(lower, Boolean(foreign));
  if (extraction) {
    const verseTerm = /^(?:verse|v\.?|vv\.?|verses)\s*\d+/.test(extraction.term) || /^\d{1,3}:\d{1,3}/.test(extraction.term);
    if (verseTerm && (verseMention?.verse || verseMention?.last)) return done('explain-verse', 0.9, verseSlots);
    // "What does John 3:16 mean?" — the "term" is a reference
    if (/\d/.test(extraction.term) && explicit.length) {
      if (verseMention?.verse) return done('explain-verse', 0.85, verseSlots);
      return done('open-passage', 0.7, { passage: explicit[0].ref });
    }
    const slots: Intent['slots'] = { ...verseSlots, ...langSlot };
    if (extraction.inThisVerse && conversation.activeVerse && !slots.verse) slots.verse = conversation.activeVerse;
    if (VAGUE_TERMS.has(extraction.term)) {
      const fromContext = termFromConversation(study, conversation);
      if (fromContext && /word|term|phrase|^(this|that|it)$/.test(extraction.term)) {
        parsed.termFromContext = true;
        return done('word-study', 0.7, { ...slots, term: fromContext });
      }
      if (slots.verse || conversation.activeVerse) return done('explain-verse', 0.7, { ...slots, verse: slots.verse ?? conversation.activeVerse });
      if (fromContext) {
        parsed.termFromContext = true;
        return done('word-study', 0.6, { ...slots, term: fromContext });
      }
      if (study) return done('unknown', 0.3, slots);
    } else {
      return done('word-study', 0.9, { ...slots, term: extraction.term });
    }
  }
  if (language && hasContext && /\b(word|words|term|terms|mean|meaning|lexicon|lemma|root)\b/.test(cues)) {
    const fromContext = termFromConversation(study, conversation);
    if (fromContext) parsed.termFromContext = true;
    return done('word-study', 0.65, { ...verseSlots, ...langSlot, ...(fromContext ? { term: fromContext } : {}) });
  }

  // 9. Historical, literary, theological questions
  if (hasContext && !bare) {
    if (HISTORICAL_RE.test(cues)) return done('historical-context', 0.8, verseSlots);
    if (LITERARY_RE.test(cues)) return done('literary-context', 0.8, verseSlots);
    if (THEOLOGY_RE.test(cues)) {
      const m = /\babout\s+(?:the\s+)?(.+)$/.exec(lower);
      const term = m ? cleanTerm(m[1], Boolean(foreign)).term : undefined;
      return done('theology', 0.75, { ...verseSlots, ...(term && !VAGUE_TERMS.has(term) ? { term } : {}) });
    }
    if (COMMENTARY_RE.test(cues)) return done('commentary', 0.75, verseSlots);
  }

  // 10. Verse mentions ("explain verse 12", "8:28", "the last verse"); bare "explain this"
  if (verseMention && (verseMention.verse || verseMention.last)) return done('explain-verse', 0.85, verseSlots);
  if (study?.passage && /^(please )?(explain|unpack)( (this|that|it|this verse|that verse|the verse|more|it more))?( please)?[.!?]*$/.test(lower)) {
    const p = study.passage;
    return done('explain-verse', 0.6, { verse: conversation.activeVerse ?? { book: p.book, chapter: p.startChapter, verse: p.startVerse ?? 1 } });
  }

  // 11. Topics and bare terms
  const weak = WEAK_TOPIC_RE.exec(lower);
  if (weak || bare) {
    const topic = normalizeTopicQuery(lower);
    if (topic) {
      if (!study) return done('open-topic', weak ? 0.8 : 0.75, { topic });
      if (studyKnowsTerm(study, topic)) return done('word-study', 0.75, { term: topic });
      if (env.isKnownTopic?.(topic)) return done('open-topic', 0.75, { topic });
      // "Tell me about X", "study X" ask for a topic; "what is X" (or a bare word) is a question about a word.
      if (weak && !/^(what is|what's|what are|who is)\b/.test(lower)) return done('open-topic', 0.6, { topic });
      if (tokenize(topic).length <= 3) return done('word-study', 0.5, { term: topic });
    }
  }

  // 12. Fallbacks
  if (explicit.length) {
    const ref = explicit[0].ref;
    if (study?.passage && refContains(study.passage, ref)) {
      return ref.startVerse != null ? done('explain-verse', 0.6, { verse: { book: ref.book, chapter: ref.startChapter, verse: ref.startVerse }, passage: ref }) : done('unknown', 0.3, { passage: ref });
    }
    return done('open-passage', 0.6, { passage: ref });
  }
  if (!study) {
    if (g.greeting) return done('greeting', 0.8);
    const topic = normalizeTopicQuery(lower);
    if (topic && tokenize(topic).length <= 6) return done('open-topic', 0.5, { topic });
    return done('unknown', 0.2);
  }
  if (g.greeting) return done('greeting', 0.7);
  return done('unknown', 0.2);
}
