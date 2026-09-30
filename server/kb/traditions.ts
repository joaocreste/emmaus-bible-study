/**
 * Christian traditions as the knowledge base and the validator recognise them.
 *
 * A perspectives position is labelled with a tradition ("Catholic", "Reformed",
 * "Eastern Orthodox", …) and must cite a text OF that tradition — its confession or
 * catechism, a reference work of that tradition, an author the source registry places
 * in it, or an editor-reviewed curated item naming it. These families are how a
 * free-text label ("Roman Catholic", "Presbyterian", "Wesleyan") is matched to what a
 * text represents (a corpus document's `tradition`, a confession's "[Reformed]" title,
 * an author's registry tradition such as "Reformed (Presbyterian)").
 *
 * Matching is on labels (short strings), never on running prose: "the holy catholic
 * church" in a creed does not make it a Catholic text.
 */

export interface TraditionFamily {
  id: string;
  /** reader-facing name */
  label: string;
  pattern: RegExp;
  /** an umbrella label ("Protestant") is represented by a text of any member family */
  members?: readonly string[];
  /** a label also matching one of these families is not this family ("Lutheran orthodoxy", "Dutch Reformed (Remonstrant)") */
  excludedBy?: readonly string[];
  /** a church tradition whose view needs a representative text (vs. a Jewish school or an interpretive view) */
  church: boolean;
}

export const TRADITION_FAMILIES: readonly TraditionFamily[] = [
  { id: 'catholic', label: 'Catholic', pattern: /\b(?:roman\s+)?catholic(?:s|ism)?\b|\bromish\b|\bpapal\b|\bpapacy\b|\btridentine\b|\bcouncil of trent\b|\bcat[oó]lic(?:[oa]s?|ismo)\b|\bcatholiques?\b|\bcatholicisme\b|\bconc[ií]lio de trento\b|\bconcilio de trento\b|\bconcile de trente\b/i, church: true },
  { id: 'orthodox', label: 'Eastern Orthodox', pattern: /\borthodox(?:es?)?\b|\bortodox[oa]s?\b|\bbyzantine\b|\bbizantin[oa]s?\b/i, excludedBy: ['jewish', 'reformed', 'lutheran', 'protestant', 'evangelical'], church: true },
  { id: 'reformed', label: 'Reformed', pattern: /\breformed\b|\bpresbyterian|\bcalvinis[mt]|\bpuritan|\bcongregationalis|\bhuguenot|\bcovenanter|\breformad[oa]s?\b|(?<![a-zà-ÿ])r[eé]formée?s?(?![a-zà-ÿ])|\bpresbiterian|\bpresbyt[eé]rien|\bpuritain|\bhugueno/i, excludedBy: ['arminian'], church: true },
  { id: 'lutheran', label: 'Lutheran', pattern: /\blutheran|\bbook of concord\b|\baugsburg\b|\bluteran|\bluth[eé]rien|\baugsburgo\b|\baugsbourg\b/i, church: true },
  { id: 'anglican', label: 'Anglican', pattern: /\banglican|\banglicai?n|(?<!methodist )\bepiscopal(?:ian)?\b|\bchurch of england\b|\bthirty-nine articles\b|\bepiscopalian[oa]s?\b|\bigreja da inglaterra\b|\biglesia de inglaterra\b|(?<![a-zà-ÿ])[eé]glise d['’]angleterre\b/i, church: true },
  { id: 'arminian', label: 'Arminian / Methodist / Wesleyan', pattern: /\bmethodis[mt]|\bwesleyan|\barminian|\bremonstrant|\bholiness movement\b|\bnazarene\b|\bmetodis[mt]|(?<![a-zà-ÿ])m[eé]thodis[mt]|\bwesleyen|\barminien|\barminiano/i, church: true },
  { id: 'baptist', label: 'Baptist', pattern: /\bbaptists?\b|\bbatistas?\b|\bbautistas?\b|\bbaptistes?\b/i, church: true },
  { id: 'anabaptist', label: 'Anabaptist / Mennonite', pattern: /\banabaptist|\bmennonite|\bamish\b|\bhutterite|\banabatist|\bmenonit/i, church: true },
  { id: 'pentecostal', label: 'Pentecostal / Charismatic', pattern: /\bpentecostal|\bcharismati|\bpentec[oô]tis|\bcarism[aá]tic/i, church: true },
  { id: 'evangelical', label: 'Evangelical', pattern: /\bevangelical|(?<![a-zà-ÿ])[eé]vang[eé]li(?:c[oa]s?|ques?)\b/i, church: true },
  { id: 'patristic', label: 'Church Fathers', pattern: /\bchurch fathers?\b|\bpatristic|\bearly church\b|\b(?:ante|post)-nicene\b|\bpatr[ií]stic|\bpais da igreja\b|\bpadres de la iglesia\b|\bp[eè]res de l['’][eé]glise\b/i, church: true },
  { id: 'ecumenical', label: 'Ecumenical creeds', pattern: /\becumenical\b|\bnicene\b|\bapostles['’]? creed\b|\bchalcedon|\bathanasian\b/i, church: true },
  {
    id: 'protestant',
    label: 'Protestant',
    pattern: /\bprotestant|\breformation\b|\breforma protestante\b|(?<![a-zà-ÿ])r[eé]forme protestante\b/i,
    members: ['reformed', 'lutheran', 'anglican', 'arminian', 'baptist', 'anabaptist', 'pentecostal', 'evangelical'],
    church: true,
  },
  { id: 'jewish', label: 'Jewish', pattern: /\bjewish\b|\bjudaism\b|\brabbinic|\brabbis?\b|\bpharis|\bhillel\b|\bshammai\b|\bmishnah\b|\btalmud/i, church: false },
];

const BY_ID = new Map(TRADITION_FAMILIES.map((f) => [f.id, f]));

/** Church families a knowledge-base inventory reports on (present or missing). */
export const REPORTED_FAMILIES = ['catholic', 'orthodox', 'reformed', 'lutheran', 'anglican', 'arminian', 'baptist', 'anabaptist', 'pentecostal'] as const;

export function traditionFamily(id: string): TraditionFamily | undefined {
  return BY_ID.get(id);
}

/** Family ids a tradition label names ("Reformed (Presbyterian)" → reformed; "Dutch Reformed (Remonstrant)" → arminian). */
export function familiesOf(label: string | undefined | null): string[] {
  if (!label) return [];
  const hit = TRADITION_FAMILIES.filter((f) => f.pattern.test(label)).map((f) => f.id);
  return hit.filter((id) => !(BY_ID.get(id)?.excludedBy ?? []).some((x) => hit.includes(x)));
}

/**
 * Which families can represent a label: the families it names (an umbrella label with
 * no specific family also accepts its members). `all` = every one of `required` must
 * be represented; otherwise any of `accepted`.
 */
export function requiredFamilies(label: string): { required: string[]; accepted: string[] } {
  const named = familiesOf(label);
  const specific = named.filter((id) => !BY_ID.get(id)?.members);
  if (specific.length) return { required: specific, accepted: specific };
  const accepted = new Set<string>();
  for (const id of named) {
    accepted.add(id);
    for (const m of BY_ID.get(id)?.members ?? []) accepted.add(m);
  }
  return { required: [], accepted: [...accepted] };
}

/** Is this a church-tradition label (as opposed to a Jewish school or an interpretive view)? */
export function isChurchTradition(label: string): boolean {
  return familiesOf(label).some((id) => BY_ID.get(id)?.church);
}
