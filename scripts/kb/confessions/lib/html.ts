/**
 * A small, tolerant HTML/XML (ThML) parser and text extraction helpers.
 * No dependencies: enough structure for the handful of source sites we read
 * (CCEL ThML, opc.org, bookofconcord.org, newadvent.org, Wikisource, reformedreader.org).
 */

export interface El {
  tag: string;
  attrs: Record<string, string>;
  children: Node[];
  parent?: El;
}
export type Node = El | string;

const VOID = new Set(['br', 'hr', 'img', 'meta', 'link', 'input', 'pb', 'col', 'area', 'base', 'wbr', 'source', 'param', 'embed']);
const RAW = new Set(['script', 'style']);
/** opening one of these implicitly closes an open <p> */
const CLOSES_P = new Set(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'ul', 'ol', 'blockquote', 'center', 'pre', 'dl', 'hr', 'form']);

/* ---------------- entities ---------------- */

const NAMED: Record<string, string> = {
  nbsp: '\u00a0', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', sbquo: '‚', bdquo: '„',
  mdash: '—', ndash: '–', hellip: '…', middot: '·', bull: '•', dagger: '†', Dagger: '‡',
  sect: '§', para: '¶', copy: '©', reg: '®', deg: '°', laquo: '«', raquo: '»',
  iexcl: '¡', iquest: '¿', times: '×', divide: '÷', frac12: '½', frac14: '¼', frac34: '¾',
  sup1: '¹', sup2: '²', sup3: '³', prime: '′', Prime: '″', thinsp: '\u2009', ensp: '\u2002', emsp: '\u2003', shy: '',
  zwj: '', zwnj: '', lrm: '', rlm: '',
  aacute: 'á', Aacute: 'Á', agrave: 'à', Agrave: 'À', acirc: 'â', Acirc: 'Â', auml: 'ä', Auml: 'Ä', atilde: 'ã', Atilde: 'Ã', aring: 'å', Aring: 'Å',
  aelig: 'æ', AElig: 'Æ', ccedil: 'ç', Ccedil: 'Ç',
  eacute: 'é', Eacute: 'É', egrave: 'è', Egrave: 'È', ecirc: 'ê', Ecirc: 'Ê', euml: 'ë', Euml: 'Ë',
  iacute: 'í', Iacute: 'Í', igrave: 'ì', Igrave: 'Ì', icirc: 'î', Icirc: 'Î', iuml: 'ï', Iuml: 'Ï',
  ntilde: 'ñ', Ntilde: 'Ñ',
  oacute: 'ó', Oacute: 'Ó', ograve: 'ò', Ograve: 'Ò', ocirc: 'ô', Ocirc: 'Ô', ouml: 'ö', Ouml: 'Ö', otilde: 'õ', Otilde: 'Õ', oslash: 'ø', Oslash: 'Ø',
  oelig: 'œ', OElig: 'Œ', szlig: 'ß',
  uacute: 'ú', Uacute: 'Ú', ugrave: 'ù', Ugrave: 'Ù', ucirc: 'û', Ucirc: 'Û', uuml: 'ü', Uuml: 'Ü',
  yacute: 'ý', Yacute: 'Ý', yuml: 'ÿ', Yuml: 'Ÿ', thorn: 'þ', THORN: 'Þ', eth: 'ð', ETH: 'Ð',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ',
  nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', rho: 'ρ', sigma: 'σ', sigmaf: 'ς', tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Alpha: 'Α', Beta: 'Β', Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
};

/** Windows-1252 code points 128–159 that pages emit as numeric references (&#151; = em dash). */
const CP1252: Record<number, string> = {
  128: '€', 130: '‚', 131: 'ƒ', 132: '„', 133: '…', 134: '†', 135: '‡', 136: 'ˆ', 137: '‰', 138: 'Š', 139: '‹', 140: 'Œ', 142: 'Ž',
  145: '‘', 146: '’', 147: '“', 148: '”', 149: '•', 150: '–', 151: '—', 152: '˜', 153: '™', 154: 'š', 155: '›', 156: 'œ', 158: 'ž', 159: 'Ÿ',
};

export function decodeEntities(s: string): string {
  if (!s.includes('&')) return s;
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);?/g, (m, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      if (!Number.isFinite(code)) return m;
      if (code >= 128 && code <= 159) return CP1252[code] ?? '';
      if (code === 0x200b || code === 0xfeff) return '';
      try {
        return String.fromCodePoint(code);
      } catch {
        return m;
      }
    }
    const v = NAMED[body];
    return v !== undefined ? v : m;
  });
}

/* ---------------- parser ---------------- */

export function parseHtml(src: string, opts: { xml?: boolean } = {}): El {
  const root: El = { tag: '#root', attrs: {}, children: [] };
  const stack: El[] = [root];
  const top = () => stack[stack.length - 1];
  const lower = (t: string) => (opts.xml ? t : t.toLowerCase());
  const tagRe = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<![^>]*>|<\?[\s\S]*?\?>|<\/\s*([a-zA-Z][\w:.-]*)\s*>|<([a-zA-Z][\w:.-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
  let pos = 0;
  let m: RegExpExecArray | null;
  const pushText = (t: string) => {
    if (t) top().children.push(decodeEntities(t));
  };
  while ((m = tagRe.exec(src))) {
    pushText(src.slice(pos, m.index));
    pos = tagRe.lastIndex;
    if (m[1] !== undefined) {
      top().children.push(m[1]);
      continue;
    }
    if (m[2]) {
      const name = lower(m[2]);
      // close the nearest matching open element; ignore stray end tags
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === name) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    if (!m[3]) continue; // comment, doctype, PI
    const name = lower(m[3]);
    const attrs: Record<string, string> = {};
    const attrRe = /([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let a: RegExpExecArray | null;
    while ((a = attrRe.exec(m[4] ?? ''))) attrs[a[1].toLowerCase()] = decodeEntities(a[2] ?? a[3] ?? a[4] ?? '');
    if (!opts.xml && CLOSES_P.has(name)) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === 'p') {
          stack.length = i;
          break;
        }
        if (['div', 'td', 'th', 'li', 'blockquote', 'table'].includes(stack[i].tag)) break;
      }
    }
    if (!opts.xml && (name === 'li' || name === 'tr' || name === 'td' || name === 'th')) {
      // implicit close of an unclosed sibling: <li> within its list, <tr> within its table, <td>/<th> within its row
      const siblings = name === 'li' ? ['li'] : name === 'tr' ? ['tr'] : ['td', 'th'];
      const scope = name === 'li' ? ['ul', 'ol'] : name === 'tr' ? ['table', 'tbody', 'thead', 'tfoot'] : ['tr'];
      for (let i = stack.length - 1; i > 0; i--) {
        if (scope.includes(stack[i].tag)) break;
        if (siblings.includes(stack[i].tag)) {
          stack.length = i;
          break;
        }
      }
    }
    const el: El = { tag: name, attrs, children: [], parent: top() };
    top().children.push(el);
    if (m[5] === '/' || (!opts.xml && VOID.has(name)) || (opts.xml && VOID.has(name) && m[5] === '/')) continue;
    if (!opts.xml && RAW.has(name)) {
      const end = src.toLowerCase().indexOf(`</${name}`, pos);
      const stop = end < 0 ? src.length : end;
      el.children.push(src.slice(pos, stop));
      const close = src.indexOf('>', stop);
      pos = close < 0 ? src.length : close + 1;
      tagRe.lastIndex = pos;
      continue;
    }
    stack.push(el);
  }
  pushText(src.slice(pos));
  return root;
}

/* ---------------- queries ---------------- */

export function isEl(n: Node | undefined): n is El {
  return typeof n === 'object' && n !== null;
}

export function walk(node: El, visit: (el: El) => boolean | void): void {
  for (const c of node.children) {
    if (!isEl(c)) continue;
    if (visit(c) === false) continue;
    walk(c, visit);
  }
}

export function findAll(node: El, pred: (el: El) => boolean): El[] {
  const out: El[] = [];
  walk(node, (el) => {
    if (pred(el)) out.push(el);
  });
  return out;
}

export function findFirst(node: El, pred: (el: El) => boolean): El | undefined {
  let found: El | undefined;
  const rec = (n: El): boolean => {
    for (const c of n.children) {
      if (!isEl(c)) continue;
      if (pred(c)) {
        found = c;
        return true;
      }
      if (rec(c)) return true;
    }
    return false;
  };
  rec(node);
  return found;
}

export const byId = (id: string) => (el: El) => el.attrs.id === id;
export const byTag = (...tags: string[]) => (el: El) => tags.includes(el.tag);
export const byClass = (cls: string) => (el: El) => (el.attrs.class ?? '').split(/\s+/).includes(cls);

/* ---------------- text ---------------- */

const BLOCK = new Set([
  'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'table', 'ul', 'ol', 'blockquote', 'center', 'pre', 'dd', 'dt', 'dl',
  'section', 'article', 'header', 'footer', 'main', 'nav', 'td', 'th', 'div1', 'div2', 'div3', 'div4', 'div5', 'div6', 'hr',
]);

export interface TextOptions {
  /** drop these elements (and their content) */
  skip?: (el: El) => boolean;
  /** treat these additional elements as block boundaries */
  block?: (el: El) => boolean;
}

/**
 * Plain text of a subtree: source whitespace collapses to single spaces (as a browser
 * renders it), block boundaries become paragraph breaks ("\n\n"), <br> a line break.
 */
export function textOf(node: Node, opts: TextOptions = {}): string {
  const parts: string[] = [];
  const rec = (n: Node) => {
    if (!isEl(n)) {
      parts.push(n.replace(/\s+/g, ' '));
      return;
    }
    if (n.tag === 'script' || n.tag === 'style') return;
    if (opts.skip?.(n)) return;
    if (n.tag === 'br') {
      parts.push(LINE);
      return;
    }
    const block = BLOCK.has(n.tag) || opts.block?.(n) === true;
    if (block) parts.push(PARA);
    for (const c of n.children) rec(c);
    if (block) parts.push(PARA);
  };
  rec(node);
  return fromMarked(parts.join(''));
}

const PARA = '\u0001';
const LINE = '\u0002';

/** Turn text containing PARA/LINE markers into normalised paragraphs. */
function fromMarked(s: string): string {
  return normalizeText(
    s
      .replace(/[ \t]*\u0002[ \t]*/g, '\n')
      .replace(/\s*\u0001[\s\u0001]*/g, '\n\n'),
  );
}

/** Normalise extracted text: NFC, no NBSP/zero-width, single spaces, paragraphs separated by one blank line. */
export function normalizeText(s: string): string {
  return s
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u00a0\u2002\u2003\u2009\u202f]/g, ' ')
    .replace(/[\u200b\u200c\u200d\ufeff\u00ad]/g, '')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .join('\n\n')
    .trim();
}

/** Collapse all whitespace (including line breaks) to single spaces. */
export function oneLine(s: string): string {
  return normalizeText(s).replace(/\s+/g, ' ').trim();
}

/** Remove `el` from its parent (in place). */
export function detach(el: El): void {
  const p = el.parent;
  if (!p) return;
  const i = p.children.indexOf(el);
  if (i >= 0) p.children.splice(i, 1);
}

/* ---------------- flow blocks ---------------- */

export interface FlowBlock {
  /** true for elements matched by `isHeading` */
  heading: boolean;
  text: string;
  el?: El;
}

/**
 * The document as a flat sequence of headings and paragraphs, for loosely structured pages
 * (headings as <center>/<b>, paragraphs as bare text between <p> tags). Every block-level
 * element starts a new paragraph; `isHeading` elements become heading blocks (not descended).
 */
export function flowBlocks(root: El, opts: { isHeading: (el: El) => boolean; skip?: (el: El) => boolean }): FlowBlock[] {
  const out: FlowBlock[] = [];
  let buf: string[] = [];
  const flush = () => {
    const t = fromMarked(buf.join(''));
    buf = [];
    if (t) for (const p of t.split('\n\n')) out.push({ heading: false, text: p });
  };
  const rec = (n: Node) => {
    if (!isEl(n)) {
      buf.push(n.replace(/\s+/g, ' '));
      return;
    }
    if (n.tag === 'script' || n.tag === 'style' || opts.skip?.(n)) return;
    if (opts.isHeading(n)) {
      flush();
      const t = oneLine(textOf(n, { skip: opts.skip }));
      if (t) out.push({ heading: true, text: t, el: n });
      return;
    }
    if (n.tag === 'br') {
      buf.push(LINE);
      return;
    }
    const block = BLOCK.has(n.tag);
    if (block) flush();
    for (const c of n.children) rec(c);
    if (block) flush();
  };
  rec(root);
  flush();
  return out;
}
