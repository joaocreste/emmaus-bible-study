import { Check, Languages } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { useI18n, useT } from '../../i18n/I18nProvider';
import { LOCALE_ORDER, LOCALES, type Locale } from '../../i18n/locales';
import { cx } from '../../lib/cx';
import { useSession } from '../../state/session';
import { withLocale } from '../../state/settings';
import styles from './LanguageMenu.module.css';

/**
 * Interface & study language (docs/I18N.md): a menu button in the top bar listing the
 * languages by their own names (English · Português · Español · Français).
 *
 * Menu-button pattern: Enter / Space / ↓ open it on the current language, ↑ on the last;
 * ↑ ↓ Home End and the first letter move; Enter / Space choose; Esc closes and returns
 * to the button; Tab or a click outside closes it. Choosing a language switches the Bible
 * version to that language's default when the current one is in another language.
 */
export function LanguageMenu() {
  const { settings, updateSettings } = useSession();
  const { locale } = useI18n();
  const t = useT('shell');
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  /** which item to focus once the menu has opened (index into LOCALE_ORDER) */
  const pendingFocus = useRef<number | null>(null);
  const menuId = useId();
  const titleId = useId();
  const current = LOCALES[locale];

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const openAt = (index: number) => {
    pendingFocus.current = index;
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const index = pendingFocus.current ?? Math.max(0, LOCALE_ORDER.indexOf(locale));
    pendingFocus.current = null;
    itemRefs.current[index]?.focus();
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
    // Focus the item only when the menu opens, not on every language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = (next: Locale) => {
    if (next !== settings.locale) updateSettings(withLocale(settings, next));
    close(true);
  };

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openAt(e.key === 'ArrowUp' ? LOCALE_ORDER.length - 1 : Math.max(0, LOCALE_ORDER.indexOf(locale)));
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current;
    const at = items.findIndex((el) => el === document.activeElement);
    const move = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    switch (e.key) {
      case 'ArrowDown':
        return move(at + 1);
      case 'ArrowUp':
        return move(at - 1);
      case 'Home':
        return move(0);
      case 'End':
        return move(items.length - 1);
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        return close(true);
      case 'Tab':
        return setOpen(false);
      default: {
        // Type-ahead: the first language whose name starts with the letter typed.
        if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
        const letter = e.key.toLocaleLowerCase();
        const order = LOCALE_ORDER.map((_, i) => (at + 1 + i) % LOCALE_ORDER.length);
        const hit = order.find((i) => LOCALES[LOCALE_ORDER[i]].endonym.toLocaleLowerCase().startsWith(letter));
        if (hit != null) move(hit);
      }
    }
  };

  // Focus leaving the menu (e.g. a screen reader's virtual cursor) closes it.
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
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('language.button', { language: current.endonym })}
        title={t('language.button', { language: current.endonym })}
        onClick={() => (open ? close(false) : openAt(Math.max(0, LOCALE_ORDER.indexOf(locale))))}
        onKeyDown={onButtonKeyDown}
      >
        <Languages aria-hidden="true" className={styles.icon} />
        <span className={styles.code} aria-hidden="true">
          {locale.toUpperCase()}
        </span>
      </button>
      <div ref={panelRef} className={styles.panel} hidden={!open} onBlur={onBlur}>
        <p id={titleId} className={styles.title}>
          {t('language.menu')}
        </p>
        <div id={menuId} role="menu" aria-labelledby={titleId} className={styles.menu} onKeyDown={onMenuKeyDown}>
          {LOCALE_ORDER.map((id, i) => {
            const info = LOCALES[id];
            const checked = id === locale;
            return (
              <button
                key={id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={checked}
                tabIndex={-1}
                lang={info.bcp47}
                className={cx(styles.item, checked && styles.checked)}
                onClick={() => choose(id)}
              >
                <span className={styles.endonym}>{info.endonym}</span>
                {checked && <Check aria-hidden="true" className={styles.check} />}
              </button>
            );
          })}
        </div>
        <p className={styles.note}>{t('language.note')}</p>
      </div>
    </div>
  );
}
