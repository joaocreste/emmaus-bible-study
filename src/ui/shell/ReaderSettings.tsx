import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type FocusEvent, type ReactNode } from 'react';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { cx } from '../../lib/cx';
import { FONT_SCALE_STEPS } from '../../state/settings';
import { useSession } from '../../state/session';
import type { ThemePreference } from '../../state/types';
import { translate } from '../../i18n/catalog';
import type { Locale } from '../../i18n/locales';
import { clientMessageId } from '../../inference/client';
import { statusReasonText } from '../../inference/localize';
import type { InferenceStatus } from '../../inference/protocol';
import { describeAvailable, useInferenceStatus } from '../hooks/useInferenceStatus';
import styles from './ReaderSettings.module.css';
import { SegmentedControl } from './SegmentedControl';
import { TranslationSelect } from './TranslationSelect';

const THEME_OPTIONS: { value: ThemePreference; icon: ReactNode }[] = [
  { value: 'system', icon: <Monitor aria-hidden="true" /> },
  { value: 'parchment', icon: <Sun aria-hidden="true" /> },
  { value: 'evening', icon: <Moon aria-hidden="true" /> },
];

/** "Aa" button + non-modal popover: text size, theme, verse numbers (and translation on phone). */
export function ReaderSettings({ showTranslation = false }: { showTranslation?: boolean }) {
  const { settings, updateSettings } = useSession();
  const t = useT('shell');
  const { info } = useI18n();
  const percent = useMemo(() => new Intl.NumberFormat(info.bcp47, { style: 'percent', maximumFractionDigits: 0 }), [info.bcp47]);
  const themeOptions = useMemo(() => THEME_OPTIONS.map((o) => ({ ...o, label: t(`theme.${o.value}`) })), [t]);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const switchLabelId = useId();

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('[role="radio"][tabindex="0"]')?.focus();
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Non-modal: tabbing out of the popover closes it.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && !panelRef.current?.contains(next) && next !== buttonRef.current) setOpen(false);
  };

  return (
    <div className={styles.anchor}>
      <button
        ref={buttonRef}
        type="button"
        className={cx(styles.trigger, open && styles.triggerOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={t('settings.label')}
        title={t('settings.label')}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" className={styles.aa}>
          A<span>a</span>
        </span>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label={t('settings.label')}
        className={styles.panel}
        hidden={!open}
        onBlur={onBlur}
      >
        <p className={styles.title}>{t('settings.label')}</p>

        <div className={styles.group}>
          <div className={styles.groupHead}>
            <span className={styles.label}>{t('settings.textSize')}</span>
            <span className={styles.value}>{percent.format(settings.fontScale)}</span>
          </div>
          <SegmentedControl
            label={t('settings.textSize')}
            value={closestStep(settings.fontScale)}
            onChange={(fontScale) => updateSettings({ fontScale })}
            options={FONT_SCALE_STEPS.map((s, i) => ({
              value: s,
              ariaLabel: percent.format(s),
              label: (
                <span className={styles.sizeGlyph} style={{ fontSize: `${0.75 + i * 0.13}rem` }}>
                  A
                </span>
              ),
            }))}
          />
          <p className={styles.hint}>{t('settings.textSizeHint')}</p>
        </div>

        <div className={styles.group}>
          <span className={styles.label}>{t('settings.theme')}</span>
          <SegmentedControl
            label={t('settings.theme')}
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
            options={themeOptions}
            className={styles.themes}
          />
        </div>

        <div className={styles.switchRow}>
          <span id={switchLabelId} className={styles.switchLabel}>
            {t('settings.verseNumbers')}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.showVerseNumbers}
            aria-labelledby={switchLabelId}
            className={styles.switch}
            onClick={() => updateSettings({ showVerseNumbers: !settings.showVerseNumbers })}
          >
            <span className={styles.thumb} />
          </button>
        </div>

        {/* Mounted only while open, so the status is asked for when the reader looks at it. */}
        {open && <LiveCompositionSetting />}

        {showTranslation && (
          <div className={styles.group}>
            <TranslationSelect variant="field" />
          </div>
        )}
      </div>
    </div>
  );
}

/** "Live composition" switch + what the inference layer is (or why it is unavailable). */
/** Why live composition is off here, in the reader's language (the client's own reasons and the server's codes). */
function unavailableReason(status: InferenceStatus, locale: Locale): string | undefined {
  const own = locale === 'en' ? undefined : clientMessageId(status.reason);
  return own ? translate(locale, 'engine', `inference.client.${own}`) : statusReasonText(status, locale);
}

function LiveCompositionSetting() {
  const { settings, updateSettings } = useSession();
  const t = useT('shell');
  const { locale } = useI18n();
  const status = useInferenceStatus();
  const labelId = useId();
  const statusId = useId();
  const on = settings.liveComposition;
  const line = !status
    ? t('live.checking')
    : !status.available
      ? t('live.unavailable', { reason: unavailableReason(status, locale) ?? t('live.notRunning') })
      : on
        ? describeAvailable(status, locale)
        : t('live.off', { status: describeAvailable(status, locale) });
  return (
    <div className={styles.liveGroup}>
      <div className={cx(styles.switchRow, styles.switchRowTight)}>
        <span id={labelId} className={styles.switchLabel}>
          {t('live.label')}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby={labelId}
          aria-describedby={statusId}
          className={styles.switch}
          onClick={() => updateSettings({ liveComposition: !on })}
        >
          <span className={styles.thumb} />
        </button>
      </div>
      <p id={statusId} className={styles.hint} data-state={!status ? 'checking' : status.available ? 'available' : 'unavailable'}>
        {line}
      </p>
      <p className={styles.hint}>{t('live.hint')}</p>
    </div>
  );
}

function closestStep(scale: number): number {
  return FONT_SCALE_STEPS.reduce((best, s) => (Math.abs(s - scale) < Math.abs(best - scale) ? s : best), 1 as number);
}
