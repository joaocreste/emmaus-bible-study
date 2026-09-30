/**
 * Text normalisation and matching shared by the intent classifier, the
 * responders and the curated providers. Pure functions, no dependencies.
 *
 * Multilingual: matching is accent-insensitive ("graça" = "graca"), French
 * elisions are split ("l'Esprit" → "l esprit"), function words of Portuguese,
 * Spanish and French are stopwords, and topic queries lose their question
 * framing in all four languages ("o que a Bíblia diz sobre…", "¿qué dice la
 * Biblia sobre…?", "que dit la Bible sur… ?").
 */
import type { Locale } from '../i18n/locales';

/** Lowercase; strip diacritics (Latin accents, Greek accents/breathings, Hebrew points); unify quotes/dashes. */
export function fold(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-֑ͯ-ׇ]/g, '')
    .normalize('NFC')
    .replace(/[‘’‛′`]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[‐‑‒–—―−]/g, '-')
    .toLowerCase()
    .replace(/ς/g, 'σ');
}

/** Folded text with whitespace collapsed — the classifier's working copy of a message. */
export function lowerText(input: string): string {
  return fold(input).replace(/\s+/g, ' ').trim();
}

/** French elisions ("l'", "d'", "qu'", "j'"…) before a letter — split off as their own word. */
const ELISION_RE = /\b(l|d|j|m|n|s|t|c|qu|jusqu|lorsqu|puisqu|quelqu)'(?=\p{L})/gu;

/** Words of a string (letters/digits of any script), folded; possessive "'s" dropped; French elisions split. */
export function tokenize(input: string): string[] {
  return fold(input)
    .replace(/\b(what|who|where|how|when|why|it|that|there|here)'s\b/g, '$1 is')
    .replace(/\blet's\b/g, 'lets')
    .replace(/'s\b/g, '')
    .replace(ELISION_RE, '$1 ')
    .replace(/'/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** Folded text with punctuation collapsed to single spaces — the form used for phrase matching. */
export function normalizePhrase(input: string): string {
  return tokenize(input).join(' ');
}

/**
 * Function words of Portuguese, Spanish and French (folded). Words that are also
 * meaningful English words ("no", "son", "sin", "era", "pour", "comment", "ate")
 * are deliberately left out.
 */
const FOREIGN_STOPWORDS =
  // pt
  'o os um uma uns umas de do da dos das em na nos nas num numa ao aos pelo pela pelos pelas por para pra com sem e ou mas que se nao sim ' +
  'isso isto aquilo esse essa esses essas este esta estes estas aquele aquela ele ela eles elas seu sua seus suas meu minha nosso nossa ' +
  'voce voces vc eu mim lhe qual quais quem onde quando como porque entao tambem ja aqui muito mais menos sobre entre apos ' +
  'sao foi sera seria estar estao ha tem ter pode podem posso deve fazer faz vai ser diz dizer disse significa significado quer ' +
  'mostre mostra fale conte explique explica biblia escritura escrituras existe existem ' +
  // es
  'el la los las lo del al en y pero si eso esto aquello ese esa esos esas aquel aquella ella ellos ellas su sus mi mis nuestro nuestra ' +
  'usted ustedes tu yo nosotros te le les cual cuales quien quienes donde cuando entonces alli ahi muy mas hasta fue hay tiene tienen ' +
  'tener pueden puedo puede debe hace hacer va dice decir dijo quiere muestra muestrame dime explicame un una unos unas existen ' +
  'es esta estan sea con ya tambien tan ' +
  // fr
  'l d qu j m n s c t y il ils elle elles nous vous je moi toi lui leur leurs sa ses mon ma mes notre votre ce cet cette ces ceci cela ca ' +
  'quel quelle quels quelles quoi qui ne pas par avec sans dans au aux une des du est sont etait serait etre ont avoir peut peuvent peux ' +
  'dois doit faire fait veut dit dire signifie sens montre montrez expliquez quand pourquoi alors aussi deja ici tres plus moins jusqu ' +
  'sur et ecriture ecritures';

/** Function words ignored when comparing content (English, plus pt/es/fr function words). */
export const STOPWORDS: ReadonlySet<string> = new Set(
  (
    'a an the of in on at to for from by with about and or but nor is are was were be been being am do does did doing done ' +
    'what whats which who whom whose why how when where this that these those it its i im me my we us our you your he him his ' +
    'she her they them their there here can could would should will shall may might must please tell show give explain more ' +
    'some any all so as if then than into just also really very mean means meant meaning say says said bible scripture ' +
    'let lets let\'s ok okay now again ' +
    FOREIGN_STOPWORDS
  ).split(/\s+/),
);

/** Articles, prepositions and conjunctions that may appear inside a bare term ("a graça de Deus", "l'amour de Dieu"). */
export const TERM_FUNCTION_WORDS: ReadonlySet<string> = new Set(
  (
    'the a an of and in to with ' +
    'o os um uma de do da dos das e em na nos nas com ' +
    'el la los las lo un una del al y en con ' +
    'le les l d du des et au aux une dans avec'
  ).split(/\s+/),
);

/** Content words of a string (tokens minus stopwords). */
export function contentTokens(input: string): string[] {
  return tokenize(input).filter((t) => !STOPWORDS.has(t));
}

/** "sinn" → "sin", "stopp" → "stop" (after -ed/-ing); "ll", "ss", "ff"… stay ("call", "bless", "staff"). */
function undouble(w: string): string {
  return /([bgmnprt])\1$/.test(w) ? w.slice(0, -1) : w;
}

/**
 * Very light English stemmer — enough to equate "prayers"/"prayer",
 * "condemned"/"condemn", "loved"/"love", "created"/"create", "sinned"/"sin",
 * "predestined"/"predestine". Both sides of a comparison must be stemmed.
 */
// British spellings compared as American ones ("neighbour" = "neighbor"): the BSB and WEB use American spelling.
const BRITISH = /^(neighbo|hono|favo|labo|savio|behavio|colo|harbo|splendo|vapo|armo|rumo|valo|endeavo|odo|fervo|humo|clamo|ardo)ur(s|ed|ing|able|ite|ites)?$/;

export function stem(word: string): string {
  // Portuguese plural "-ções" ("condenações" = "condenação"); Spanish "-ciones" and French "-tions" reduce below.
  if (word.length > 5 && word.endsWith('coes')) return `${word.slice(0, -4)}cao`;
  let w = BRITISH.test(word) ? word.replace(/our(?=s|ed|ing|able|ite|ites|$)/, 'or') : word;
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && w.endsWith('ied')) return `${w.slice(0, -3)}y`;
  if (w.length > 5 && w.endsWith('ing')) w = undouble(w.slice(0, -3));
  else if (w.length > 4 && w.endsWith('ed')) w = undouble(w.slice(0, -2));
  else if (w.length > 4 && /(ss|x|z|ch|sh)es$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) w = w.slice(0, -1);
  // silent final "e": "love"/"lov(ed)", "create"/"creat(ed)" — but not "ee" ("free", "three")
  if (w.length > 3 && w.endsWith('e') && !w.endsWith('ee')) w = w.slice(0, -1);
  return w;
}

function stemPhrase(phrase: string): string {
  return phrase
    .split(' ')
    .filter(Boolean)
    .map(stem)
    .join(' ');
}

/**
 * How well a query matches a phrase, 0–1:
 * exact (1) → stem-exact (0.95) → whole-word phrase containment (0.5–0.9, by length ratio)
 * → content-token overlap (Jaccard ≥ 0.5, scaled to ≤ 0.5).
 */
export function phraseScore(query: string, phrase: string): number {
  const q = normalizePhrase(query);
  const p = normalizePhrase(phrase);
  if (!q || !p) return 0;
  if (q === p) return 1;
  const qs = stemPhrase(q);
  const ps = stemPhrase(p);
  if (qs === ps) return 0.95;
  if (` ${qs} `.includes(` ${ps} `) || ` ${ps} `.includes(` ${qs} `)) {
    const ratio = Math.min(qs.length, ps.length) / Math.max(qs.length, ps.length);
    return 0.5 + 0.4 * ratio;
  }
  const qt = new Set(contentTokens(q).map(stem));
  const pt = new Set(contentTokens(p).map(stem));
  if (qt.size === 0 || pt.size === 0) return 0;
  let inter = 0;
  for (const t of qt) if (pt.has(t)) inter++;
  const jaccard = inter / (qt.size + pt.size - inter);
  return jaccard >= 0.5 ? 0.5 * jaccard : 0;
}

/** Best phraseScore of a query against several phrases. */
export function bestPhraseScore(query: string, phrases: readonly string[]): number {
  let best = 0;
  for (const p of phrases) best = Math.max(best, phraseScore(query, p));
  return best;
}

/* ------------------------------------------------------------------ */
/* Topic queries                                                       */
/* ------------------------------------------------------------------ */

// Phrasings stripped from topic queries, in normalised token form (apostrophes removed, "'s" dropped).
const TOPIC_PREFIXES = [
  'what does the bible say about',
  'what does the bible teach about',
  'what does the bible say on',
  'what does the new testament say about',
  'what does the old testament say about',
  'what does scripture say about',
  'what does scripture teach about',
  'what do the scriptures say about',
  'what does god say about',
  'what does god word say about',
  'what does jesus say about',
  'what did jesus say about',
  'what did jesus teach about',
  'what does jesus teach about',
  'what is the biblical view of',
  'what is the biblical view on',
  'what is the biblical teaching on',
  'what is the biblical teaching about',
  'what is the bible view of',
  'the biblical view of',
  'biblical view of',
  'biblical teaching on',
  'biblical teaching about',
  'bible verses about',
  'bible verses on',
  'verses about',
  'passages about',
  'scriptures about',
  'why does god allow',
  'why does god permit',
  'why did god allow',
  'why would god allow',
  'why would a good god allow',
  'how can god allow',
  'how could god allow',
  'tell me about',
  'tell me more about',
  'teach me about',
  'help me understand',
  'i want to learn about',
  'i want to study',
  'i want to explore',
  'i would like to study',
  'i would like to explore',
  'id like to study',
  'id like to explore',
  'can we study',
  'can we explore',
  'can we talk about',
  'could we study',
  'lets talk about',
  'lets study',
  'lets explore',
  'lets look at',
  'a study on',
  'a study of',
  'study on',
  'study of',
  'study',
  'explore',
  'the topic of',
  'topic of',
  'topic',
  'the doctrine of',
  'doctrine of',
  'the theology of',
  'theology of',
  'what is',
  'what are',
  'what was',
  'who is',
  'learn about',
  'talk about',
  'about',
];

const TOPIC_SUFFIXES = [
  'in the bible',
  'according to the bible',
  'in scripture',
  'in the scriptures',
  'in the new testament',
  'in the old testament',
  'biblically',
  'please',
  // pt
  'na biblia',
  'segundo a biblia',
  'de acordo com a biblia',
  'nas escrituras',
  'na escritura',
  'no novo testamento',
  'no antigo testamento',
  'biblicamente',
  'por favor',
  // es
  'en la biblia',
  'segun la biblia',
  'de acuerdo con la biblia',
  'en las escrituras',
  'en la escritura',
  'en el nuevo testamento',
  'en el antiguo testamento',
  // fr
  'dans la bible',
  'selon la bible',
  'd apres la bible',
  'dans les ecritures',
  'dans l ecriture',
  'dans le nouveau testament',
  'dans l ancien testament',
  'bibliquement',
  's il vous plait',
  's il te plait',
  'svp',
  'stp',
];

const ARTICLES = new Set(['the', 'a', 'an']);

/** Leading articles of pt/es/fr stripped from a topic ("a graça" → "graça", "la souffrance" → "souffrance"). */
const FOREIGN_LEADING_ARTICLES = new Set(['o', 'os', 'um', 'uma', 'el', 'la', 'los', 'las', 'lo', 'un', 'una', 'le', 'les', 'l', 'une', 'des', 'du', 'd']);

/**
 * Question framings of topic queries in Portuguese, Spanish and French, on the
 * normalised token form (folded, punctuation removed, elisions split), each with
 * the English framing it stands for. `normalizeTopicQuery` strips them; the
 * intent classifier rewrites them to the English framing.
 */
export interface TopicFrame {
  locale: Exclude<Locale, 'en'>;
  re: RegExp;
  /** equivalent English framing (with trailing space) */
  en: string;
  /** an explicit "what does the Bible say about…" / "why does God allow…" question */
  strong?: boolean;
}

const BIBLE_PT = '(?:(?:a|as|o) )?(?:biblia|escritura|escrituras|sagradas escrituras|palavra de deus|deus|jesus|cristo|novo testamento|antigo testamento)';
const ABOUT_PT = '(?:sobre|a respeito de|a respeito do|a respeito da|acerca de|acerca do|acerca da|em relacao a|em relacao ao|quanto a|quanto ao|de|do|da|dos|das)';
const BIBLE_ES = '(?:(?:la|las|el) )?(?:biblia|escritura|escrituras|sagradas escrituras|palabra de dios|dios|jesus|cristo|jesucristo|nuevo testamento|antiguo testamento)';
const ABOUT_ES = '(?:sobre|acerca de|acerca del|respecto a|respecto al|respecto de|respecto del|con respecto a|en cuanto a|de|del)';
const BIBLE_FR = '(?:(?:la|le|les|l) )?(?:bible|ecriture|ecritures|saintes ecritures|parole de dieu|dieu|jesus|christ|jesus christ|nouveau testament|ancien testament)';
const ABOUT_FR = '(?:sur|au sujet de|au sujet du|au sujet des|a propos de|a propos du|a propos des|concernant|quant a|quant au|de|du|des|d)';

const frame = (locale: TopicFrame['locale'], re: string, en: string, strong = false): TopicFrame => ({
  locale,
  re: new RegExp(`^(?:${re}) `),
  en,
  ...(strong ? { strong } : {}),
});

export const TOPIC_FRAMES: readonly TopicFrame[] = [
  // Portuguese
  frame('pt', `(?:e |mas |entao )?(?:o )?que ${BIBLE_PT} (?:nos )?(?:diz|dizem|ensina|ensinam|fala|falam|disse|ensinou|falou|revela|revelam) ${ABOUT_PT}`, 'what does the bible say about ', true),
  frame('pt', `(?:e |mas |entao )?(?:o )?que (?:diz|dizem|ensina|ensinam|fala|falam) ${BIBLE_PT} ${ABOUT_PT}`, 'what does the bible say about ', true),
  frame('pt', `qual (?:e )?(?:a )?(?:visao|perspectiva|posicao) biblica ${ABOUT_PT}`, 'what is the biblical view of ', true),
  frame('pt', `qual (?:e )?o (?:ensino|ensinamento|ponto de vista) biblico ${ABOUT_PT}`, 'what is the biblical view of ', true),
  frame('pt', `(?:a )?(?:visao|perspectiva) biblica ${ABOUT_PT}|(?:o )?ensino biblico ${ABOUT_PT}`, 'biblical view of ', true),
  frame('pt', `(?:versiculos|passagens|textos) (?:biblic[oa]s )?(?:sobre|a respeito de|que falam (?:sobre|de|do|da))`, 'bible verses about ', true),
  frame('pt', `por ?que (?:um )?deus (?:bom |amoroso )?(?:permite|permitiria|permitiu|deixa|deixaria|deixou)`, 'why does god allow ', true),
  frame('pt', `como (?:um )?deus (?:bom |amoroso )?(?:pode|poderia) (?:permitir|deixar)`, 'how can god allow ', true),
  frame('pt', `(?:me )?(?:fale|fala|conte|ensine|explique)(?: me)?(?: mais| um pouco)? (?:sobre|a respeito de|a respeito do|a respeito da|acerca de)`, 'tell me about '),
  frame('pt', `(?:eu )?(?:quero|gostaria de|queria) (?:estudar|aprender sobre|aprender|explorar|entender|compreender|saber sobre|saber mais sobre|conhecer)`, 'i want to study '),
  frame('pt', `(?:vamos|podemos|poderiamos) (?:estudar|explorar|falar sobre|conversar sobre|aprender sobre)`, 'can we study '),
  frame('pt', `(?:me )?ajude(?: me)? a entender|me ajuda a entender`, 'help me understand '),
  frame('pt', `(?:um )?estudo (?:sobre|de|da|do)|estudar|explorar|estude|explore`, 'study '),
  frame('pt', `(?:o )?tema (?:de|da|do)|(?:a )?doutrina (?:de|da|do)|(?:a )?teologia (?:de|da|do)`, 'doctrine of '),
  frame('pt', `(?:o )?que (?:e|foi|era)`, 'what is '),
  frame('pt', `(?:o )?que sao`, 'what are '),
  frame('pt', `quem (?:e|foi|sao|era)`, 'who is '),
  frame('pt', `(?:aprender|falar) sobre|sobre|a respeito de`, 'about '),
  // Spanish
  frame('es', `(?:y |pero |entonces )?(?:que|lo que) (?:nos )?(?:dice|dicen|ensena|ensenan|enseno|dijo|revela|habla|hablan) ${BIBLE_ES} ${ABOUT_ES}`, 'what does the bible say about ', true),
  frame('es', `(?:y |pero |entonces )?(?:que|lo que) ${BIBLE_ES} (?:nos )?(?:dice|dicen|ensena|ensenan|enseno|dijo|revela|habla) ${ABOUT_ES}`, 'what does the bible say about ', true),
  frame('es', `cual es (?:la |el )?(?:vision|perspectiva|ensenanza|postura|punto de vista) biblic[oa] ${ABOUT_ES}`, 'what is the biblical view of ', true),
  frame('es', `(?:la |el )?(?:vision|perspectiva|ensenanza|punto de vista) biblic[oa] ${ABOUT_ES}`, 'biblical view of ', true),
  frame('es', `(?:versiculos|pasajes|textos|citas) (?:biblic[oa]s )?(?:sobre|acerca de|que hablan de|que hablan del|que hablan sobre)`, 'bible verses about ', true),
  frame('es', `por ?que (?:un )?dios (?:bueno |amoroso |de amor )?(?:permite|permitiria|permitio|deja|dejaria)`, 'why does god allow ', true),
  frame('es', `como (?:puede|podria) (?:un )?dios (?:bueno |amoroso )?(?:permitir|dejar)`, 'how can god allow ', true),
  frame('es', `(?:hablame|habla me|cuentame|cuenta me|dime|ensename|hableme|cuenteme|digame|explicame)(?: mas| un poco)? (?:sobre|de|del|acerca de|acerca del|respecto a)`, 'tell me about '),
  frame('es', `(?:yo )?(?:quiero|quisiera|me gustaria|deseo) (?:estudiar|explorar|aprender sobre|aprender de|aprender|entender|comprender|saber sobre|saber mas sobre|conocer)`, 'i want to study '),
  frame('es', `(?:podemos|podriamos|vamos a|queremos) (?:estudiar|explorar|hablar de|hablar sobre|aprender sobre)`, 'can we study '),
  frame('es', `estudiemos|exploremos|hablemos de|hablemos sobre`, 'lets study '),
  frame('es', `(?:ayudame|ayudeme) a (?:entender|comprender)`, 'help me understand '),
  frame('es', `(?:un )?estudio (?:sobre|de|del)|estudiar|explorar|estudia|explora`, 'study '),
  frame('es', `(?:el )?tema (?:de|del)|(?:la )?doctrina (?:de|del)|(?:la )?teologia (?:de|del)`, 'doctrine of '),
  frame('es', `(?:que|que cosa) (?:es|fue|era)`, 'what is '),
  frame('es', `que son`, 'what are '),
  frame('es', `quien (?:es|fue|era)|quienes (?:son|eran|fueron)`, 'who is '),
  frame('es', `(?:aprender|hablar) (?:sobre|de)|sobre|acerca de`, 'about '),
  // French
  frame('fr', `(?:et |mais |alors |donc )?(?:que|qu est ce que|qu est ce qu) (?:nous )?(?:dit|disent|enseigne|enseignent|revele|revelent) ${BIBLE_FR} ${ABOUT_FR}`, 'what does the bible say about ', true),
  frame('fr', `(?:et |mais |alors |donc )?(?:qu est ce que|que) ${BIBLE_FR} (?:nous )?(?:dit|disent|enseigne|enseignent|revele) ${ABOUT_FR}`, 'what does the bible say about ', true),
  frame('fr', `qu (?:a|avait) (?:dit|enseigne) jesus ${ABOUT_FR}|(?:que|qu) (?:a dit|a enseigne|enseignait|disait) jesus ${ABOUT_FR}`, 'what did jesus say about ', true),
  frame('fr', `quelle est (?:la )?(?:vision|perspective|position) biblique ${ABOUT_FR}|quel est (?:l )?enseignement biblique ${ABOUT_FR}`, 'what is the biblical view of ', true),
  frame('fr', `(?:la )?(?:vision|perspective) biblique ${ABOUT_FR}|(?:l )?enseignement biblique ${ABOUT_FR}`, 'biblical view of ', true),
  frame('fr', `(?:des )?(?:versets|passages|textes) (?:bibliques )?(?:sur|au sujet de|a propos de|qui parlent de|qui parlent du|qui parlent des)`, 'bible verses about ', true),
  frame('fr', `pourquoi (?:un )?dieu (?:bon |d amour |aimant )?(?:permet il|permet|permettrait il|permettrait|a t il permis|a permis|laisse t il|laisse)`, 'why does god allow ', true),
  frame('fr', `comment (?:un )?dieu (?:bon |d amour )?(?:peut il|pourrait il|peut|pourrait) (?:permettre|laisser)`, 'how can god allow ', true),
  frame('fr', `(?:parle moi|parlez moi|parle|parlez|dis moi|dites moi|raconte moi|racontez moi|explique moi|expliquez moi)(?: un peu| davantage| plus)? (?:de la|de l|de|du|des|d|sur|au sujet de|a propos de)`, 'tell me about '),
  frame('fr', `(?:enseigne moi|enseignez moi)(?: sur| a propos de)?`, 'teach me about '),
  frame('fr', `(?:je )?(?:veux|voudrais|souhaite|souhaiterais|aimerais)(?: bien)? (?:etudier|explorer|apprendre|en savoir plus sur|comprendre|decouvrir)|j aimerais (?:etudier|explorer|apprendre|en savoir plus sur|comprendre|decouvrir)`, 'i want to study '),
  frame('fr', `(?:on peut|pouvons nous|peut on|est ce qu on peut|est ce que nous pouvons|pourrions nous) (?:etudier|explorer|parler de|parler du|parler des)`, 'can we study '),
  frame('fr', `etudions|explorons|parlons de|parlons du|parlons des`, 'lets study '),
  frame('fr', `(?:aide moi|aidez moi) a comprendre`, 'help me understand '),
  frame('fr', `(?:une )?etude (?:sur|de|du|des|d)|etudier|explorer|etudie|explore`, 'study '),
  frame('fr', `(?:le )?(?:theme|sujet) (?:de|du|des|d)|(?:la )?doctrine (?:de|du|des|d)|(?:la )?theologie (?:de|du|des|d)`, 'doctrine of '),
  frame('fr', `qu est ce que|qu est ce qu|c est quoi|qu est|quel est|quelle est`, 'what is '),
  frame('fr', `que sont|quels sont|quelles sont`, 'what are '),
  frame('fr', `qui (?:est|etait|sont|etaient)`, 'who is '),
  frame('fr', `(?:apprendre|parler) (?:sur|de)|sur|au sujet de|a propos de`, 'about '),
];

/**
 * Normalise a topic query: lowercase, strip punctuation, phrasing such as
 * "what does the Bible say about", "tell me about", "why does God allow",
 * "study", "explore", and articles — in English, Portuguese, Spanish and French.
 * "The Kingdom of God" → "kingdom of god"; "O que a Bíblia diz sobre a graça?" → "graca".
 */
export function normalizeTopicQuery(query: string): string {
  let s = tokenize(query)
    .join(' ')
    .replace(/\bwhats\b/g, 'what is')
    .replace(/\bwhos\b/g, 'who is');
  let changed = true;
  while (changed && s) {
    changed = false;
    for (const p of TOPIC_PREFIXES) {
      if (s === p) {
        s = '';
        changed = true;
        break;
      }
      if (s.startsWith(`${p} `)) {
        s = s.slice(p.length + 1);
        changed = true;
        break;
      }
    }
    if (!changed) {
      for (const f of TOPIC_FRAMES) {
        const m = f.re.exec(`${s} `);
        if (m && m[0].length > 0) {
          s = `${s} `.slice(m[0].length).trim();
          changed = true;
          break;
        }
      }
    }
    for (const suf of TOPIC_SUFFIXES) {
      if (s.endsWith(` ${suf}`)) {
        s = s.slice(0, -(suf.length + 1));
        changed = true;
      }
    }
  }
  const tokens = s.split(' ').filter((t) => t && !ARTICLES.has(t));
  while (tokens.length > 1 && FOREIGN_LEADING_ARTICLES.has(tokens[0])) tokens.shift();
  return tokens.join(' ');
}

/* ------------------------------------------------------------------ */
/* Message language                                                    */
/* ------------------------------------------------------------------ */

const LANGUAGE_MARKERS: Record<Locale, ReadonlySet<string>> = {
  en: new Set(
    ('the what whats does did is are was were how why where who this that these those about say says said mean means show tell of and with can ' +
      'you other verse verses passage passages word words explain study it there have has would could should which my i in on for from help hi hello ' +
      'hey thanks thank please again more does').split(' '),
  ),
  pt: new Set(
    ('o os um uma não nao é são sao isso isto esse essa este esta você voce vc sobre qual quais quem onde como porque porquê diz disse dizem significa ' +
      'palavra palavras versículo versiculo versículos versiculos passagem passagens mais do da dos das no na nos nas em com para pra mostre explique ' +
      'fale estudar olá ola oi obrigado obrigada deus bíblia biblia também tambem então entao sim ele ela seu sua ao pelo pela outras outros existem ' +
      'há pode fazer entre relaciona quer dizer significado ensina fala aqui agora vamos quero gostaria estudo tem foi ser está estão nosso nossa ' +
      'escrituras leitores originais estrutura desta deste nesta neste disso nisso também explica abre abra').split(' '),
  ),
  es: new Set(
    ('el los las la un una qué que es son sobre eso esto este esta ese esa cuál cual cuáles quién quien dónde donde cómo como porqué dice dijo dicen ' +
      'significa palabra palabras versículo versiculo versículos versiculos pasaje pasajes más del al en con para muestra muéstrame muestrame explica ' +
      'explícame explicame háblame hablame estudiar hola gracias dios biblia también y hay puedes puede otros otras entre lo se habla enseña ' +
      'significado aquí aqui ahora vamos quiero gustaría estudio tiene fue ser está están nuestro cuéntame dime quiere decir detrás detras por ' +
      'escrituras lectores originales estructura audiencia abre').split(' '),
  ),
  fr: new Set(
    ('le les la un une des du qu que est sont sur cela ça ceci ce cette ces quel quelle quels quelles qui où comment pourquoi dit disent signifie mot ' +
      'mots verset versets passage plus au aux en dans avec pour montre explique parle étudier etudier bonjour salut merci dieu bible aussi et il ' +
      'elle peux pouvez vous tu je autres entre ne pas sens veut dire ici maintenant allons veux voudrais étude derrière derriere lien être était ' +
      'ailleurs parlez dites écritures ecritures lecteurs premiers structure ouvre').split(' '),
  ),
};

/**
 * Best guess at the language of a chat message (en/pt/es/fr) from function
 * words, accents and punctuation (¿ ¡ « »). `fallback` — the reader's chosen
 * language — wins ties and is returned when nothing decides ("Romanos 8", "8:28").
 */
export function detectLocale(text: string, fallback: Locale = 'en'): Locale {
  const lower = text.toLowerCase().normalize('NFC');
  const score: Record<Locale, number> = { en: 0, pt: 0, es: 0, fr: 0 };
  for (const token of lower.replace(/[’']/g, ' ').split(/[^\p{L}]+/u)) {
    if (!token) continue;
    for (const l of ['en', 'pt', 'es', 'fr'] as const) if (LANGUAGE_MARKERS[l].has(token)) score[l] += 1;
  }
  const count = (re: RegExp) => (lower.match(re) ?? []).length;
  score.pt += 2 * count(/[ãõ]/g) + count(/ç/g) + 0.5 * count(/[áíóúâôêà]/g);
  score.es += 3 * count(/[ñ¿¡]/g) + 0.5 * count(/[áíóú]/g);
  score.fr += count(/ç/g) + 2 * count(/[èùûœëïî«»]/g) + count(/[êàâô]/g) + 2 * count(/\b(?:qu|l|d|j|c|n|s)['’]\p{L}/gu);
  let best: Locale = fallback;
  for (const l of [fallback, 'pt', 'es', 'fr', 'en'] as const) if (score[l] > score[best]) best = l;
  return best;
}

/* ------------------------------------------------------------------ */
/* Reader's spelling                                                   */
/* ------------------------------------------------------------------ */

/** Folded copy of a string with the same UTF-16 length (characters whose folding changes length are kept as they are). */
function foldAligned(s: string): string {
  let out = '';
  for (const ch of s) {
    const f = fold(ch);
    out += f.length === ch.length ? f : ch;
  }
  return out;
}

/**
 * The reader's own spelling of a folded term or topic: "condenacao" found in
 * "O que significa condenação?" → "condenação"; "saint esprit" in "le Saint-Esprit"
 * → "saint-esprit". Returns the value unchanged when the message has no accents,
 * hyphens or apostrophes, or the words are not found in sequence.
 */
export function restoreSpelling(value: string, original: string): string {
  if (!value || !/[^\x00-\x7f]|[-'’]/.test(original)) return value;
  const toks = tokenize(value);
  if (!toks.length) return value;
  const src = original.normalize('NFC');
  const folded = foldAligned(src);
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${toks.map(escapeRegExp).join("[\\s'\\-]+")}(?![\\p{L}\\p{N}])`, 'u');
  const m = re.exec(folded);
  if (!m) return value;
  return src.slice(m.index, m.index + m[0].length).toLowerCase().replace(/\s+/g, ' ');
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

/** Canonical base Strong's number ("H0430G" → "H430", "g02631" → "G2631"), or the input upper-cased. */
export function strongBase(raw: string): string {
  const m = /^\{?\s*([GH])\s*0*(\d{1,5})/i.exec(raw.trim());
  return m ? `${m[1].toUpperCase()}${Number(m[2])}` : raw.trim().toUpperCase();
}

/** Strip HTML-ish markup and collapse whitespace (lexicon definitions, commentary sections). */
export function cleanMarkup(input: string): string {
  return input
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // last, so "&amp;lt;" becomes the text "&lt;" rather than "<"
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Number of whitespace-separated words. */
export function wordCount(input: string): number {
  return input.split(/\s+/).filter(Boolean).length;
}

/**
 * Truncate prose to at most `maxWords`, preferring a sentence boundary.
 * Adds an ellipsis only when a sentence had to be cut mid-way.
 */
// Abbreviations whose full stop does not end a sentence ("e.g.", "cf.", "vv."); held as "\u2024" while splitting.
/** abbreviations whose period does not end a sentence (en, pt, es, fr) */
const ABBREVIATIONS =
  /(?<![\p{L}])(?:e\.g|i\.e|cf|vv?|ch|chs|etc|ca|c|ed|trans|vol|no|pp?|St|Dr|Mr|Mrs|d\.\s?C|a\.\s?C|av|apr|J\.-C|p\.\s?ex|p\.\s?ej|cap|chap|env|séc|sec|aprox|ss?|Sr|Sra|Dra|Mme|Mlle|M|pág|págs|p|art|n|nº|vs)\./giu;

export function excerpt(input: string, maxWords: number): string {
  const text = input.replace(/\s+/g, ' ').trim();
  if (wordCount(text) <= maxWords) return text;
  // hold periods that are not sentence ends: abbreviations, a name's initials ("N. W. Clerk", "C. S. Lewis") and chapter.verse ("Jean 3.16")
  const held = text
    .replace(ABBREVIATIONS, (m) => m.replace(/\./g, '\u2024'))
    .replace(/(?<![\p{L}])(\p{Lu})\.(?=\s?\p{Lu})/gu, '$1\u2024')
    .replace(/(\d)\.(\d)/g, '$1\u2024$2');
  const restore = (s: string) => s.replace(/\u2024/g, '.');
  const sentences = held.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) ?? [held];
  let out = '';
  for (const s of sentences) {
    const next = `${out}${s}`;
    if (wordCount(next) > maxWords) break;
    out = next;
  }
  out = restore(out.trim());
  if (out) return out;
  return `${text.split(/\s+/).slice(0, maxWords).join(' ').replace(/[,;:(]$/, '')}…`;
}

/** "A", "A and B", "A, B and C" */
export function joinList(items: readonly string[], conj = 'and'): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`;
}

/** Lower-case a leading capital for use mid-sentence, keeping acronyms and names ("The LORD" → "the LORD", "LORD" stays). */
export function lowerFirst(s: string): string {
  if (/^(The|A|An) /.test(s)) return s[0].toLowerCase() + s.slice(1);
  if (/^[A-Z][a-z]+\s+[A-Z]/.test(s)) return s; // "Holy Spirit", "Son of Man"
  return /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
}

/** A title as a sentence: adds a full stop unless it already ends with punctuation. */
export function asSentence(s: string): string {
  return /[.?!…:]["”’)]?$/.test(s.trim()) ? s.trim() : `${s.trim()}.`;
}

/** Upper-case the first letter. */
export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** Escape a string for use inside a RegExp. */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
