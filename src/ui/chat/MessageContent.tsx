/**
 * Renders assistant message blocks and the inline token markup inside them
 * (references, key words, section links, sources, bold/italic).
 * Nothing is rendered that cannot be resolved: unknown tokens fall back to
 * plain text, unknown commentary ids render nothing. Tokens and quotations
 * resolve against the message's own study, so older messages stay intact
 * after the conversation moves on. Inline Greek/Hebrew is language-tagged.
 */
import { ArrowUpRight, CornerDownRight, Info, TriangleAlert } from 'lucide-react';
import { useMemo } from 'react';
import type { KeyWord, MessageBlock, SectionId } from '../../domain/models';
import { parseRefKey } from '../../domain/reference';
import { useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { useProviders } from '../../providers/ProvidersContext';
import { useSessionActions } from '../../state/session';
import { RefChip } from '../common/RefChip';
import { SourceChip } from '../common/SourceChip';
import { ProvenanceTag } from '../primitives';
import { moveFocusToStudyIfLost } from '../shell/paneFocus';
import { displayProvenance, entryLink, entryLocator, presentEntry, stripOuterQuotes } from '../study/commentary/presentation';
import { withElements } from '../hooks/richText';
import { SECTION_META } from '../study/types';
import { useMessageScope, useMessageStudy } from './chatContext';
import { parseInline, type InlineNode } from './inlineTokens';
import styles from './MessageContent.module.css';
import { ScriptText } from '../common/ScriptText';
import { displayYear } from '../common/attribution';

/* ------------------------------------------------------------------ */
/* Inline                                                              */
/* ------------------------------------------------------------------ */

/** Paragraph-level text with inline tokens rendered as interactive chips. */
export function InlineText({ text }: { text: string }) {
  const nodes = useMemo(() => parseInline(text), [text]);
  return <InlineNodes nodes={nodes} />;
}

function InlineNodes({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.type) {
          case 'text':
            return <ScriptText key={i} text={n.text} />;
          case 'strong':
            return (
              <strong key={i}>
                <InlineNodes nodes={n.children} />
              </strong>
            );
          case 'em':
            return (
              <em key={i}>
                <InlineNodes nodes={n.children} />
              </em>
            );
          case 'token':
            return <Token key={i} kind={n.kind} value={n.value} label={n.label} />;
        }
      })}
    </>
  );
}

function Token({ kind, value, label }: { kind: 'ref' | 'word' | 'section' | 'source'; value: string; label?: string }) {
  switch (kind) {
    case 'ref': {
      const passage = parseRefKey(value);
      if (!passage) return <>{label ?? value}</>;
      return (
        <span className={styles.token}>
          <RefChip passage={passage} style="long" label={label} />
        </span>
      );
    }
    case 'word':
      return <WordToken id={value} label={label} />;
    case 'section':
      return <SectionToken id={value} label={label} />;
    case 'source':
      return (
        <span className={styles.token}>
          <SourceChip citation={{ sourceId: value }} />
        </span>
      );
  }
}

function langAttrs(word: KeyWord): { lang: string; dir?: 'rtl' } {
  if (word.language === 'greek') return { lang: 'grc' };
  return { lang: word.language === 'hebrew' ? 'hbo' : 'arc', dir: 'rtl' };
}

function WordToken({ id, label }: { id: string; label?: string }) {
  const { focusDashboard, openInspector } = useSessionActions();
  const t = useT('chat');
  const { study, live: sameStudy } = useMessageStudy();
  const word = study?.keyWords.find((w) => w.id === id);
  const live = !!word && sameStudy;
  if (!word) return <ScriptText text={label ?? id} />;

  const content = (
    <>
      <span className={styles.lemma} {...langAttrs(word)}>
        {word.lemma}
      </span>
      <span className={styles.gloss}>{label ?? word.english}</span>
    </>
  );
  if (!live) {
    return (
      <span className={cx(styles.token, styles.word, styles.wordStatic)} title={t('word.earlier', { translit: word.transliteration })}>
        {content}
      </span>
    );
  }
  return (
    <span className={styles.token}>
      <button
        type="button"
        className={styles.word}
        aria-label={t('word.open', { translit: word.transliteration, gloss: word.english })}
        onClick={() => {
          focusDashboard({ section: 'original-languages', highlightWordIds: [word.id], expandIds: [word.id] });
          openInspector({ type: 'word', keyWordId: word.id });
        }}
      >
        {content}
      </button>
    </span>
  );
}

function SectionToken({ id, label }: { id: string; label?: string }) {
  const { revisit } = useSessionActions();
  const t = useT('chat');
  const tc = useT('common');
  const { messageId } = useMessageScope();
  const { live } = useMessageStudy();
  if (!(id in SECTION_META)) return <ScriptText text={label ?? id} />;
  const section = id as SectionId;
  const open = async () => {
    await revisit(messageId, section); // reopens the message's study first if it is an earlier one
    moveFocusToStudyIfLost(section);
  };
  return (
    <button
      type="button"
      className={styles.sectionLink}
      onClick={() => void open()}
      title={live ? undefined : t('section.earlier')}
    >
      <CornerDownRight aria-hidden="true" className={styles.sectionIcon} />
      <ScriptText text={label ?? tc(`section.${section}`)} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

export function MessageBlocks({ blocks }: { blocks: MessageBlock[] }) {
  return (
    <div className={styles.blocks}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: MessageBlock }) {
  const t = useT('chat');
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={styles.paragraph}>
          <InlineText text={block.text} />
        </p>
      );
    case 'scripture':
      return (
        <figure className={styles.scripture}>
          <blockquote className={styles.scriptureText}>{block.text}</blockquote>
          <figcaption className={styles.scriptureCaption}>
            <RefChip passage={block.ref} style="long" />
            <span className={styles.translation}>{block.translation}</span>
            <ProvenanceTag kind="scripture" />
          </figcaption>
        </figure>
      );
    case 'quote':
      return <QuoteBlock commentaryId={block.commentaryId} />;
    case 'note': {
      const caution = block.tone === 'caution';
      const Icon = caution ? TriangleAlert : Info;
      return (
        <div className={cx(styles.note, caution && styles.caution)} role="note">
          <Icon aria-hidden="true" className={styles.noteIcon} />
          <p>
            <span className={styles.noteLabel}>{caution ? t('note.caution') : t('note.note')} · </span>
            <InlineText text={block.text} />
          </p>
        </div>
      );
    }
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
  }
}

/**
 * A commentary entry quoted in chat, resolved in the message's own study. It follows
 * exactly the rule the Commentary section uses (study/commentary/presentation.ts):
 * quotation marks only for verified exact words from a source whose license allows
 * quoting; unverified wording becomes a flagged summary; wording from summary-only
 * or unlisted sources is withheld.
 */
function QuoteBlock({ commentaryId }: { commentaryId: string }) {
  const { openInspector } = useSessionActions();
  const t = useT('chat');
  const tc = useT('common');
  const tp = useT('provenance');
  const { sources } = useProviders();
  const { study } = useMessageStudy();
  const entry = study?.commentary.find((c) => c.id === commentaryId);
  if (!entry) return null;
  const author = sources.getAuthor(entry.authorId);
  const source = sources.getSource(entry.sourceId);
  const presentation = presentEntry(entry, source);
  const provenance = displayProvenance(entry, presentation);
  const url = entryLink(entry, source);
  const locator = entryLocator(entry, source);
  const year = displayYear(source?.year);
  const quoted = presentation.mode === 'quotation';
  const work = source?.title ?? t('quote.unlistedWork');

  return (
    <figure className={cx(styles.quote, !quoted && styles.summary)}>
      {entry.lead && (
        <p className={styles.quoteLead}>
          <ScriptText text={entry.lead} />
        </p>
      )}
      {quoted && (
        <blockquote className={styles.quoteText} cite={url} lang="en">
          <p>
            “<ScriptText text={stripOuterQuotes(entry.text)} />”
          </p>
        </blockquote>
      )}
      {quoted && entry.translatedText && (
        <p className={styles.quoteTranslation}>
          <span className={styles.quoteTranslationLabel}>{tp('freeTranslation')}</span> <ScriptText text={entry.translatedText} />
        </p>
      )}
      {(presentation.mode === 'summary' || presentation.mode === 'unverified-summary') && (
        <div className={styles.summaryBody}>
          <p className={styles.summaryLabel}>
            {withElements(t('quote.summaryOf'), { work: <cite>{work}</cite> })}
            {presentation.mode === 'unverified-summary' && <span className={styles.unverified}> · {tp('verification.unverified')}</span>}
          </p>
          <p className={styles.summaryText}>
            <ScriptText text={entry.text} />
          </p>
        </div>
      )}
      {presentation.mode === 'withheld' && (
        <p className={styles.withheld}>
          <TriangleAlert aria-hidden="true" className={styles.withheldIcon} />
          <span>
            {presentation.reason === 'license' ? t('quote.withheld.license', { work }) : t('quote.withheld.unlisted')} {t('quote.followLink')}
          </span>
        </p>
      )}
      <figcaption className={styles.attribution}>
        <span>
          —{' '}
          {author ? (
            <button type="button" className={styles.authorLink} onClick={() => openInspector({ type: 'author', authorId: author.id })}>
              {author.name}
            </button>
          ) : (
            t('quote.unknownAuthor')
          )}
          {source && (
            <>
              , <cite>{source.title}</cite>
            </>
          )}
          {year && ` (${year})`}
          {locator && (
            <>
              , <ScriptText text={locator} />
            </>
          )}
        </span>
        {url && (
          <a className={styles.readSource} href={url} target="_blank" rel="noreferrer noopener">
            {t('quote.readSource')}
            <ArrowUpRight aria-hidden="true" />
            <span className="visually-hidden"> {tc('opensInNewTab')}</span>
          </a>
        )}
      </figcaption>
      <ProvenanceTag provenance={provenance} showVerification />
    </figure>
  );
}
