/**
 * historical-context, literary-context, theology and perspectives: rank the
 * study's items by the question's keywords, answer from the top one or two,
 * and focus the section. Library studies fall back to the Tyndale book
 * introduction (historical) or canon metadata (literary), stated as such.
 */
import type {
  BookIntroduction,
  CommentarySection,
  ContextCategory,
  ContextItem,
  LiteraryFeature,
  LiteraryFeatureType,
  MessageBlock,
  PassageRef,
  Study,
  TheologyCategory,
  TheologyTheme,
} from '../../domain/models';
import { getBook } from '../../domain/books';
import { cite } from '../../domain/provenance';
import { chaptersOf, formatRef, isWholeBook, refContains, refIncludesVerse, refKey, refsOverlap } from '../../domain/reference';
import type { MessageKey } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';
import { bookName, list, listJoin, mergeCitations, para, personName, sanitizeInline, tok, type ReplyDraft } from '../compose';
import { searchStudy } from '../search';
import { asSentence, bestPhraseScore, cleanMarkup, contentTokens, excerpt, fold, stem } from '../text';
import { activeConcept, attempt, curatedPid, loc, pid, step, studyName, tr, type ResponderEnv } from './env';
import { answeringPassages, respondFromKeyPassages, topicDefinitionDraft } from './topic';

/* ------------------------------------------------------------------ */
/* Keyword → category tables                                           */
/* ------------------------------------------------------------------ */

const CONTEXT_CUES: [RegExp, ContextCategory[]][] = [
  [/\b(original|first) (audience|readers|hearers|listeners)|\baudience\b|\breaders\b|\bhearers\b|\brecipients\b|\bunderstood\b/, ['audience', 'jewish-tradition', 'greco-roman', 'customs']],
  [/\b(who wrote|author|authorship|written by|wrote)\b/, ['authorship']],
  [/\b(when|date[ds]?|dating|period|era|century|time)\b/, ['historical-period', 'occasion']],
  [/\b(where|place|geograph\w*|location|city|land|region)\b/, ['geography']],
  [/\b(why was|occasion|purpose|situation|circumstances?)\b/, ['occasion']],
  [/\b(politic\w*|empire|rome|roman|caesar|king|ruler)\b/, ['political', 'greco-roman']],
  [/\b(econom\w*|money|slave\w*|trade|wealth|poor|debt)\b/, ['economic', 'social']],
  [/\b(jew\w*|judaism|rabbi\w*|temple|torah|synagogue|pharisee\w*)\b/, ['jewish-tradition', 'religious']],
  [/\b(greek|greco|graeco|hellenis\w*|pagan)\b/, ['greco-roman']],
  [/\b(cultur\w*|customs?|practice|social|family|household)\b/, ['customs', 'social']],
  [/\b(ancient near east\w*|near eastern|canaan\w*|babylon\w*|egypt\w*|assyria\w*|shepherd\w*)\b/, ['ancient-near-east', 'customs']],
  [/\b(genre|kind of (text|literature|writing))\b/, ['genre']],
  [/\b(religio\w*|worship|sacrifice|priest\w*|cult)\b/, ['religious']],
];

const LITERARY_CUES: [RegExp, LiteraryFeatureType[]][] = [
  [/\b(structure[ds]?|structural|outline|organi[sz]ed|built)\b/, ['argument-structure', 'narrative-structure', 'chiasm', 'inclusio']],
  [/\bchias\w*/, ['chiasm']],
  [/\bparallel\w*/, ['parallelism']],
  [/\brepe(at|tition)\w*/, ['repetition']],
  [/\b(metaphor\w*|image\w*|imagery|picture)\b/, ['metaphor', 'imagery']],
  [/\b(poem|poetry|poetic)\b/, ['poetry', 'parallelism']],
  [/\btransition\w*/, ['transition']],
  [/\b(allusion|echo\w*)\b/, ['allusion']],
  [/\b(argument|flow|logic|reasoning)\b/, ['argument-structure', 'transition']],
  [/\b(narrative|story|plot)\b/, ['narrative-structure']],
  [/\binclusio\b/, ['inclusio']],
];

const THEOLOGY_CUES: [RegExp, TheologyCategory[]][] = [
  [/\b(christ|jesus|son|christolog\w*|incarnation|messiah|logos|word became)\b/, ['christology']],
  [/\b(spirit|pneumatolog\w*)\b/, ['pneumatology']],
  [/\b(salvation|saved|save|justif\w*|redemption|redeem\w*|atonement|soteriolog\w*|forgive\w*)\b/, ['soteriology']],
  [/\b(church|ecclesiolog\w*|community|body of christ)\b/, ['ecclesiology']],
  [/\b(end|future|eschatolog\w*|hope|glory|resurrection|new creation|kingdom)\b/, ['eschatology']],
  [/\bcovenant\w*/, ['covenant']],
  [/\b(creation|creator|create[ds]?|creature\w*)\b/, ['creation']],
  [/\b(sin|sins|sinful|hamartiolog\w*|fall)\b/, ['hamartiology']],
  [/\bgrace\b/, ['grace']],
  [/\b(holiness|sanctif\w*|holy living|transform\w*|obedien\w*)\b/, ['sanctification']],
  [/\b(adopt\w*|children of god|sons of god|abba)\b/, ['adoption']],
  [/\b(providence|sovereign\w*|plan|all things|predestin\w*|election)\b/, ['providence']],
  [/\b(trinit\w*|triune)\b/, ['trinity']],
  [/\b(god|father|nature of god|character of god|attributes?)\b/, ['theology-proper']],
  [/\b(human\w*|man|image of god|anthropolog\w*)\b/, ['anthropology']],
  [/\b(scripture|revelation|word of god)\b/, ['revelation']],
  [/\b(ethic\w*|moral\w*|how should we live|behaviou?r)\b/, ['ethics']],
  [/\b(worship|praise|prayer)\b/, ['worship']],
];

/*
 * The same cues in Portuguese, Spanish and French (the message is folded: lowercase, no accents).
 * Used together with the English tables when the reader writes in another language.
 */
const CONTEXT_CUES_I18N: [RegExp, ContextCategory[]][] = [
  [/\b(publico original|primeiros (leitores|ouvintes)|primeros (lectores|oyentes)|premiers (lecteurs|auditeurs)|destinatari\w*|leitores|ouvintes|lectores|oyentes|lecteurs|auditeurs|entendid\w*|compris\w*|comprendid\w*|entendido)\b/, ['audience', 'jewish-tradition', 'greco-roman', 'customs']],
  [/\b(quem escreveu|quien escribio|qui a ecrit|autor\w*|autoria|auteur\w*|escreveu|escribio|ecrit)\b/, ['authorship']],
  [/\b(quando|cuando|quand|data|datas|fecha|epoca|periodo|seculo|siglo|siecle)\b/, ['historical-period', 'occasion']],
  [/\b(onde|donde|ou se|lugar|local|lieu|geografi\w*|geographi\w*|cidade|ciudad|ville|terra|tierra|pays|regiao|region)\b/, ['geography']],
  [/\b(por que foi|por que fue|pourquoi|ocasiao|ocasion|occasion|proposito|finalidad|but|situacao|situacion|circunstancia\w*|circonstance\w*)\b/, ['occasion']],
  [/\b(politic\w*|imperio|empire|roma|romano\w*|romain\w*|cesar|rei|rey|roi|governante\w*|gobernante\w*)\b/, ['political', 'greco-roman']],
  [/\b(econom\w*|dinheiro|dinero|argent|escrav\w*|esclav\w*|comercio|commerce|riqueza|richesse|pobre\w*|pauvre\w*|divida\w*|deuda\w*|dette\w*)\b/, ['economic', 'social']],
  [/\b(judeu\w*|judia\w*|judio\w*|juif\w*|juive\w*|judaismo|judaisme|rabin\w*|templo|temple|tora|torah|sinagoga|synagogue|fariseu\w*|farise\w*|pharisien\w*)\b/, ['jewish-tradition', 'religious']],
  [/\b(grego\w*|griego\w*|grec\w*|greco|helenis\w*|hellenis\w*|paga\w*|pagano\w*|paien\w*)\b/, ['greco-roman']],
  [/\b(cultur\w*|costume\w*|costumbre\w*|coutume\w*|pratica\w*|practica\w*|pratique\w*|social|sociais|sociales|sociaux|familia\w*|famille\w*|casa|hogar|maison)\b/, ['customs', 'social']],
  [/\b(oriente proximo|antigo oriente|antiguo oriente|proche-orient|proche orient|cana\w*|babilon\w*|babylon\w*|egit\w*|egipt\w*|egypt\w*|assiri\w*|asiri\w*|assyri\w*|pastor\w*|berger\w*)\b/, ['ancient-near-east', 'customs']],
  [/\b(genero|genre|tipo de (texto|literatura)|type de (texte|litterature))\b/, ['genre']],
  [/\b(religi\w*|culto|culte|adoracao|adoracion|sacrifici\w*|sacrifice\w*|sacerdot\w*|pretre\w*)\b/, ['religious']],
];

const LITERARY_CUES_I18N: [RegExp, LiteraryFeatureType[]][] = [
  [/\b(estrutura\w*|estructura\w*|structure\w*|esboco|esquema|plan|organizad\w*|organise\w*|construid\w*)\b/, ['argument-structure', 'narrative-structure', 'chiasm', 'inclusio']],
  [/\b(quias\w*|chias\w*)/, ['chiasm']],
  [/\bparalel\w*|\bparallel\w*/, ['parallelism']],
  [/\b(repeti\w*|repet\w*)/, ['repetition']],
  [/\b(metafor\w*|metaphor\w*|imag\w*)\b/, ['metaphor', 'imagery']],
  [/\b(poema|poesia|poetic\w*|poeme|poesie|poetique)\b/, ['poetry', 'parallelism']],
  [/\b(transic\w*|transi\w*)\b/, ['transition']],
  [/\b(alusao|alusion|allusion|eco\w*|echo\w*)\b/, ['allusion']],
  [/\b(argument\w*|fluxo|flujo|fil|logica|logique|raciocinio|razonamiento|raisonnement)\b/, ['argument-structure', 'transition']],
  [/\b(narrativ\w*|narrati\w*|recit|historia|histoire|enredo|trama|intrigue)\b/, ['narrative-structure']],
];

const THEOLOGY_CUES_I18N: [RegExp, TheologyCategory[]][] = [
  [/\b(cristo|christ|jesus|filho|hijo|fils|cristolog\w*|christolog\w*|encarnacao|encarnacion|incarnation|messias|mesias|messie|verbo|logos|parole)\b/, ['christology']],
  [/\b(espirito|espiritu|esprit|pneumatolog\w*)\b/, ['pneumatology']],
  [/\b(salvacao|salvacion|salut|salv\w*|sauve\w*|justifica\w*|justifi\w*|redencao|redencion|redemption|redimi\w*|rachat|expiacao|expiacion|expiation|perdao|perdon|pardon)\b/, ['soteriology']],
  [/\b(igreja|iglesia|eglise|eclesiolog\w*|ecclesiolog\w*|comunidade|comunidad|communaute|corpo de cristo|cuerpo de cristo|corps du christ)\b/, ['ecclesiology']],
  [/\b(fim|fin|futuro|futur|escatolog\w*|eschatolog\w*|esperanca|esperanza|esperance|gloria|gloire|ressurreicao|resurreccion|resurrection|nova criacao|nueva creacion|nouvelle creation|reino|royaume)\b/, ['eschatology']],
  [/\b(alianca\w*|pacto\w*|alliance\w*)\b/, ['covenant']],
  [/\b(criacao|creacion|creation|criador|creador|createur|criad\w*|cread\w*|cree\w*|criatura\w*|creature\w*)\b/, ['creation']],
  [/\b(pecado\w*|peche\w*|pecador\w*|pecheur\w*|hamartiolog\w*|queda|caida|chute)\b/, ['hamartiology']],
  [/\b(graca|gracia|grace)\b/, ['grace']],
  [/\b(santidade|santidad|saintete|santifica\w*|sanctifi\w*|transforma\w*|transform\w*|obedien\w*|obeissance)\b/, ['sanctification']],
  [/\b(ado[cp]\w*|adopt\w*|filhos de deus|hijos de dios|enfants de dieu|abba)\b/, ['adoption']],
  [/\b(providencia|providence|soberan\w*|souverain\w*|plano|plan|todas as coisas|todas las cosas|toutes choses|predestina\w*|predestin\w*|eleicao|eleccion|election)\b/, ['providence']],
  [/\b(trindade|trinidad|trinite|trino|trina|trinitaire)\b/, ['trinity']],
  [/\b(deus|dios|dieu|pai|padre|pere|natureza de deus|naturaleza de dios|nature de dieu|carater de deus|caracter de dios|caractere de dieu|atributo\w*|attribut\w*)\b/, ['theology-proper']],
  [/\b(human\w*|homem|hombre|homme|imagem de deus|imagen de dios|image de dieu|antropolog\w*|anthropolog\w*)\b/, ['anthropology']],
  [/\b(escritura\w*|ecriture\w*|revelacao|revelacion|revelation|palavra de deus|palabra de dios|parole de dieu)\b/, ['revelation']],
  [/\b(etic\w*|ethique\w*|moral\w*|como devemos viver|como debemos vivir|comment vivre|comportamento|comportamiento|comportement)\b/, ['ethics']],
  [/\b(adoracao|adoracion|adoration|louvor|alabanza|louange|oracao|oracion|priere)\b/, ['worship']],
];

function cues<T extends string>(table: [RegExp, T[]][], extra: [RegExp, T[]][], locale: Locale): [RegExp, T[]][] {
  return locale === 'en' ? table : [...table, ...extra];
}

function cueCategories<T extends string>(lower: string, table: [RegExp, T[]][]): Map<T, number> {
  const m = new Map<T, number>();
  for (const [re, cats] of table) {
    if (!re.test(lower)) continue;
    cats.forEach((c, i) => m.set(c, Math.max(m.get(c) ?? 0, i === 0 ? 3 : 2)));
  }
  return m;
}

function overlap(queryTokens: string[], fields: string[]): number {
  if (!queryTokens.length) return 0;
  const hay = new Set(fields.flatMap((f) => contentTokens(f)).map(stem));
  return queryTokens.filter((t) => hay.has(stem(t))).length;
}

// Words of the question that say *what kind* of answer is wanted, not what about — ignored for overlap.
const META_WORDS = new Set([
  'historical', 'history', 'background', 'context', 'cultural', 'culture', 'original', 'audience', 'literary', 'structure', 'theology', 'theological', 'teach', 'passage', 'understood', 'understand', 'would', 'have', 'first',
  // pt / es / fr (folded)
  'historico', 'historica', 'historia', 'contexto', 'cultura', 'publico', 'literario', 'literaria', 'estrutura', 'teologia', 'teologico', 'teologica', 'ensina', 'ensena', 'passagem', 'pasaje', 'texto', 'entendido', 'entender', 'teriam', 'habrian', 'primeiros', 'primeros',
  'historique', 'contexte', 'public', 'litteraire', 'theologie', 'theologique', 'enseigne', 'compris', 'comprendre', 'premiers', 'auraient',
]);

function queryTokens(lower: string): string[] {
  return contentTokens(lower).filter((t) => !META_WORDS.has(t));
}

/* ------------------------------------------------------------------ */
/* Historical                                                          */
/* ------------------------------------------------------------------ */

function rankContext(env: ResponderEnv, items: ContextItem[]): { item: ContextItem; score: number }[] {
  const cats = cueCategories(env.parsed.lower, cues(CONTEXT_CUES, CONTEXT_CUES_I18N, loc(env)));
  const q = queryTokens(env.parsed.lower);
  const concept = activeConcept(env);
  const verse = env.intent.slots.verse ?? env.ctx.conversation.activeVerse;
  return items
    .map((item, i) => {
      let score = cats.get(item.category) ?? 0;
      score += overlap(q, [item.title, ...item.tags]) * 1.5;
      if (concept?.contextIds.includes(item.id) && env.parsed.refersToContext) score += 2;
      if (verse && item.relatedVerses?.some((v) => v.book === verse.book && v.chapter === verse.chapter && v.verse === verse.verse)) score += 1;
      return { item, score, i };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i);
}

/** What a question about a book asks of its introduction. */
type IntroAspect = 'overview' | 'authorship' | 'setting' | 'structure';

function introAspect(lower: string): IntroAspect {
  if (/\b(who wrote|author|authors|authorship|written by|wrote|when was|when did|date[ds]?|dating|how old)\b/.test(lower)) return 'authorship';
  if (/\b(structure[ds]?|structural|outline|organi[sz]ed|divided|sections|how is (this|it) (built|organi[sz]ed|structured))\b/.test(lower)) return 'structure';
  if (/\b(setting|occasion|why was|purpose|circumstances?|situation|written to|audience|readers)\b/.test(lower)) return 'setting';
  // pt / es / fr (folded)
  if (/\b(quem escreveu|quien escribio|qui a ecrit|autor\w*|autoria|auteur\w*|escrito por|ecrit par|quando foi|cuando fue|quand a|data|fecha|datacao|datacion)\b/.test(lower)) return 'authorship';
  if (/\b(estrutura\w*|estructura\w*|esboco|esquema|plan du|organizad\w*|organise\w*|dividid\w*|divise\w*|secoes|secciones|sections)\b/.test(lower)) return 'structure';
  if (/\b(cenario|ocasiao|ocasion|occasion|proposito|finalidad|but du|circunstancia\w*|circonstance\w*|situacao|situacion|escrito para|ecrit pour|destinatari\w*|leitores|lectores|lecteurs)\b/.test(lower)) return 'setting';
  return 'overview';
}

/** The "Purpose / Author / Date / Setting" digest of a Tyndale introduction, as label → value. */
function introDigest(intro: BookIntroduction): Map<string, string> {
  const parts = (intro.summary ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out = new Map<string, string>();
  for (let i = 0; i + 1 < parts.length; i++) {
    if (/^[A-Z][A-Za-z ]{2,24}$/.test(parts[i]) && !/^[A-Z][A-Za-z ]{2,24}$/.test(parts[i + 1])) {
      out.set(parts[i].toLowerCase(), parts[i + 1]);
      i++;
    }
  }
  return out;
}

/** The introduction's sections: short heading paragraphs ("Authorship", "Date and Location") and their text. */
function introSections(intro: BookIntroduction): { heading: string; paragraphs: string[] }[] {
  const paras = intro.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: { heading: string; paragraphs: string[] }[] = [{ heading: '', paragraphs: [] }];
  for (const p of paras) {
    if (p.length < 60 && !/[.!?:;,]$/.test(p)) out.push({ heading: p, paragraphs: [] });
    else out[out.length - 1].paragraphs.push(p);
  }
  return out.filter((s) => s.paragraphs.length);
}

function firstParagraph(section: { paragraphs: string[] } | undefined): string | undefined {
  return section?.paragraphs.find((p) => p.length > 40);
}

async function bookIntroReply(env: ResponderEnv, study: Study, lead: string, aspect: IntroAspect = introAspect(env.parsed.lower), bookOverride?: string): Promise<ReplyDraft | undefined> {
  const locale = loc(env);
  const t = tr(env);
  const book = bookOverride ?? study.passage?.book;
  if (!book) return undefined;
  const intro = await attempt(() => env.providers.historicalContext.getBookIntroduction(book), null);
  if (!intro) return undefined;
  const name = locale === 'en' ? getBook(book).name : bookName(book, locale);
  const digest = introDigest(intro);
  const sections = introSections(intro);
  const section = (re: RegExp) => sections.find((x) => re.test(x.heading));
  const blocks: MessageBlock[] = [para(t('intro.from', { lead, book: name, source: tok.source(intro.sourceId) }))];
  let locator = t('cite.intro', { book: name });
  const digestItems = (labels: ('author' | 'date' | 'purpose' | 'setting')[]) =>
    labels.flatMap((l) => (digest.get(l) ? [`**${t(`intro.label.${l}`)}** — ${sanitizeInline(digest.get(l)!)}`] : []));
  if (aspect === 'authorship') {
    const items = digestItems(['author', 'date']);
    const body = section(/authorship|author|date/i);
    if (items.length) blocks.push(list(items));
    const text = firstParagraph(body);
    if (text) {
      blocks.push(para(`*${sanitizeInline(excerpt(text, 70))}*`));
      locator = t('cite.introSection', { book: name, heading: body!.heading });
    }
  } else if (aspect === 'setting') {
    const items = digestItems(['purpose', 'setting']);
    const body = section(/occasion|setting|purpose/i);
    if (items.length) blocks.push(list(items));
    const text = firstParagraph(body);
    if (text) {
      blocks.push(para(`*${sanitizeInline(excerpt(text, 60))}*`));
      locator = t('cite.introSection', { book: name, heading: body!.heading });
    }
  } else if (aspect === 'structure') {
    const body = section(/outline|structure|literary|summary|composition/i);
    const text = firstParagraph(body);
    if (text) {
      blocks.push(para(`*${sanitizeInline(excerpt(text, 80))}*`));
      locator = t('cite.introSection', { book: name, heading: body!.heading });
    }
  }
  if (blocks.length === 1) {
    const first = intro.text.split(/\n{2,}/).map((p) => p.trim()).find((p) => p.length > 40) ?? intro.text;
    blocks.push(para(`*${sanitizeInline(excerpt(first, 85))}*`));
  }
  return {
    blocks,
    focus: { section: 'historical-context', expandIds: [`book-intro-${book}`], reason: t('reason.fromQuestion', { what: t('cite.intro', { book: name }) }) },
    provenance: { kind: 'historical', verification: 'source-derived', citations: [cite(intro.sourceId, locator)] },
    citations: [cite(intro.sourceId, locator)],
    suggestions: [t('suggest.crossRefs'), t('suggest.classicCommentators')],
    steps: [step('Historical context', t('trace.bookIntro', { book: name, aspect }), pid(env.providers.historicalContext, 'local:context'))],
  };
}

export async function respondHistorical(env: ResponderEnv): Promise<ReplyDraft> {
  const t = tr(env);
  const study = env.study!;
  const ranked = rankContext(env, study.context);
  const specific = cueCategories(env.parsed.lower, cues(CONTEXT_CUES, CONTEXT_CUES_I18N, loc(env)));
  const best = ranked[0];
  if (best && (best.score > 0 || specific.size === 0)) {
    const top = ranked.filter((r, i) => i === 0 || (i === 1 && r.score > 0 && r.score >= best.score / 2)).slice(0, 2);
    const blocks = top.map((r) => para(`**${asSentence(r.item.title)}** ${excerpt(r.item.summary, 55)}`));
    return {
      blocks,
      focus: {
        section: 'historical-context',
        expandIds: top.map((r) => r.item.id),
        pinIds: top.map((r) => r.item.id),
        reason: t('reason.fromQuestion', { what: top[0].item.title }),
      },
      citations: mergeCitations(...top.map((r) => r.item.provenance.citations)),
      suggestions: [t('suggest.literary'), t('suggest.restOfScripture')],
      steps: [step('Historical context', t('trace.contextRanked', { count: study.context.length, top: top.map((r) => r.item.id).join(', ') }), curatedPid(study))],
    };
  }
  // In a topic study, the passage the question is about ("the promise of a future and a hope" → Jeremiah 29) decides the book.
  const passage = study.topic ? answeringPassages(study, env.message, env.intent.slots.passage)[0]?.item : undefined;
  const lead = passage
    ? t('ctx.noNotesOnPassage', { ref: tok.ref(passage.ref), title: passage.title })
    : study.depth === 'curated'
      ? t('ctx.noNoteOnAspect', { title: study.title })
      : t('ctx.libraryNoNotes');
  const intro = await bookIntroReply(env, study, lead, introAspect(env.parsed.lower), passage?.ref.book);
  if (intro) return intro;
  return {
    blocks: [para(t('ctx.noIntro', { lead }))],
    focus: { section: 'historical-context' },
    steps: [step('Historical context', t('trace.noContext'), pid(env.providers.historicalContext, 'local:context'))],
    declined: true,
  };
}

/* ------------------------------------------------------------------ */
/* Literary                                                            */
/* ------------------------------------------------------------------ */

const STRUCTURE_RE = /\b(structure[ds]?|structural|outline|organi[sz]ed|divided|divide|sections|parts|how is (this|it) (built|organi[sz]ed|structured))\b/;

/** The Tyndale notes' section notes inside a passage, as its units (top level only), each with its note's first sentence. */
async function tyndaleOutline(env: ResponderEnv, passage: PassageRef): Promise<{ whole?: CommentarySection; units: CommentarySection[] }> {
  const sections = await attempt(() => env.providers.commentary.getCommentary('tyndale', passage), [] as CommentarySection[]);
  const multi = (r: PassageRef) => r.startVerse == null || (r.endChapter ?? r.startChapter) !== r.startChapter || (r.endVerse ?? r.startVerse) > r.startVerse;
  const inside = sections.filter((x) => multi(x.ref) && refContains(passage, x.ref) && refKey(x.ref) !== refKey(passage));
  const whole = sections.find((x) => refContains(x.ref, passage) && multi(x.ref));
  const top = inside.filter((x) => !inside.some((y) => y !== x && refContains(y.ref, x.ref) && refKey(y.ref) !== refKey(x.ref)));
  const seen = new Set<string>();
  const units = top
    .filter((x) => {
      const k = refKey(x.ref);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.ref.startChapter - b.ref.startChapter || (a.ref.startVerse ?? 0) - (b.ref.startVerse ?? 0));
  return { whole, units };
}

function firstSentence(text: string, maxWords: number): string {
  const clean = sanitizeInline(cleanMarkup(text).replace(/\s*\.\s\.\s\.(?:\s\.)?\s*/g, ' … '));
  return excerpt(clean.split(/(?<=[.!?])\s+(?=[A-Z])/)[0] ?? clean, maxWords);
}

/** "What is the structure of this passage?" in a library study: the Tyndale notes' units, else the book introduction. */
async function libraryStructure(env: ResponderEnv, study: Study): Promise<ReplyDraft | undefined> {
  const locale = loc(env);
  const t = tr(env);
  const p = study.passage;
  if (!p) return undefined;
  if (!isWholeBook(p) && chaptersOf(p).length <= 5) {
    const { whole, units } = await tyndaleOutline(env, p);
    if (units.length >= 2) {
      const shown = units.slice(0, 8);
      const src = shown[0].sourceId;
      const on = t('cite.on', { ref: formatRef(p, 'short', locale) });
      const blocks: MessageBlock[] = [para(t('lit.units', { source: tok.source(src), ref: formatRef(p, 'long', locale) }))];
      if (whole) blocks.push(para(`*${firstSentence(whole.text, 40)}*`));
      blocks.push(list(shown.map((u) => `${tok.ref(u.ref)} — ${firstSentence(u.text, 18)}`)));
      if (units.length > shown.length) blocks.push(para(t('lit.moreUnits', { count: units.length - shown.length })));
      return {
        blocks,
        focus: { section: 'commentary', reason: t('reason.fromQuestion', { what: t('lit.reasonUnits', { ref: formatRef(p, 'long', locale) }) }) },
        provenance: { kind: 'commentary', verification: 'source-derived', citations: [cite(src, on)] },
        citations: [cite(src, on)],
        suggestions: [t('suggest.explain', { ref: formatRef(shown[0].ref, 'long', locale) }), t('suggest.keyWords')],
        steps: [step('Study notes', t('trace.tyndaleUnits', { count: units.length, ref: formatRef(p, 'short', locale) }), pid(env.providers.commentary, 'local:commentary'))],
      };
    }
  }
  return undefined;
}

// "book", "structure", "where does it fit", "the bigger story" in pt / es / fr (folded)
const BOOK_I18N = /\b(livro|carta|evangelho|epistola|libro|evangelio|livre|lettre|evangile|epitre)\b/;
const STRUCTURE_I18N = /\b(estrutura\w*|estructura\w*|structure\w*|esboco|esquema|organizad\w*|organise\w*|dividid\w*|divise\w*|partes|parties|secoes|secciones|sections)\b/;
const PLACE_I18N = /\b(se encaixa|encaja|s'insere|situa\w*|lugar|place|livro|carta|evangelho|libro|evangelio|livre|lettre|evangile|fluxo|flujo|resto d\w*|reste d\w*|mais amplo|mas amplio|plus large|canon|historia|histoire|onde fica|donde esta|ou se situe)\b/;
const CANON_I18N = /\b(canon|historia maior|historia mas amplia|grande histoire|panorama|biblia toda|toda a biblia|toda la biblia|toute la bible|historia biblica|histoire biblique|enredo|trama)\b/;

export async function respondLiterary(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study!;
  const lit = study.literary;
  const lower = env.parsed.lower;
  const other = locale !== 'en';
  const wantsBook = /\b(book|letter|gospel|epistle)\b/.test(lower) || (other && BOOK_I18N.test(lower));
  const wantsStructure = STRUCTURE_RE.test(lower) || (other && STRUCTURE_I18N.test(lower));
  const wantsPlace = !wantsStructure && (/\b(fit|place|book|letter|gospel|flow|rest of|broader|bigger|canon|story|where does)\b/.test(lower) || (other && PLACE_I18N.test(lower)));
  const wantsCanon = /\b(canon|bigger story|big picture|whole bible|biblical story|storyline|broader story)\b/.test(lower) || (other && CANON_I18N.test(lower));
  if (lit) {
    const cats = cueCategories(lower, cues(LITERARY_CUES, LITERARY_CUES_I18N, locale));
    const q = queryTokens(lower);
    const ranked = lit.features
      .map((f: LiteraryFeature, i) => ({ f, i, score: (cats.get(f.type) ?? 0) + overlap(q, [f.title, ...f.tags]) * 1.5 }))
      .sort((a, b) => b.score - a.score || a.i - b.i);
    const top = ranked[0] && (ranked[0].score > 0 || (!wantsPlace && !wantsCanon)) ? ranked[0].f : undefined;
    const blocks: MessageBlock[] = [];
    // "What is the structure of this passage?" → the passage's own outline first (the book's, when the book is asked about)
    const outline = wantsStructure ? (wantsBook ? lit.bookOutline : (lit.passageOutline ?? [])) : [];
    const outlineName =
      wantsBook && study.passage
        ? locale === 'en'
          ? getBook(study.passage.book).name
          : bookName(study.passage.book, locale)
        : study.kind === 'topic' && study.passage
          ? formatRef(study.passage, 'long', locale)
          : study.title;
    if (outline.length >= 2) {
      blocks.push(para(t('lit.parts', { name: outlineName, count: outline.length })));
      blocks.push(list(outline.map((s) => `${tok.ref(s.ref)} — ${s.label}${s.current && wantsBook ? t('lit.thisPassage') : ''}`)));
    } else if (wantsCanon && lit.placeInCanon) blocks.push(para(excerpt(lit.placeInCanon.text, 70)));
    else if (wantsPlace || !top) {
      const argument = lit.argument && (/\b(argument|flow)\b/.test(lower) || (other && /\b(argument\w*|fluxo|flujo|fil)\b/.test(lower)));
      blocks.push(para(excerpt((argument ? lit.argument! : lit.placeInBook).text, 70)));
    }
    if (top) blocks.push(para(`${outline.length >= 2 ? t('lit.featureStandsOut') : ''}**${asSentence(top.title)}** ${excerpt(top.description, 55)}`));
    const current = lit.bookOutline.find((x) => x.current);
    return {
      blocks,
      focus: {
        section: 'literary-context',
        ...(top ? { expandIds: [top.id], pinIds: [top.id] } : {}),
        ...(top?.verses?.length ? { highlightVerses: top.verses.slice(0, 6) } : {}),
        reason: t('reason.fromQuestion', {
          what:
            outline.length >= 2
              ? t('lit.reasonOutline', { name: outlineName })
              : top
                ? top.title
                : t('lit.reasonWhere', { title: study.title, current: current ? current.label : 'none' }),
        }),
      },
      ...(outline.length >= 2 ? { updates: [{ section: 'literary-context' as const, label: t('lit.showedOutline', { name: outlineName }) }] } : {}),
      citations: mergeCitations(lit.placeInBook.provenance.citations, top?.provenance.citations, wantsCanon ? lit.placeInCanon?.provenance.citations : undefined),
      suggestions: [t('suggest.restOfBook'), t('suggest.keyWords')],
      steps: [
        step(
          'Literary context',
          t('trace.literaryRanked', {
            outline: outline.length >= 2 ? (wantsBook ? 'book' : 'passage') : 'none',
            parts: outline.length,
            count: lit.features.length,
            top: top ? top.id : 'none',
          }),
          curatedPid(study),
        ),
      ],
    };
  }
  // Library: the Tyndale notes' units for structure; else canon metadata + book introduction.
  if (!study.passage) {
    return { blocks: [para(t('lit.noNotes'))], steps: [], declined: true };
  }
  if (wantsStructure && !wantsBook) {
    const units = await libraryStructure(env, study);
    if (units) return units;
  }
  const info = getBook(study.passage.book);
  const name = locale === 'en' ? info.name : bookName(info.id, locale);
  const facts = t('lit.bookFacts', {
    book: name,
    section: t(`canon.${info.section}` as MessageKey<'engine'>),
    genre: t(`genre.${info.genre}` as MessageKey<'engine'>),
    chapters: info.chapters,
    author: personName(info.traditionalAuthor, locale),
  });
  const intro = await bookIntroReply(env, study, t('lit.libraryLead', { facts }), wantsStructure ? 'structure' : 'overview');
  if (intro) {
    intro.focus = { ...intro.focus, reason: t('reason.fromQuestion', { what: t('lit.reasonSetting', { book: name }) }) };
    return intro;
  }
  return {
    blocks: [para(t('lit.libraryFallback', { facts, section: tok.section('commentary') }))],
    focus: { section: 'commentary' },
    steps: [step('Literary context', t('trace.canonOnly'), 'domain:books')],
  };
}

/* ------------------------------------------------------------------ */
/* Theology                                                            */
/* ------------------------------------------------------------------ */

export async function respondTheology(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study!;
  const lower = env.parsed.lower;
  const term = env.intent.slots.term;
  const concept = activeConcept(env);
  const cats = cueCategories(locale === 'en' ? (term ?? lower) : fold(term ?? lower), cues(THEOLOGY_CUES, THEOLOGY_CUES_I18N, locale));
  const q = queryTokens(term ?? lower);
  const verse = env.intent.slots.verse;
  const ranked = study.theology
    .map((t: TheologyTheme, i) => {
      let score = (cats.get(t.category) ?? 0) + overlap(q, [t.title, ...t.tags]) * 1.5;
      if (term) score += 2 * bestPhraseScore(term, [t.title, ...t.tags]);
      if (concept?.themeIds.includes(t.id) && (env.parsed.refersToContext || !term)) score += 2;
      if (verse && t.keyVerses.some((r) => refIncludesVerse(r, verse))) score += 1;
      return { t, i, score };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i);
  if (ranked.length) {
    const top = ranked[0].score > 0 ? ranked.filter((r, i) => i === 0 || (i === 1 && r.score >= ranked[0].score * 0.75)).slice(0, 2) : ranked.slice(0, 2);
    const blocks = top.map((r) =>
      para(`**${asSentence(r.t.title)}** ${excerpt(r.t.summary, 50)}${r.t.keyVerses.length ? ` ${t('theo.see', { refs: r.t.keyVerses.slice(0, 2).map(tok.ref).join(', ') })}` : ''}`),
    );
    const related = study.perspectives.find((p) => top.some((r) => p.tags.some((tag) => r.t.tags.includes(tag))));
    if (related) blocks.push(para(t('theo.differ', { question: related.question })));
    return {
      blocks,
      focus: { section: 'theology', expandIds: top.map((r) => r.t.id), pinIds: top.map((r) => r.t.id), reason: t('reason.fromQuestion', { what: top[0].t.title }) },
      citations: mergeCitations(...top.map((r) => r.t.provenance.citations)),
      suggestions: [related ? t('suggest.interpretationsPassage') : t('suggest.commentatorsThis'), t('suggest.crossRefs')],
      steps: [step('Theology', t('trace.themesRanked', { count: study.theology.length, top: top.map((r) => r.t.id).join(', ') }), curatedPid(study))],
    };
  }
  // No curated themes (library studies): a topic answers from its key passages, a debate the question names,
  // or its orientation; a library passage points to the notes.
  const fromPassages = respondFromKeyPassages(env);
  if (fromPassages) return fromPassages;
  const debate = study.perspectives.length ? searchStudy(study, env.message).find((h) => h.type === 'perspective') : undefined;
  if (debate) return respondPerspectives({ ...env, intent: { ...env.intent, slots: { ...env.intent.slots, term: debate.title } } });
  const orientation = study.topic ? topicDefinitionDraft(study, `${env.message} ${study.topic.name}`, locale) : undefined;
  if (orientation) return orientation;
  const titles = safeTitles(env);
  const name = studyName(study, locale);
  const section = tok.section('commentary');
  return {
    blocks: [para(titles.length ? t('theo.libraryCurated', { name, kind: study.kind, title: study.title, section, studies: listJoin(titles, locale) }) : t('theo.library', { name, kind: study.kind, title: study.title, section }))],
    focus: { section: 'commentary' },
    suggestions: [t('suggest.classicCommentators'), ...titles.slice(0, 1).map((x) => t('suggest.study', { ref: x }))],
    steps: [step('Theology', t('trace.noThemes'), curatedPid(study))],
    declined: true,
  };
}

function safeTitles(env: ResponderEnv): string[] {
  try {
    return env.providers.studies.list(loc(env)).map((s) => s.title);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Perspectives                                                        */
/* ------------------------------------------------------------------ */

const TRADITION_WORDS: [RegExp, RegExp][] = [
  [/\b(reformed|calvinis\w*|reformad\w*|reforme\w*)\b/, /reformed|calvin|reformad|réformé|reforme/i],
  [/\barminian\w*|\bwesleyan\w*|\bmethodist\w*|\barminiano\w*|\barminien\w*|\bwesleyano\w*|\bwesleyen\w*|\bmetodist\w*|\bmethodiste\w*/, /arminian|wesleyan|methodist|arminian|metodist|arminien|wesleyen|méthodiste/i],
  [/\bcatholic\w*|\bcatolic\w*|\bcatholique\w*/, /catholic|católic|catolic|catholique/i],
  [/\borthodox\w*|\bortodox\w*/, /orthodox|ortodox/i],
  [/\blutheran\w*|\bluteran\w*|\bluther\w*/, /lutheran|luteran|luthérien|lutherien/i],
];

export async function respondPerspectives(env: ResponderEnv): Promise<ReplyDraft> {
  const locale = loc(env);
  const t = tr(env);
  const study = env.study!;
  const sets = study.perspectives;
  if (sets.length === 0) {
    const library = study.depth === 'library';
    const keyPassagesNext = study.kind === 'topic' && !study.commentary.length;
    const text = library
      ? t('persp.library', { kind: study.kind, next: keyPassagesNext ? 'keyPassages' : 'notes', section: tok.section(keyPassagesNext ? 'key-passages' : 'commentary') })
      : t(study.theology.length ? 'persp.noneTheology' : 'persp.none', {
          name: studyName(study, locale),
          kind: study.kind,
          title: study.title,
          theology: tok.section('theology'),
          commentary: tok.section('commentary'),
        });
    return {
      blocks: [para(text)],
      focus: { section: study.theology.length ? 'theology' : study.kind === 'topic' && !study.commentary.length ? 'key-passages' : 'commentary' },
      suggestions: [t('suggest.classicCommentators'), t('suggest.background')],
      steps: [step('Perspectives', t('trace.noPerspectives'), curatedPid(study))],
      declined: true,
    };
  }
  const concept = activeConcept(env);
  const term = env.intent.slots.term;
  const lower = env.parsed.lower;
  const q = queryTokens(lower);
  const ranked = sets
    .map((s, i) => {
      let score = 0;
      if (concept?.perspectiveSetIds.includes(s.id)) score += 3;
      if (term) score += 2 * bestPhraseScore(term, [s.question, ...s.tags]);
      score += overlap(q, [s.question, ...s.tags]);
      for (const [cue, trad] of TRADITION_WORDS) if (cue.test(lower) && s.perspectives.some((p) => trad.test(p.tradition))) score += 1;
      const asked = env.intent.slots.passage;
      if (asked && s.perspectives.some((p) => p.keyTexts?.some((k) => refsOverlap(k, asked)))) score += 3;
      return { s, i, score };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i);
  const set = ranked[0].s;
  const blocks = [
    para(`**${set.question}** — ${t(`persp.consensus.${set.consensus}` as MessageKey<'engine'>)}.`),
    list(set.perspectives.map((p) => `**${p.tradition}** — ${p.label}`)),
  ];
  if (set.commonGround) blocks.push(para(`${t('persp.commonGround')} ${excerpt(set.commonGround, set.perspectives.length > 3 ? 22 : 40)}`));
  return {
    blocks,
    focus: { section: 'theology', expandIds: [set.id], pinIds: [set.id], reason: t('persp.reason', { question: set.question }) },
    citations: mergeCitations(set.provenance.citations, ...set.perspectives.map((p) => p.provenance.citations)),
    suggestions: [t('suggest.commentatorsThis'), t('suggest.crossRefs')],
    steps: [step('Perspectives', t('trace.perspectiveSets', { count: sets.length, id: set.id }), curatedPid(study))],
  };
}
