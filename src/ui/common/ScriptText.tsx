import { Fragment, type ReactNode } from 'react';

/**
 * Greek and Hebrew inside English prose ("Focused on κατάκριμα", "רַב־חֶסֶד וֶאֱמֶת")
 * need their own language so screen readers switch voice, the right fonts apply, and
 * Hebrew is isolated from neighbouring digits and brackets (docs/DESIGN.md §2, §10).
 * These helpers only wrap runs of text — the words themselves are never changed.
 */

export type ScriptRun = { text: string; script: 'greek' | 'hebrew' | null };

const GREEK = '\\u0370-\\u03FF\\u1F00-\\u1FFF';
const HEBREW = '\\u0591-\\u05F4\\uFB1D-\\uFB4F';
/** Greek letters (with combining marks), joined across spaces, hyphens and apostrophes when Greek follows. */
const GREEK_RUN = `[${GREEK}](?:[${GREEK}\\u0300-\\u036F]|[\\s\\-’'](?=[${GREEK}]))*`;
/** Hebrew letters and points (maqaf and sof pasuq included), joined across spaces when Hebrew follows. */
const HEBREW_RUN = `[${HEBREW}](?:[${HEBREW}]|\\s(?=[${HEBREW}]))*`;
const RUNS = new RegExp(`(${GREEK_RUN})|(${HEBREW_RUN})`, 'gu');
const ANY = new RegExp(`[${GREEK}${HEBREW}]`, 'u');

/** Split text into plain, Greek and Hebrew runs (concatenating the runs gives back the text). */
export function splitScripts(text: string): ScriptRun[] {
  if (!ANY.test(text)) return [{ text, script: null }];
  const runs: ScriptRun[] = [];
  let last = 0;
  for (const m of text.matchAll(RUNS)) {
    const at = m.index ?? 0;
    if (at > last) runs.push({ text: text.slice(last, at), script: null });
    runs.push({ text: m[0], script: m[1] ? 'greek' : 'hebrew' });
    last = at + m[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), script: null });
  return runs;
}

/** Text with its Greek runs as <span lang="grc"> and Hebrew runs as <bdi lang="hbo" dir="rtl">. */
export function renderWithScripts(text: string): ReactNode {
  const runs = splitScripts(text);
  if (runs.length === 1 && runs[0].script == null) return text;
  return runs.map((r, i) =>
    r.script === 'greek' ? (
      <span key={i} lang="grc" className="t-greek">
        {r.text}
      </span>
    ) : r.script === 'hebrew' ? (
      <bdi key={i} lang="hbo" dir="rtl" className="t-hebrew">
        {r.text}
      </bdi>
    ) : (
      <Fragment key={i}>{r.text}</Fragment>
    ),
  );
}

/** Component form of `renderWithScripts`. */
export function ScriptText({ text }: { text: string }) {
  return <>{renderWithScripts(text)}</>;
}
