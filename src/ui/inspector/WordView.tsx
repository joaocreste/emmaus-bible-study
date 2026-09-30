import { BookOpen, MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import type { KeyWord, OriginalLanguage, VerseRef } from '../../domain/models';
import { getBibleVersion, isTranslationId } from '../../domain/translations';
import { verseToPassage } from '../../domain/reference';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { useSession } from '../../state/session';
import type { InspectorTarget } from '../../state/types';
import { useLexiconEntry, usePassage } from '../hooks/data';
import { Badge, Button } from '../primitives';
import { verseText } from '../study/scripture/blocks';
import { KeyWordDetails } from '../study/words/KeyWordDetails';
import { fillSlots, slot } from '../study/types';
import { InEnglish, useEnglishLang } from '../study/words/InEnglish';
import { languageName, sameStrong } from '../study/words/language';
import { LexiconEntryView } from '../study/words/LexiconEntryView';
import { Occurrences } from '../study/words/Occurrences';
import { OriginalScript } from '../study/words/OriginalScript';
import styles from './InspectorViews.module.css';

/** A version's own abbreviation ("BSB", "LSG", "Darby"). */
function getBibleVersionShort(id: Parameters<typeof getBibleVersion>[0]): string | undefined {
  return isTranslationId(id) ? getBibleVersion(id).shortName : undefined;
}

type WordTarget = Extract<InspectorTarget, { type: 'word' }>;

interface WordViewProps {
  target: WordTarget;
  titleId: string;
  /** called after an action that hands over to chat or the dashboard */
  onDone(): void;
}

function isPhone(): boolean {
  return window.matchMedia?.('(max-width: 759px)').matches ?? false;
}

/** Word view: a curated key word (full study) or any Strong's number from the interlinear (lexicon entry). */
export function WordView({ target, titleId, onDone }: WordViewProps) {
  const { study } = useSession();
  const t = useT('inspector');
  const keyWord = target.keyWordId ? study?.keyWords.find((k) => k.id === target.keyWordId) : undefined;
  if (keyWord) return <CuratedWord keyWord={keyWord} titleId={titleId} onDone={onDone} />;
  if (target.strong) return <LexiconWord target={target} strong={target.strong} titleId={titleId} onDone={onDone} />;
  return (
    <div className={styles.view}>
      <h2 id={titleId} className={styles.title}>
        {t('word.notFound.title')}
      </h2>
      <p className={styles.muted}>{t('word.notFound.text')}</p>
    </div>
  );
}

function useAskAboutWord(onDone: () => void) {
  const { send, setMobilePane } = useSession();
  const tw = useT('words');
  const { verse: verseLabel } = useI18n();
  return (word: string, verse?: VerseRef) => {
    void send(verse ? tw('ask.wordIn', { word, ref: verseLabel(verse) }) : tw('ask.word', { word }));
    if (isPhone()) setMobilePane('chat');
    onDone();
  };
}

function CuratedWord({ keyWord: kw, titleId, onDone }: { keyWord: KeyWord; titleId: string; onDone(): void }) {
  const { focusDashboard } = useSession();
  const t = useT('inspector');
  const tw = useT('words');
  const { locale, verse: verseLabel } = useI18n();
  const [lexiconOpen, setLexiconOpen] = useState(true);
  const ask = useAskAboutWord(onDone);
  const verse = kw.anchors[0]?.verse;
  const language = languageName(kw.language, locale);

  return (
    <div className={styles.view}>
      <div className={styles.titleBlock}>
        <h2 id={titleId} className={styles.title}>
          {kw.english}
        </h2>
        <p className={styles.subtitle}>
          {verse ? t('word.subtitleIn', { ref: verseLabel(verse), language }) : t('word.subtitle', { language })}
        </p>
      </div>
      <KeyWordDetails keyWord={kw} variant="panel" lexiconOpen={lexiconOpen} onLexiconOpenChange={setLexiconOpen} occurrenceLimit={20} />
      <div className={styles.actions}>
        <Button variant="primary" size="sm" icon={<MessageSquareText aria-hidden="true" />} onClick={() => ask(kw.english, verse)}>
          {tw('card.ask')}
        </Button>
        {kw.anchors.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<BookOpen aria-hidden="true" />}
            onClick={() => {
              focusDashboard({ section: 'scripture', highlightWordIds: [kw.id], highlightVerses: kw.anchors.map((a) => a.verse) });
              onDone();
            }}
          >
            {tw('card.showInPassage')}
          </Button>
        )}
      </div>
    </div>
  );
}

function languageOfStrong(strong: string): OriginalLanguage {
  return /^g/i.test(strong) ? 'greek' : 'hebrew';
}

function LexiconWord({ target, strong, titleId, onDone }: { target: WordTarget; strong: string; titleId: string; onDone(): void }) {
  const { study, settings, openInspector } = useSession();
  const t = useT('inspector');
  const tw = useT('words');
  const { locale, verse: verseLabel } = useI18n();
  const english = useEnglishLang();
  const entryState = useLexiconEntry(strong);
  const entry = entryState.data ?? undefined;
  const language = entry?.language ?? languageOfStrong(strong);
  const verseState = usePassage(target.verse ? verseToPassage(target.verse) : undefined, settings.translation);
  const ask = useAskAboutWord(onDone);
  const curated = study?.keyWords.find((k) => sameStrong(k.strong, strong));
  const gloss = target.gloss || entry?.gloss;
  const verseLine = verseState.data?.chapters[0]?.verses[0];
  const version = verseState.data ? (getBibleVersionShort(verseState.data.translation) ?? settings.translation) : settings.translation;

  return (
    <div className={styles.view}>
      <div className={styles.titleBlock}>
        <h2 id={titleId} className={`${styles.title} ${styles.titleScript}`}>
          {entry ? (
            <OriginalScript text={entry.lemma} language={language} size="lg" />
          ) : target.surface ? (
            <OriginalScript text={target.surface} language={language} size="lg" />
          ) : (
            strong
          )}
          {gloss && (
            <span className="visually-hidden" lang={english}>
              {' '}
              — {gloss}
            </span>
          )}
        </h2>
        <p className={styles.meta}>
          {entry?.transliteration && <span className="t-translit">{entry.transliteration}</span>}
          {entry?.pronunciation && (
            <span>
              <span lang={english}>/{entry.pronunciation}/</span>
              {english && <> ({tw('details.englishRespelling')})</>}
            </span>
          )}
          <Badge tone="outline" title={t('word.strongTitle')}>
            <span className="visually-hidden">{tw('details.strong')} </span>
            {strong}
          </Badge>
          {entry?.partOfSpeech && <span lang={english}>{entry.partOfSpeech}</span>}
          <span>{languageName(language, locale)}</span>
        </p>
      </div>

      {gloss && (
        <div className={styles.block}>
          <p className={styles.eyebrow}>
            {t('word.gloss')} <InEnglish />
          </p>
          <p className={styles.gloss} lang={english}>
            “{gloss}”
          </p>
        </div>
      )}

      {target.verse && (
        <div className={`${styles.block} ${styles.context}`}>
          <p className={styles.contextLine}>
            <span className={styles.eyebrow}>{t('word.inVerse', { ref: verseLabel(target.verse) })}</span>
            {target.surface && <OriginalScript text={target.surface} language={language} />}
            {target.gloss && <span lang={english}>“{target.gloss}”</span>}
          </p>
          {verseLine && (
            <p className={styles.contextVerse}>
              {verseText(verseLine)} <span className={styles.muted}>({version})</span>
            </p>
          )}
        </div>
      )}

      {curated && (
        <p className={styles.callout}>
          <span>{fillSlots(t('word.callout', { word: slot('word') }), { word: <strong>{curated.english}</strong> })}</span>
          <Button variant="secondary" size="sm" onClick={() => openInspector({ type: 'word', keyWordId: curated.id })}>
            {t('word.openStudy')}
          </Button>
        </p>
      )}

      <div className={styles.block}>
        <p className={styles.eyebrow}>{tw('details.lexicon')}</p>
        <LexiconEntryView strong={strong} />
      </div>

      <div className={styles.block}>
        <p className={styles.eyebrow}>{tw('details.occurrences')}</p>
        <Occurrences strong={strong} language={language} limit={20} />
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          icon={<MessageSquareText aria-hidden="true" />}
          onClick={() => ask(gloss ? gloss : strong, target.verse)}
        >
          {tw('card.ask')}
        </Button>
      </div>
    </div>
  );
}
